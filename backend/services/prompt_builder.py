"""Query construction and system-style prompts for benefits RAG."""

from __future__ import annotations

import re
from typing import Any

from langchain_core.documents import Document

from models.schemas import UserProfile

SYSTEM_INSTRUCTIONS = """You are a benefits eligibility assistant helping low-income individuals understand public assistance programs.

Based on my profile and the following program information, answer my question.

Provide specific, brief, actionable guidance. Cite the programs by name and explain your answers based on the documents and their information.

Important: You are not a lawyer or caseworker. Encourage me to verify details with official program offices."""


FIELD_LABELS = {
    "state": "State",
    "county": "ZIP Code",
    "citizenship_status": "Citizenship Status",
    "household_size": "Household Size",
    "num_adults": "Number of Adults",
    "num_children": "Number of Children",
    "pregnancy_status": "Anyone Pregnant",
    "annual_income": "Annual Household Income",
    "assets": "Total Assets",
    "employment_status": "Employment Status",
    "hours_per_week": "Hours Worked Per Week",
    "student_status": "Student",
    "student_group": "Student Type",
    "housing_status": "Housing Status",
    "monthly_rent": "Monthly Rent",
    "monthly_utilities": "Monthly Utilities",
    "disability_status": "Has Disability",
    "veteran_status": "Veteran",
    "age_over_60": "Age 60 or Older",
    "receives_ssi": "Receives SSI",
}

VALUE_LABELS = {
    "citizen": "U.S. Citizen",
    "nonCitizen": "Non-Citizen",
    "undocumented": "Undocumented",
    "fulltime": "Full-Time",
    "parttime": "Part-Time",
    "unemployed": "Unemployed",
    "selfemployed": "Self-Employed",
    "retired": "Retired",
    "precollege": "Pre-College",
    "undergrad": "Undergraduate",
    "grad": "Graduate",
    "postgrad": "Post-Graduate",
    "rent": "Renter",
    "own": "Homeowner",
    "homeless": "Homeless",
    "other": "Other",
    "yes": "Yes",
    "no": "No",
}


def format_value(key: str, value: Any) -> str:
    """Format a profile value for display."""
    if value is None or value == "":
        return ""
    if isinstance(value, str) and value in VALUE_LABELS:
        return VALUE_LABELS[value]
    if key in ("annual_income", "assets", "monthly_rent", "monthly_utilities"):
        return f"${value:,.0f}" if isinstance(value, (int, float)) else str(value)
    return str(value)


def user_profile_to_dict(profile: UserProfile) -> dict[str, Any]:
    return profile.model_dump(exclude_none=True, by_alias=False)


def build_profile_summary(profile: UserProfile) -> str:
    """Build a human-readable profile summary for prompts."""
    data = user_profile_to_dict(profile)
    lines: list[str] = []

    for field, label in FIELD_LABELS.items():
        value = data.get(field)
        if value is None or value == "":
            continue
        formatted = format_value(field, value)
        if formatted:
            lines.append(f"- {label}: {formatted}")

    return "\n".join(lines) if lines else "- (no profile information provided)"


def construct_retrieval_query(user_query: str, user_profile: UserProfile) -> str:
    """Build a single string for embedding / similarity search."""
    profile_block = build_profile_summary(user_profile)
    return (
        "User profile context for retrieval:\n"
        f"{profile_block}\n\n"
        f"User question:\n{user_query.strip()}"
    ).strip()


def build_context_from_documents(documents: list[Document]) -> str:
    parts: list[str] = []
    for i, doc in enumerate(documents, start=1):
        src = doc.metadata.get("source_file") or doc.metadata.get("source", "unknown")
        parts.append(f"[{i}] (source: {src})\n{doc.page_content.strip()}")
    return "\n\n".join(parts).strip()


def build_memory_context(memories: list[Document]) -> str:
    parts: list[str] = []
    for i, memory in enumerate(memories, start=1):
        timestamp = memory.metadata.get("timestamp", "unknown-time")
        parts.append(f"[{i}] (time: {timestamp})\n{memory.page_content.strip()}")
    return "\n\n".join(parts).strip()


def build_llm_prompt(
    retrieved_context: str,
    memory_context: str,
    user_query: str,
    user_profile: UserProfile,
) -> str:
    profile_block = build_profile_summary(user_profile)
    memory_block = memory_context or "(no relevant prior conversation context)"
    return f"""{SYSTEM_INSTRUCTIONS}

Program information (retrieved excerpts):
{retrieved_context}

Relevant prior conversation memory:
{memory_block}

User profile:
{profile_block}

User question:
{user_query.strip()}
"""


def extract_eligible_program_mentions(answer: str, max_items: int = 15) -> list[str]:
    """Lightweight heuristic: pull bullet / numbered list lines from the model output."""
    items: list[str] = []
    for match in re.finditer(r"(?:^|\n)\s*(?:[-*]|\d+\.)\s*(.+)", answer):
        line = match.group(1).strip()
        if 3 <= len(line) <= 200:
            items.append(line)
        if len(items) >= max_items:
            break
    # De-duplicate preserving order
    seen: set[str] = set()
    unique: list[str] = []
    for item in items:
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
    return unique
