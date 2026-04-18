"""LLM abstraction: Ollama (local) or Groq (cloud)."""

from __future__ import annotations

from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama

import config


class LLMService:
    def __init__(self) -> None:
        if config.LLM_PROVIDER == "groq":
            if not config.GROQ_API_KEY:
                raise ValueError(
                    "GROQ_API_KEY is required when LLM_PROVIDER=groq. "
                    "Set it in your environment or switch to LLM_PROVIDER=ollama."
                )
            self._llm = ChatGroq(
                model=config.GROQ_MODEL,
                api_key=config.GROQ_API_KEY,
                temperature=0.3,
            )
        else:
            self._llm = ChatOllama(
                model=config.OLLAMA_MODEL,
                base_url=config.OLLAMA_BASE_URL,
                temperature=0.3,
            )

    def generate(self, prompt: str) -> str:
        """Generate a completion from a single user-style prompt string."""
        message = HumanMessage(content=prompt)
        response = self._llm.invoke([message])
        content = getattr(response, "content", None)
        if isinstance(content, str):
            return content
        if isinstance(content, list):
            # Some providers return list of content parts
            parts: list[str] = []
            for block in content:
                if isinstance(block, str):
                    parts.append(block)
                elif isinstance(block, dict) and "text" in block:
                    parts.append(str(block["text"]))
            return "".join(parts)
        return str(response)
