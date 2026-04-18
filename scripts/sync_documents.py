#!/usr/bin/env python3
"""CLI: sync PDFs under backend/data/documents with the Chroma vector store."""

from __future__ import annotations

import os
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_ROOT))
os.chdir(BACKEND_ROOT)

import config  # noqa: E402
from services.document_service import DocumentService  # noqa: E402


def main() -> None:
    config.ensure_data_dirs()
    service = DocumentService()
    result = service.sync_documents()
    print("Sync complete:")
    print(f"  Added:   {result.added}")
    print(f"  Updated: {result.updated}")
    print(f"  Deleted: {result.deleted}")
    print(f"  Total documents in registry: {service.get_document_count()}")


if __name__ == "__main__":
    main()
