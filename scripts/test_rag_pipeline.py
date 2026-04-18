#!/usr/bin/env python3
"""
End-to-end smoke test: create a sample PDF, sync to Chroma, run retrieval.

Does not require a running LLM by default. Set RUN_LLM_SMOKE=1 to also call the LLM
(Ollama or Groq must be configured).
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_ROOT))
os.chdir(BACKEND_ROOT)

import fitz  # PyMuPDF  # noqa: E402

import config  # noqa: E402
from models.schemas import QueryRequest, UserProfile  # noqa: E402
from services.document_service import DocumentService  # noqa: E402
from services.llm_service import LLMService  # noqa: E402
from services.prompt_builder import (  # noqa: E402
    build_context_from_documents,
    build_llm_prompt,
    construct_retrieval_query,
)
from services.rag_service import RAGService  # noqa: E402
from services.vector_store import reset_vector_store_cache_for_tests  # noqa: E402


SAMPLE_NAME = "_smoke_test_programs.pdf"


def write_sample_pdf(path: Path) -> None:
    doc = fitz.open()
    page = doc.new_page()
    text = (
        "SNAP (Supplemental Nutrition Assistance Program): "
        "Households with low income may qualify based on gross and net income tests "
        "and household size. Income limits are tied to the Federal Poverty Level.\n\n"
        "Medicaid: Adults and children in low-income households may qualify; "
        "rules vary by state expansion under the Affordable Care Act.\n\n"
        "Section 8 Housing Choice Voucher: Helps very low-income families afford rent; "
        "waitlists are common."
    )
    page.insert_text((72, 72), text)
    doc.save(str(path))
    doc.close()


def main() -> None:
    reset_vector_store_cache_for_tests()
    config.ensure_data_dirs()

    sample_path = config.DOCUMENTS_DIR / SAMPLE_NAME
    write_sample_pdf(sample_path)
    try:
        doc_svc = DocumentService()
        sync = doc_svc.sync_documents()
        print(f"Sync: added={sync.added} updated={sync.updated} deleted={sync.deleted}")

        rag = RAGService()
        profile = UserProfile(
            household_size=3,
            annual_income=22000,
            state="NY",
            employment_status="part-time",
        )
        q = "What food and health benefits might I qualify for?"
        rq = construct_retrieval_query(q, profile)
        docs = rag.retrieve(rq, k=3)
        assert docs, "Expected non-empty retrieval results"
        print("Retrieval OK; top snippet:")
        print(docs[0].page_content[:400].replace("\n", " ") + "...")

        if os.getenv("RUN_LLM_SMOKE") == "1":
            ctx = build_context_from_documents(docs)
            prompt = build_llm_prompt(ctx, q, profile)
            llm = LLMService()
            out = llm.generate(prompt)
            print("LLM smoke OK; response prefix:")
            print(out[:500])
        else:
            print("Skipping LLM (set RUN_LLM_SMOKE=1 to test generation).")

        req = QueryRequest(query=q, user_profile=profile)
        assert req.query == q
        print("Pipeline smoke test passed.")
    finally:
        if sample_path.is_file():
            sample_path.unlink()
        # Drop vectors/registry rows for PDFs removed from disk
        reset_vector_store_cache_for_tests()
        DocumentService().sync_documents()
        reset_vector_store_cache_for_tests()


if __name__ == "__main__":
    main()
