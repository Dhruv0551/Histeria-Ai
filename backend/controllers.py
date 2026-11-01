import json
import logging
import os
import uuid
from fastapi.responses import StreamingResponse
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import InMemorySaver
from models import classifier_model, groq_model, research_model
from prompts import CLASSIFIER_PROMPT, FORMATTER_PROMPT, RESEARCH_AGENT_PROMPT
from pydantic import ValidationError
from schemas import QueryClassification, ResponseFormat
from tools import Tools

logger = logging.getLogger(__name__)

checkpointer = InMemorySaver()

research_agent = create_agent(
    model=research_model,
    system_prompt=RESEARCH_AGENT_PROMPT,
    tools=Tools,
    checkpointer=checkpointer,
)

synthesizer = groq_model.bind(response_format={"type": "json_object"})
classifier = classifier_model.bind(response_format={"type": "json_object"})


def content_to_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and block.get("type") == "text":
                text = block.get("text", "")
                if text:
                    parts.append(text)
        return "\n".join(parts)
    if content is None:
        return ""
    if isinstance(content, (dict, list)):
        return json.dumps(content, ensure_ascii=False, default=str)
    return str(content)


def build_research_transcript(messages) -> str:
    transcript = []
    role_names = {
        "human": "USER",
        "ai": "ASSISTANT",
        "tool": "TOOL RESULT",
    }
    for message in messages:
        role = role_names.get(getattr(message, "type", ""), "MESSAGE")
        content = content_to_text(getattr(message, "content", ""))
        if content.strip():
            transcript.append(f"{role}:\n{content}")
    return "\n\n".join(transcript)


def sse_event(event_type: str, content=None) -> str:
    payload = {"type": event_type}
    if content is not None:
        payload["content"] = content
    return f"data: {json.dumps(payload, ensure_ascii=False, default=str)}\n\n"


async def classify_query(query: str) -> QueryClassification:
    response = await classifier.ainvoke(
        [
            SystemMessage(content=CLASSIFIER_PROMPT),
            HumanMessage(content=query),
        ]
    )
    raw = content_to_text(response.content)
    try:
        data = json.loads(raw)
        data.setdefault("original_query", query)
        return QueryClassification.model_validate(data)
    except (json.JSONDecodeError, ValidationError):
        return QueryClassification(
            intent="research",
            complexity="moderate",
            needs_tools=True,
            research_directive=f"Research and answer: {query}",
            original_query=query,
        )


async def run_research_agent(classification: QueryClassification, thread_id: str):
    research_thread_id = f"{thread_id}_{uuid.uuid4().hex[:8]}"
    config = {"configurable": {"thread_id": research_thread_id}}

    directive_message = (
        f"[Research Directive]\n{classification.research_directive}\n\n"
        f"[Original Query]\n{classification.original_query}"
    )

    events = []
    async for mode, chunk in research_agent.astream(
        {"messages": [HumanMessage(content=directive_message)]},
        config=config,
        stream_mode=["updates"],
    ):
        if mode != "updates":
            continue
        for node in chunk:
            if node == "model":
                status = "Researching"
            elif node == "tools":
                status = "Using research tools"
            else:
                status = f"Processing: {node}"
            events.append(sse_event("status", status))

    final_state = await research_agent.aget_state(config)
    all_messages = final_state.values.get("messages", []) if final_state else []

    transcript = build_research_transcript(all_messages)
    return transcript, events


async def synthesize_response(original_query: str, research_transcript: str) -> ResponseFormat:
    trimmed_transcript = research_transcript[:6000] if len(research_transcript) > 6000 else research_transcript
    synthesis_input = (
        f"[ORIGINAL USER QUERY]\n{original_query}\n\n"
        f"[RESEARCH TRANSCRIPT]\n{trimmed_transcript}"
    )
    response = await synthesizer.ainvoke(
        [
            SystemMessage(content=FORMATTER_PROMPT),
            HumanMessage(content=synthesis_input),
        ]
    )
    raw = content_to_text(response.content)
    data = json.loads(raw)
    return ResponseFormat.model_validate(data)


