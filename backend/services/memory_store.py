"""Dedicated Chroma collection for conversation memory."""

from __future__ import annotations

from langchain_chroma import Chroma

import config
from services.vector_store import get_embeddings

_memory_store: Chroma | None = None


def get_memory_store() -> Chroma:
    """Singleton Chroma client for conversation memory."""
    global _memory_store
    if _memory_store is None:
        config.ensure_data_dirs()
        _memory_store = Chroma(
            collection_name=config.MEMORY_COLLECTION_NAME,
            persist_directory=str(config.CHROMA_DIR),
            embedding_function=get_embeddings(),
        )
    return _memory_store
