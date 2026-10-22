import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()
groq_key = os.getenv("GROQ_API_KEY")
groq_model = ChatGroq(model="openai/gpt-oss-120b", api_key=groq_key)
