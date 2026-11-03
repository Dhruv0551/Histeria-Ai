import logging
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq

logger = logging.getLogger(__name__)

current_dir = Path(__file__).resolve().parent
backend_env = current_dir / ".env"
root_env = current_dir.parent / ".env"

if backend_env.exists():
    load_dotenv(dotenv_path=backend_env)
elif root_env.exists():
    load_dotenv(dotenv_path=root_env)
else:
    load_dotenv()

groq_key = os.getenv("GROQ_API_KEY", "").strip()

if not groq_key:
    logger.warning(
        "\n" + "=" * 65 + "\n"
        "[WARNING] GROQ_API_KEY is not set in backend/.env!\n"
        "Please add GROQ_API_KEY to your .env file.\n"
        "Key can be obtained from: https://console.groq.com/keys\n" +
        "=" * 65 + "\n"
    )
    groq_key = "MISSING_GROQ_API_KEY"

DEFAULT_GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
CLASSIFIER_MODEL_NAME = os.getenv("GROQ_CLASSIFIER_MODEL", "openai/gpt-oss-20b")
RESEARCH_MODEL_NAME = os.getenv("GROQ_RESEARCH_MODEL", DEFAULT_GROQ_MODEL)
SYNTHESIZER_MODEL_NAME = os.getenv("GROQ_SYNTHESIZER_MODEL", DEFAULT_GROQ_MODEL)

classifier_model = ChatGroq(model=CLASSIFIER_MODEL_NAME, api_key=groq_key)
research_model = ChatGroq(model=RESEARCH_MODEL_NAME, api_key=groq_key)
groq_model = ChatGroq(model=SYNTHESIZER_MODEL_NAME, api_key=groq_key)
