"""Conversation memory service backed by a dedicated Chroma collection."""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from uuid import uuid4

from langchain_core.documents import Document

import config
from services.memory_store import get_memory_store


class MemoryService:
    def __init__(self) -> None:
        config.ensure_data_dirs()
        self._vectorstore = get_memory_store()

    def add_memory(self, user_id: int, query: str, answer: str) -> None:
        """Persist a user-assistant turn for future semantic recall."""
        now = datetime.now(timezone.utc).isoformat()
        memory_text = (
            f"User question:\n{query.strip()}\n\n"
            f"Assistant answer:\n{answer.strip()}"
        )
        memory_doc = Document(
            page_content=memory_text,
            metadata={
                "user_id": str(user_id),
                "timestamp": now,
                "memory_type": "conversation_turn",
            },
        )
        self._vectorstore.add_documents(documents=[memory_doc], ids=[str(uuid4())])

    def retrieve(self, user_id: int, query: str, k: int | None = None) -> list[Document]:
        """Retrieve semantically relevant conversation history for this user."""
        top_k = k if k is not None else config.MEMORY_TOP_K
        return self._vectorstore.similarity_search(
            query=query,
            k=top_k,
            filter={"user_id": str(user_id)},
        )

    async def retrieve_async(self, user_id: int, query: str, k: int | None = None) -> list[Document]:
        """Async wrapper around memory retrieval for parallel fanout."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.retrieve, user_id, query, k)
