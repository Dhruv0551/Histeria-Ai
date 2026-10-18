from langchain.agents import create_agent
from langchain_core.output_parsers import StrOutputParser

from models import groq_model


def process_user_query(query: str):
    chat_history = []

    op_parser = StrOutputParser()
    response_chain = groq_model | op_parser
    response = response_chain.invoke(query)
    return response
