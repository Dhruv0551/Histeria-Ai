from contextlib import asynccontextmanager
import logging
import os
import uuid
from controllers import process_user_query
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import (
    CLASSIFIER_MODEL_NAME,
    RESEARCH_MODEL_NAME,
    SYNTHESIZER_MODEL_NAME,
)
from schemas import Query

logger = logging.getLogger("histeria-backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    tavily_key = os.getenv("TAVILY_API_KEY", "").strip()

    missing = []
    if not groq_key or groq_key == "MISSING_GROQ_API_KEY":
        missing.append("GROQ_API_KEY")
    if not tavily_key:
        missing.append("TAVILY_API_KEY")

    if missing:
        logger.warning(
            "\n" + "=" * 65 + "\n"
            f"[ENV WARNING] Missing configuration keys: {', '.join(missing)}\n"
            "Please check your backend/.env file.\n"
            "• GROQ_API_KEY is required for classification, research, and synthesis.\n"
            "• TAVILY_API_KEY is required for live web search tools.\n" +
            "=" * 65
        )
    else:
        logger.info(
            f"[BOOT] Environment ready. Models: Classifier={CLASSIFIER_MODEL_NAME}, Research={RESEARCH_MODEL_NAME}, Synthesizer={SYNTHESIZER_MODEL_NAME}"
        )
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def default():
    groq_configured = bool(
        os.getenv("GROQ_API_KEY")
        and os.getenv("GROQ_API_KEY") != "MISSING_GROQ_API_KEY"
    )
    tavily_configured = bool(os.getenv("TAVILY_API_KEY"))
    return {
        "service": "Histeria-AI Backend",
        "status": "ok" if groq_configured else "degraded",
        "env": {
            "groq_configured": groq_configured,
            "tavily_configured": tavily_configured,
        },
        "models": {
            "classifier": CLASSIFIER_MODEL_NAME,
            "research": RESEARCH_MODEL_NAME,
            "synthesizer": SYNTHESIZER_MODEL_NAME,
        },
    }


@app.post("/query")
def processQuery(request: Query):
    thread_id = request.thread_id or str(uuid.uuid4())
    return process_user_query(request.query, thread_id)

