import json
import logging

from fastapi.responses import StreamingResponse
from langchain.agents import create_agent
from langchain.messages import HumanMessage, SystemMessage
from langgraph.checkpoint.memory import InMemorySaver
from models import groq_model
from prompts import FORMATTER_PROMPT, agent_prompt
from pydantic import ValidationError
from schemas import ResponseFormat
from tools import Tools

logger = logging.getLogger(__name__)

checkpointer = InMemorySaver()


agent = create_agent(
    model=groq_model,
    system_prompt=agent_prompt,
    tools=Tools,
    checkpointer=checkpointer,
)


formatter = groq_model.bind(response_format={"type": "json_object"})


def content_to_text(content) -> str:
    """Convert common LangChain message content formats to text."""

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts = []

        for block in content:
            if isinstance(block, str):
                parts.append(block)

            elif isinstance(block, dict):
                if block.get("type") == "text":
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
    """Preserve assistant findings and tool results for formatting."""

    transcript = []

    role_names = {
        "human": "USER",
        "ai": "ASSISTANT",
        "tool": "TOOL RESULT",
    }

    for message in messages:
        role = role_names.get(
            getattr(message, "type", ""),
            "MESSAGE",
        )

        content = content_to_text(getattr(message, "content", ""))

        if not content.strip():
            continue

        transcript.append(f"{role}:\n{content}")

    return "\n\n".join(transcript)


async def format_research(
    research_text: str,
) -> ResponseFormat:
    """Generate JSON and validate it against the Pydantic schema."""

    response = await formatter.ainvoke(
        [
            SystemMessage(content=FORMATTER_PROMPT),
            HumanMessage(content=research_text),
        ]
    )

    raw_content = content_to_text(response.content)

    try:
        data = json.loads(raw_content)
        return ResponseFormat.model_validate(data)

    except (json.JSONDecodeError, ValidationError) as exc:
        logger.exception("Research report formatting or validation failed")
        raise ValueError("The generated research report was invalid.") from exc


def sse_event(event_type: str, content=None) -> str:
    """Build a Server-Sent Event."""

    payload = {"type": event_type}

    if content is not None:
        payload["content"] = content

    return f"data: {json.dumps(payload, ensure_ascii=False, default=str)}\n\n"


async def stream_user_query(query: str, thread_id: str):
    config = {
        "configurable": {
            "thread_id": thread_id,
        }
    }

    try:
        # Record how many messages existed before this turn.
        # This lets us isolate the current turn from prior conversation
        # history when preparing the formatter input.
        previous_state = await agent.aget_state(config)

        previous_messages = (
            previous_state.values.get("messages", []) if previous_state else []
        )

        previous_count = len(previous_messages)

        yield sse_event("status", "Research started")

        # 3. Stream progress while the research agent runs.
        # We deliberately do not stream raw model tokens to the UI,
        # because the frontend should display the consistent report.
        async for mode, chunk in agent.astream(
            {"messages": [HumanMessage(content=query)]},
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

                yield sse_event("status", status)

        # 4. Read the completed, checkpointed agent state.
        final_state = await agent.aget_state(config)
        all_messages = final_state.values.get("messages", [])

        # Only format messages added during this turn.
        current_messages = all_messages[previous_count:]

        research_transcript = build_research_transcript(current_messages)

        if not research_transcript.strip():
            raise ValueError("The research agent returned no findings.")

        yield sse_event("status", "Formatting research report")

        report = await format_research(research_transcript)

        yield sse_event("result", report.model_dump(mode="json"))

        yield sse_event("done")

    except Exception:
        logger.exception("Failed to process research query")

        yield sse_event(
            "error",
            "Unable to complete the research request. Please try again.",
        )

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
