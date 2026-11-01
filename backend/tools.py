import logging
import os
from pathlib import Path
from urllib.parse import urlparse
import requests
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


@tool
def search_tool(query: str) -> list:
    """Takes a search query as string and returns top 3 results as a list."""
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
        tav_client = TavilyClient(api_key=tavily_key)
        response = tav_client.search(query)
        results = response.get("results", [])
        top_results = sorted(
            results, key=lambda item: item.get("score") or 0, reverse=True
        )[:3]

        relevant_results = []
        for result in top_results:
            content = result.get("content") or ""
            relevant_results.append(
                {
                    "title": result.get("title", ""),
                    "summary": content[:600],
                    "url": result.get("url", ""),
                }
            )
        return relevant_results
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
def get_data_from_url(url: str) -> str:
    """Takes website url as input and returns extracted text content."""
    try:
        if not validate_url(url):
            return "Only http/https urls are allowed"

        page = requests.get(url, timeout=10, headers={"User-Agent": "HisteriaAI/1.0"})
        page.raise_for_status()
        soup = BeautifulSoup(page.text, "html.parser")

        for element in soup(["script", "style", "noscript"]):
            element.decompose()

        return soup.get_text(separator=" ", strip=True)[:3000]
    except requests.exceptions.RequestException as e:
        return f"Error fetching webpage: {e}"


Tools = [search_tool, get_data_from_url]
