import logging
import os
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_core.tools import tool
from tavily import TavilyClient

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

_tavily_client: TavilyClient | None = None


def _get_tavily() -> TavilyClient:
    global _tavily_client
    if _tavily_client is None:
        tavily_key = os.getenv("TAVILY_API_KEY", "").strip()
        _tavily_client = TavilyClient(api_key=tavily_key)
    return _tavily_client


@lru_cache(maxsize=256)
def _cached_search(query: str) -> tuple:
    tav_client = _get_tavily()
    response = tav_client.search(query)
    results = response.get("results", [])
    top_results = sorted(
        results, key=lambda item: item.get("score") or 0, reverse=True
    )[:5]

    relevant_results = []
    for result in top_results:
        content = result.get("content") or ""
        relevant_results.append(
            {
                "title": result.get("title", ""),
                "summary": content[:400],
                "url": result.get("url", ""),
            }
        )
    return tuple(relevant_results)


@tool
def search_tool(query: str) -> list:
    """Takes a search query as string and returns top 5 results as a list."""
    tavily_key = os.getenv("TAVILY_API_KEY", "").strip()
    if not tavily_key or tavily_key == "your_tavily_api_key_here":
        logger.warning("TAVILY_API_KEY is not set. Returning informative notice.")
        return [
            {
                "title": "Tavily Search Unavailable",
                "summary": "TAVILY_API_KEY is not configured in backend/.env. Live web search is currently unavailable.",
                "url": "https://tavily.com",
            }
        ]

    try:
        return list(_cached_search(query))
    except Exception as e:
        logger.error("Tavily search execution failed: %s", e)
        return [
            {
                "title": "Search Error",
                "summary": f"Web search could not be completed: {str(e)}. Please check your TAVILY_API_KEY in backend/.env.",
                "url": "https://tavily.com",
            }
        ]


def validate_url(url: str) -> bool:
    try:
        result = urlparse(url=url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False


@tool
async def get_data_from_url(url: str) -> str:
    """Takes website url as input and returns extracted text content."""
    if not validate_url(url):
        return "Only http/https urls are allowed"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers={"User-Agent": "HisteriaAI/1.0"})
            resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        for element in soup(["script", "style", "noscript"]):
            element.decompose()

        return soup.get_text(separator=" ", strip=True)[:3000]
    except httpx.RequestError as e:
        return f"Error fetching webpage: {e}"
    except httpx.HTTPStatusError as e:
        return f"HTTP error {e.response.status_code} fetching webpage: {e}"


Tools = [search_tool, get_data_from_url]
