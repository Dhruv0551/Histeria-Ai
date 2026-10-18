import os

from dotenv import load_dotenv
from langchain_core.tools import tool
from tavily import TavilyClient

load_dotenv()


@tool
def search_tool(query: str) -> list:
    tav_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    response = tav_client.search(query)

    results = response.get("results", [])
    relevant_results = []
    top_results = sorted(
        results, key=lambda item: item.get("score") or 0, reverse=True
    )[:3]

    for result in top_results:
        relevant_results.append(
            {
                "title": result.get("title"),
                "summary": result.get("content"),
                "url": result.get("url"),
            }
        )

    return relevant_results
