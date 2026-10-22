from typing import Literal

from pydantic import BaseModel, Field


class Query(BaseModel):
    query: str


class Source(BaseModel):
    title: str = Field(description="Title of the Source")
    url: str = Field(description="Actual Source of the url")
    relevance: str = Field(description="What the Source Supports")


class ResponseFormat(BaseModel):
    answer: str = Field(description="Direct Answer of user's Query")
    key_points: list[str] = Field(description="Points Supporting the Answers")
    sources: list[Source] = Field(description="Sources actually consulted")
    limitations: list[str] = Field(description="Limitations if any, else leave empty")
