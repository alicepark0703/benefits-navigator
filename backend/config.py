"""Application configuration loaded from environment variables."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Resolve paths relative to this package (backend/)
BASE_DIR: Path = Path(__file__).resolve().parent
DATA_DIR: Path = BASE_DIR / "data"
DOCUMENTS_DIR: Path = DATA_DIR / "documents"
CHROMA_DIR: Path = DATA_DIR / "chroma_db"
REGISTRY_PATH: Path = DATA_DIR / "document_registry.json"
HF_CACHE_DIR: Path = DATA_DIR / "hf_cache"

# Chroma collection name shared by ingestion and retrieval
CHROMA_COLLECTION_NAME: str = os.getenv("CHROMA_COLLECTION_NAME", "benefits_programs")

# Embeddings
EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

# Chunking
CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))

# LLM
LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "ollama").lower()
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

# RAG
RAG_TOP_K: int = int(os.getenv("RAG_TOP_K", "5"))

# Conversation memory RAG
MEMORY_ENABLED: bool = os.getenv("MEMORY_ENABLED", "true").lower() in {"1", "true", "yes", "on"}
MEMORY_TOP_K: int = int(os.getenv("MEMORY_TOP_K", "3"))
MEMORY_COLLECTION_NAME: str = os.getenv("MEMORY_COLLECTION_NAME", "conversation_memory")

# CORS (comma-separated origins, or * for dev)
CORS_ORIGINS: list[str] = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
    if o.strip()
]


def ensure_data_dirs() -> None:
    """Create data directories if they do not exist."""
    DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    HF_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    if not REGISTRY_PATH.exists():
        REGISTRY_PATH.write_text(
            '{"last_sync": null, "documents": {}}',
            encoding="utf-8",
        )
