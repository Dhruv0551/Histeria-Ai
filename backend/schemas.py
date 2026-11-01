from typing import Literal
from pydantic import BaseModel, Field


class Query(BaseModel):
    query: str
    thread_id: str | None = None


class QueryClassification(BaseModel):
    intent: Literal["factual", "research", "comparison", "creative", "conversational"] = Field(
        description="Primary intent of the query."
    )
    complexity: Literal["simple", "moderate", "complex"] = Field(
        description="Estimated complexity."
    )
    needs_tools: bool = Field(
        description="Whether research tools should be used."
    )
    research_directive: str = Field(
        description="Specific task instruction for the research model."
    )
    original_query: str = Field(
        description="Verbatim user query."
    )


class Source(BaseModel):
    title: str = Field(description="Title of the Source")
    url: str = Field(description="Actual Source of the url")
    relevance: str = Field(description="What the Source Supports")


class ResponseFormat(BaseModel):
    answer: str = Field(description="Direct Answer of user's Query")
    key_points: list[str] = Field(description="Points Supporting the Answers")
    sources: list[Source] = Field(description="Sources actually consulted")
    limitations: list[str] = Field(description="Limitations if any, else leave empty")