def format_error_message(exc: Exception) -> str:
    """Format exceptions into actionable, user-friendly error diagnostics."""
    chain = []
    current = exc
    while current and len(chain) < 5:
        chain.append(current)
        current = current.__cause__ or current.__context__

    full_str = " | ".join(str(e) for e in chain)
    all_types = " | ".join(type(e).__name__ for e in chain)

    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if not groq_key or groq_key == "MISSING_GROQ_API_KEY":
        return (
            "Configuration Error: GROQ_API_KEY is missing or empty in backend/.env.\n\n"
            "Please create or edit 'backend/.env' with your Groq API key:\n"
            "  GROQ_API_KEY=gsk_your_key_here\n\n"
            "You can generate a free key at https://console.groq.com/keys"
        )

    if (
        "NotFoundError" in all_types
        or "model_not_found" in full_str
        or "does not exist or you do not have access" in full_str
    ):
        return (
            "Groq Model Error (404 Not Found): The requested model does not exist or your Groq account does not have access to it.\n\n"
            f"API Details: {exc}\n\n"
            "Recommended Fix:\n"
            "Update 'GROQ_MODEL' in backend/.env to a supported model. For example:\n"
            "• GROQ_MODEL=openai/gpt-oss-120b (High-capability reasoning)\n"
            "• GROQ_MODEL=openai/gpt-oss-20b (Fast & lightweight)\n\n"
            "Check currently active models at https://console.groq.com/docs/models"
        )

    if (
        "AuthenticationError" in all_types
        or "invalid_api_key" in full_str
        or "Error code: 401" in full_str
    ):
        return (
            "Groq Authentication Failed (401 Unauthorized): The GROQ_API_KEY in backend/.env is invalid or expired.\n\n"
            "Fix:\n"
            "Generate a new API key at https://console.groq.com/keys and update GROQ_API_KEY in backend/.env."
        )

    if (
        "RateLimitError" in all_types
        or "rate_limit_exceeded" in full_str
        or "Error code: 429" in full_str
    ):
        return (
            "Groq Rate Limit Exceeded (429): You have hit the requests or tokens per minute limit.\n\n"
            "Fix:\n"
            "1. Wait 30-60 seconds before submitting another query.\n"
            "2. Or configure a lighter model in backend/.env: GROQ_MODEL=openai/gpt-oss-20b"
        )

    if (
        "APIConnectionError" in all_types
        or "ConnectError" in all_types
        or "getaddrinfo failed" in full_str
    ):
        return (
            "Network Connection Error: Could not connect to the Groq API server.\n\n"
            "Please check your internet connection and network/proxy settings."
        )

    if "tavily" in full_str.lower():
        return (
            f"Tavily Web Search Error: {exc}\n\n"
            "Fix: Verify your TAVILY_API_KEY in backend/.env. Obtain a key at https://tavily.com"
        )

    if "JSONDecodeError" in all_types or "ValidationError" in all_types:
        return (
            f"Response Formatting Error: Failed to generate a valid structured report.\n\n"
            f"Details: {exc}"
        )

    return f"Execution Error ({type(exc).__name__}): {exc}"


async def stream_user_query(query: str, thread_id: str):
    try:
        groq_key = os.getenv("GROQ_API_KEY", "").strip()
        if not groq_key or groq_key == "MISSING_GROQ_API_KEY":
            yield sse_event(
                "error",
                "Configuration Error: GROQ_API_KEY is not configured in backend/.env.\n\n"
                "To fix this:\n"
                "1. Open 'backend/.env'\n"
                "2. Add your Groq API key: GROQ_API_KEY=gsk_...\n"
                "3. Restart the backend server.",
            )
            yield sse_event("done")
            return

        yield sse_event("status", "Classifying query")
        classification = await classify_query(query)
        yield sse_event(
            "classification",
            {
                "intent": classification.intent,
                "complexity": classification.complexity,
                "needs_tools": classification.needs_tools,
            },
        )

        yield sse_event("status", "Starting research")

        if classification.needs_tools:
            research_transcript, research_events = await run_research_agent(
                classification, thread_id
            )
            for event in research_events:
                yield event
        else:
            response = await research_model.ainvoke(
                [
                    SystemMessage(content=RESEARCH_AGENT_PROMPT),
                    HumanMessage(
                        content=(
                            f"[Research Directive]\n{classification.research_directive}\n\n"
                            f"[Original Query]\n{classification.original_query}"
                        )
                    ),
                ]
            )
            research_transcript = content_to_text(response.content)
            yield sse_event("status", "Direct response generated")

        if not research_transcript.strip():
            raise ValueError("Research returned no findings.")

        yield sse_event("status", "Synthesizing final report")
        report = await synthesize_response(
            original_query=classification.original_query,
            research_transcript=research_transcript,
        )

        yield sse_event("result", report.model_dump(mode="json"))
        yield sse_event("done")

    except Exception as exc:
        logger.exception("Failed to process query: %s", query)
        friendly_error = format_error_message(exc)
        yield sse_event("error", friendly_error)
        yield sse_event("done")


def process_user_query(query: str, thread_id: str):
    return StreamingResponse(
        stream_user_query(query, thread_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
