"""Query construction and system-style prompts for benefits RAG."""

from __future__ import annotations

import re
from typing import Any

from langchain_core.documents import Document

from models.schemas import UserProfile

SYSTEM_INSTRUCTIONS = """You are a benefits eligibility assistant helping low-income individuals understand public assistance programs.

Based on the user's profile and the following program information, determine:
1. Which programs they are likely eligible for
2. What programs they may be missing
3. Which combination of benefits would most reduce their instability

Provide specific, actionable guidance. Cite the programs by name and explain why they may or may not qualify based on the eligibility criteria in the documents and their informaiton.

Important: You are not a lawyer or caseworker. Encourage the user to verify details with official program offices."""


def user_profile_to_dict(profile: UserProfile) -> dict[str, Any]:
    return profile.model_dump(exclude_none=True)


def construct_retrieval_query(user_query: str, user_profile: UserProfile) -> str:
    """Build a single string for embedding / similarity search."""
    data = user_profile_to_dict(user_profile)
    lines = [f"- {k.replace('_', ' ')}: {v}" for k, v in data.items()]
    profile_block = "\n".join(lines) if lines else "- (no profile fields provided)"
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


def build_llm_prompt(retrieved_context: str, user_query: str, user_profile: UserProfile) -> str:
    data = user_profile_to_dict(user_profile)
    profile_lines = [f"- {k.replace('_', ' ')}: {v}" for k, v in data.items()]
    profile_block = "\n".join(profile_lines) if profile_lines else "- (no profile fields provided)"
    return f"""{SYSTEM_INSTRUCTIONS}

Program information (retrieved excerpts):
{retrieved_context}

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
