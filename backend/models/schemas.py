"""API request and response schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    household_size: int | None = None
    annual_income: float | None = None
    state: str | None = None
    employment_status: str | None = None
    has_dependents: bool | None = None
    age: int | None = None


class QueryRequest(BaseModel):
    query: str | None = Field(
        default=None,
        description="Optional custom user question; backend applies a default when omitted or empty.",
    )
    user_profile: UserProfile


class QueryResponse(BaseModel):
    answer: str
    eligible_programs: list[str]
    sources: list[dict]


class DocumentInfo(BaseModel):
    filename: str
    file_hash: str
    chunk_count: int
    ingested_at: datetime
    last_modified: datetime


class SyncResponse(BaseModel):
    added: int
    updated: int
    deleted: int
    total_documents: int


class StatusResponse(BaseModel):
    total_documents: int
    total_chunks: int
    last_sync: datetime | None
