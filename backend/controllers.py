import json

from fastapi.responses import StreamingResponse
from langchain.agents import create_agent
from langchain.messages import HumanMessage
from langgraph.checkpoint.memory import InMemorySaver
from models import groq_model
from prompts import agent_prompt
from schemas import ResponseFormat
from tools import Tools

checkpointer = InMemorySaver()


agent = create_agent(
    model=groq_model,
    system_prompt=agent_prompt,
    tools=Tools,
    checkpointer=checkpointer,
    response_format=ResponseFormat,
)


async def stream_user_query(query: str, thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}

    async for mode, chunk in agent.astream(
        {"messages": [HumanMessage(content=query)]},
        config=config,
        stream_mode=["updates", "messages"],
    ):
        if mode == "messages":
            message_chunk, metadata = chunk

            if metadata.get("langgraph_node") != "model":
                continue

            content = message_chunk.content

            if isinstance(content, str) and content:
                yield (f"data: {json.dumps({'type': 'token', 'content': content})}\n\n")

            elif isinstance(content, list):
                for block in content:
                    if (
                        isinstance(block, dict)
                        and block.get("type") == "text"
                        and block.get("text")
                    ):
                        yield (
                            f"data: {
                                json.dumps({'type': 'token', 'content': block['text']})
                            }\n\n"
                        )

        elif mode == "updates":
            for node in chunk:
                if node != "model":
                    yield (
                        f"data: {json.dumps({'type': 'status', 'content': node})}\n\n"
                    )

    yield f"data: {json.dumps({'type': 'done'})}\n\n"


def process_user_query(query: str, thread_id: str):
    return StreamingResponse(
        stream_user_query(query, thread_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
