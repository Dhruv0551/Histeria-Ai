import os
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_core.tools import tool
from tavily import TavilyClient

load_dotenv()


@tool
def search_tool(query: str) -> list:
    """Takes a search query as string and returns top 3 results as a list"""
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


def validate_url(url: str) -> bool:
    try:
        result = urlparse(url=url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False


@tool
def get_data_from_url(url: str) -> str:
    """
    Takes website url as input, and returns
    extracted data from it for further research.
    """
    try:
        if not validate_url(url):
            return "Only http/https urls are allowed"

        page = requests.get(url, timeout=10, headers={"User-Agent": "HisteriaAI/1.0"})
        page.raise_for_status()
        soup = BeautifulSoup(page.text, "html.parser")

        for element in soup(["script", "style", "noscript"]):
            element.decompose()

        return soup.get_text(separator=" ", strip=True)[:12000]

    except requests.exceptions.RequestException as e:
        return f"Error fetching webpage: {e}"


Tools = [search_tool, get_data_from_url]
