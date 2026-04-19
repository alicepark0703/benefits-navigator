"""Utilities for parallel document + memory retrieval."""

from __future__ import annotations

import asyncio

from langchain_core.documents import Document

from services.memory_service import MemoryService
from services.rag_service import RAGService


async def retrieve_all_context(
    *,
    retrieval_query: str,
    user_query: str,
    user_id: int | None,
    include_memory: bool,
    rag_service: RAGService,
    memory_service: MemoryService,
) -> tuple[list[Document], list[Document]]:
    """Run document RAG and memory RAG in parallel."""
    doc_task = rag_service.retrieve_async(retrieval_query)
    if include_memory and user_id is not None:
        mem_task = memory_service.retrieve_async(user_id=user_id, query=user_query)
    else:
        mem_task = asyncio.sleep(0, result=[])
    documents, memories = await asyncio.gather(doc_task, mem_task)
    return documents, memories
