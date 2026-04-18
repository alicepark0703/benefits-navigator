"""Shared Chroma vector store and embedding model."""

from __future__ import annotations

import os

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

import config

_embeddings: HuggingFaceEmbeddings | None = None
_chroma: Chroma | None = None


def get_embeddings() -> HuggingFaceEmbeddings:
    """Singleton HuggingFace embeddings (local, free)."""
    global _embeddings
    if _embeddings is None:
        # Keep model cache inside project to avoid global machine writes.
        os.environ.setdefault("HF_HOME", str(config.HF_CACHE_DIR))
        _embeddings = HuggingFaceEmbeddings(
            model_name=config.EMBEDDING_MODEL,
            cache_folder=str(config.HF_CACHE_DIR),
        )
    return _embeddings


def get_chroma() -> Chroma:
    """Singleton LangChain Chroma client using the configured persist directory."""
    global _chroma
    if _chroma is None:
        config.ensure_data_dirs()
        _chroma = Chroma(
            collection_name=config.CHROMA_COLLECTION_NAME,
            persist_directory=str(config.CHROMA_DIR),
            embedding_function=get_embeddings(),
        )
    return _chroma


def reset_vector_store_cache_for_tests() -> None:
    """Clear cached clients (for tests only)."""
    global _embeddings, _chroma
    _embeddings = None
    _chroma = None
