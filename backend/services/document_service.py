"""PDF ingestion, document registry, and incremental sync with Chroma."""

from __future__ import annotations

import hashlib
import json
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

import config
from models.schemas import DocumentInfo
from services.vector_store import get_chroma

logger = logging.getLogger(__name__)


@dataclass
class SyncResult:
    added: int
    updated: int
    deleted: int


class DocumentService:
    """Manage program PDFs: chunk, embed, store in Chroma, keep registry in sync."""

    def __init__(self) -> None:
        config.ensure_data_dirs()
        self._vectorstore = get_chroma()
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.CHUNK_SIZE,
            chunk_overlap=config.CHUNK_OVERLAP,
        )

    # --- Registry ---

    def _load_registry(self) -> dict[str, Any]:
        raw = json.loads(config.REGISTRY_PATH.read_text(encoding="utf-8"))
        return {
            "last_sync": raw.get("last_sync"),
            "documents": raw.get("documents", {}) or {},
        }

    def _save_registry(self, data: dict[str, Any]) -> None:
        config.REGISTRY_PATH.write_text(
            json.dumps(data, indent=2, sort_keys=True),
            encoding="utf-8",
        )

    def _utc_now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    # --- Filesystem ---

    def _scan_pdf_keys(self) -> set[str]:
        keys: set[str] = set()
        for path in sorted(config.DOCUMENTS_DIR.rglob("*.pdf")):
            rel = path.relative_to(config.DOCUMENTS_DIR).as_posix()
            keys.add(rel)
        return keys

    def _full_path(self, rel_key: str) -> Path:
        candidate = (config.DOCUMENTS_DIR / Path(rel_key)).resolve()
        docs_root = config.DOCUMENTS_DIR.resolve()
        try:
            candidate.relative_to(docs_root)
        except ValueError as exc:
            raise ValueError(f"Document path escapes documents directory: {rel_key}") from exc
        return candidate

    def _compute_hash(self, path: Path) -> str:
        h = hashlib.sha256()
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                h.update(chunk)
        return h.hexdigest()

    def _file_last_modified_iso(self, path: Path) -> str:
        ts = path.stat().st_mtime
        return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()

    def _chunk_id_prefix(self, rel_key: str) -> str:
        return hashlib.sha256(rel_key.encode("utf-8")).hexdigest()[:32]

    # --- Chroma / ingest ---

    def _delete_vectors(self, chunk_ids: list[str]) -> None:
        if not chunk_ids:
            return
        try:
            self._vectorstore.delete(ids=chunk_ids)
        except Exception as exc:  # pragma: no cover - depends on chroma state
            logger.warning("Chroma delete failed for ids=%s: %s", chunk_ids[:3], exc)

    def _ingest_document(self, rel_key: str, registry_data: dict[str, Any]) -> None:
        path = self._full_path(rel_key)
        if not path.is_file():
            raise FileNotFoundError(f"PDF not found: {rel_key}")

        loader = PyMuPDFLoader(str(path))
        pages = loader.load()
        chunks = self._splitter.split_documents(pages)

        prefix = self._chunk_id_prefix(rel_key)
        chunk_ids: list[str] = []
        for i, chunk in enumerate(chunks):
            cid = f"{prefix}_{i}"
            chunk_ids.append(cid)
            chunk.metadata["chunk_id"] = cid
            chunk.metadata["source_file"] = rel_key
            chunk.metadata["source"] = rel_key

        if chunks:
            self._vectorstore.add_documents(chunks, ids=chunk_ids)

        file_hash = self._compute_hash(path)
        last_modified = self._file_last_modified_iso(path)
        ingested_at = self._utc_now_iso()

        registry_data["documents"][rel_key] = {
            "file_hash": file_hash,
            "last_modified": last_modified,
            "chunk_ids": chunk_ids,
            "ingested_at": ingested_at,
        }

    def _remove_registry_key(self, registry_data: dict[str, Any], rel_key: str) -> None:
        registry_data["documents"].pop(rel_key, None)

    # --- Public API ---

    def sync_documents(self) -> SyncResult:
        """Diff disk vs registry; apply adds, updates, and deletes."""
        registry_data = self._load_registry()
        current = self._scan_pdf_keys()
        reg_docs: dict[str, Any] = registry_data["documents"]
        reg_keys = set(reg_docs.keys())

        deleted_keys = reg_keys - current
        new_keys = current - reg_keys
        modified_keys: set[str] = set()
        for key in current & reg_keys:
            path = self._full_path(key)
            if not path.is_file():
                continue
            current_hash = self._compute_hash(path)
            if current_hash != reg_docs[key].get("file_hash"):
                modified_keys.add(key)

        for key in deleted_keys:
            entry = reg_docs.get(key) or {}
            self._delete_vectors(list(entry.get("chunk_ids") or []))
            self._remove_registry_key(registry_data, key)

        for key in modified_keys:
            entry = reg_docs.get(key) or {}
            self._delete_vectors(list(entry.get("chunk_ids") or []))
            self._remove_registry_key(registry_data, key)
            self._ingest_document(key, registry_data)

        for key in new_keys:
            self._ingest_document(key, registry_data)

        registry_data["last_sync"] = self._utc_now_iso()
        self._save_registry(registry_data)

        return SyncResult(
            added=len(new_keys),
            updated=len(modified_keys),
            deleted=len(deleted_keys),
        )

    def list_documents(self) -> list[DocumentInfo]:
        registry_data = self._load_registry()
        out: list[DocumentInfo] = []
        for filename, meta in registry_data["documents"].items():
            chunk_ids = meta.get("chunk_ids") or []
            out.append(
                DocumentInfo(
                    filename=filename,
                    file_hash=meta.get("file_hash", ""),
                    chunk_count=len(chunk_ids),
                    ingested_at=datetime.fromisoformat(meta["ingested_at"]),
                    last_modified=datetime.fromisoformat(meta["last_modified"]),
                )
            )
        out.sort(key=lambda d: d.filename)
        return out

    def delete_document(self, rel_key: str, *, remove_file: bool = True) -> None:
        """Remove one document from Chroma and the registry; optionally delete the PDF on disk."""
        registry_data = self._load_registry()
        entry = registry_data["documents"].get(rel_key)
        if entry:
            self._delete_vectors(list(entry.get("chunk_ids") or []))
            self._remove_registry_key(registry_data, rel_key)
        if remove_file:
            path = self._full_path(rel_key)
            if path.is_file():
                path.unlink()
        registry_data["last_sync"] = self._utc_now_iso()
        self._save_registry(registry_data)

    def get_document_count(self) -> int:
        return len(self._load_registry()["documents"])

    def get_chunk_count(self) -> int:
        reg = self._load_registry()["documents"]
        return sum(len((meta.get("chunk_ids") or [])) for meta in reg.values())

    def get_last_sync_time(self) -> datetime | None:
        raw = self._load_registry().get("last_sync")
        if not raw:
            return None
        return datetime.fromisoformat(raw)
