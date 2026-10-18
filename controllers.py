from tabnanny import verbose

from langchain.agents import create_agent

from models import groq_model
from prompts import agent_prompt
from tools import Tools


async def stream_user_query(query: str):
    async for mode, chunk in agent.astream(
        {"messages": [{"role": "user", "content": query}]},
        stream_mode=["updates", "messages"],
    ):
        if mode == "messages":
            message_chunk, metadata = chunk

            content = message_chunk.content

            if content:
                if isinstance(content, str):
                    yield f"data: {json.dumps({'type': 'token', 'content': content})}\n\n"
                elif isinstance(content, list):
                    for block in content:
                        if isinstance(block, dict) and block.get("type") == "text":
                            yield f"data: {json.dumps({'type': 'token', 'content': block['text']})}\n\n"

        elif mode == "updates":
            for node, update in chunk.items():
                if node != "model":
                    yield f"data: {json.dumps({'type': 'status', 'content': node})}\n\n"

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
