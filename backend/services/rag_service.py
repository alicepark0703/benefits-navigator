"""Retrieve relevant program chunks from Chroma."""

from __future__ import annotations

import asyncio

from langchain_core.documents import Document

import config
from services.vector_store import get_chroma


class RAGService:
    def __init__(self) -> None:
        config.ensure_data_dirs()
        self._vectorstore = get_chroma()

    def retrieve(self, query: str, k: int | None = None) -> list[Document]:
        top_k = k if k is not None else config.RAG_TOP_K
        return self._vectorstore.similarity_search(query, k=top_k)

    async def retrieve_async(self, query: str, k: int | None = None) -> list[Document]:
        """Async wrapper to enable parallel retrieval fanout."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.retrieve, query, k)
