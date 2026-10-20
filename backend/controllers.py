import json

from fastapi.responses import StreamingResponse
from langchain.agents import create_agent
from models import groq_model
from prompts import agent_prompt
from tools import Tools

agent = create_agent(
    model=groq_model,
    system_prompt=agent_prompt,
    tools=Tools,
)


async def stream_user_query(query: str):
    async for mode, chunk in agent.astream(
        {"messages": [{"role": "user", "content": query}]},
        stream_mode=["updates", "messages"],
    ):
        if mode == "messages":
            message_chunk, metadata = chunk

            if metadata.get("langgraph_node") != "model":
                continue

            if getattr(message_chunk, "tool_calls", None):
                continue

            content = message_chunk.content

            if isinstance(content, str) and content:
                yield (f"data: {json.dumps({'type': 'token', 'content': content})}\n\n")

            elif isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        yield (
                            f"data: {json.dumps({'type': 'token', 'content': block['text']})}\n\n"
                        )

        elif mode == "updates":
            for node in chunk:
                if node != "model":
                    yield (
                        f"data: {json.dumps({'type': 'status', 'content': node})}\n\n"
                    )

    yield f"data: {json.dumps({'type': 'done'})}\n\n"


def process_user_query(query: str):
    return StreamingResponse(
        stream_user_query(query),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
