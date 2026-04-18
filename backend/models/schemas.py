"""API request and response schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Any

from pydantic import BaseModel, ConfigDict, Field, EmailStr


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase."""
    parts = string.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])


class UserProfile(BaseModel):
    """User profile matching frontend EligibilityForm fields."""

    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
    )

    # Location
    state: str | None = None
    county: str | None = None  # ZIP code in frontend

    # Citizenship
    citizenship_status: Literal["citizen", "nonCitizen", "undocumented", ""] | None = None

    # Household
    household_size: int | None = None
    num_adults: int | None = None
    num_children: int | None = None
    pregnancy_status: Literal["yes", "no", ""] | None = None

    # Income & assets
    annual_income: float | None = None
    assets: float | None = None

    # Employment
    employment_status: Literal["fulltime", "parttime", "unemployed", "selfemployed", "retired", ""] | None = None
    hours_per_week: float | None = None

    # Education
    student_status: Literal["yes", "no", ""] | None = None
    student_group: Literal["precollege", "undergrad", "grad", "postgrad", "other", ""] | None = None

    # Housing
    housing_status: Literal["rent", "own", "homeless", "other", ""] | None = None
    monthly_rent: float | None = None
    monthly_utilities: float | None = None

    # Additional details
    disability_status: Literal["yes", "no", ""] | None = None
    veteran_status: Literal["yes", "no", ""] | None = None
    age_over_60: Literal["yes", "no", ""] | None = None
    receives_ssi: Literal["yes", "no", ""] | None = None


class QueryRequest(BaseModel):
    query: str | None = Field(
        default=None,
        description="Optional custom user question; backend applies a default when omitted or empty.",
    )
    user_profile: UserProfile
    user_id: int | None = None


class QueryResponse(BaseModel):
    answer: str
    eligible_programs: list[str]
    sources: list[dict[str, Any]]


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


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr


class AuthResponse(BaseModel):
    message: str
    user: UserResponse
    has_eligibility_profile: bool
    eligibility_data: UserProfile | None = None
    selected_programs: list[str] = []