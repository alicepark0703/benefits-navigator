"""FastAPI application: benefits RAG API and document management."""

from __future__ import annotations

import logging
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import config
from models.schemas import (
    AuthResponse,
    DocumentInfo,
    LoginRequest,
    QueryRequest,
    QueryResponse,
    SignupRequest,
    StatusResponse,
    SyncResponse,
)
from services.document_service import DocumentService
from services.llm_service import LLMService
from services.auth_service import AuthService
from services.prompt_builder import (
    build_context_from_documents,
    build_llm_prompt,
    construct_retrieval_query,
    extract_eligible_program_mentions,
)
from services.rag_service import RAGService
from services.auth_service import AuthService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

config.ensure_data_dirs()

app = FastAPI(
    title="Benefits Navigator API",
    description="RAG-backed public benefits eligibility assistance",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_document_service: DocumentService | None = None
_rag_service: RAGService | None = None
_llm_service: LLMService | None = None
_auth_service: AuthService | None = None

DEFAULT_QUERY = "What benefits might I be eligible for and why?"


def get_document_service() -> DocumentService:
    global _document_service
    if _document_service is None:
        _document_service = DocumentService()
    return _document_service


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service

def get_auth_service() -> AuthService:
    global _auth_service
    if _auth_service is None:
        _auth_service = AuthService()
    return _auth_service


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/query", response_model=QueryResponse)
async def query_benefits(
    request: QueryRequest,
    rag: Annotated[RAGService, Depends(get_rag_service)],
    llm: Annotated[LLMService, Depends(get_llm_service)],
    auth: Annotated[AuthService, Depends(get_auth_service)],
) -> QueryResponse:
    raw_q = (request.query or "").strip()
    user_query = raw_q or DEFAULT_QUERY
    logger.info(
        "api/query: prompt_source=%s",
        "user" if raw_q else "default",
    )
    retrieval_query = construct_retrieval_query(user_query, request.user_profile)
    documents = rag.retrieve(retrieval_query)
    context = build_context_from_documents(documents)
    prompt = build_llm_prompt(context, user_query, request.user_profile)

    try:
        answer = llm.generate(prompt)
    except Exception as exc:  # pragma: no cover - network / provider errors
        logger.exception("LLM generation failed")
        raise HTTPException(
            status_code=503,
            detail=f"LLM generation failed ({config.LLM_PROVIDER}). Is the provider running and configured? Error: {exc}",
        ) from exc

    programs = extract_eligible_program_mentions(answer)
    sources = [dict(doc.metadata) for doc in documents]

    if request.user_id is not None:
        auth.save_eligibility_profile(
            user_id=request.user_id,
            eligibility_data=request.user_profile.model_dump(by_alias=False),
            selected_programs=programs,
        )

    return QueryResponse(answer=answer, eligible_programs=programs, sources=sources)


@app.post("/api/documents/sync", response_model=SyncResponse)
async def sync_documents(
    doc_svc: Annotated[DocumentService, Depends(get_document_service)],
) -> SyncResponse:
    result = doc_svc.sync_documents()
    return SyncResponse(
        added=result.added,
        updated=result.updated,
        deleted=result.deleted,
        total_documents=doc_svc.get_document_count(),
    )


@app.post("/api/signup", response_model=AuthResponse)
async def signup(
    request: SignupRequest,
    auth: Annotated[AuthService, Depends(get_auth_service)],
) -> AuthResponse:
    result = auth.signup(
        full_name=request.full_name,
        email=request.email,
        password=request.password,
    )
    return AuthResponse(**result)


@app.post("/api/login", response_model=AuthResponse)
async def login(
    request: LoginRequest,
    auth: Annotated[AuthService, Depends(get_auth_service)],
) -> AuthResponse:
    result = auth.login(
        email=request.email,
        password=request.password,
    )
    return AuthResponse(**result)


@app.get("/api/documents", response_model=list[DocumentInfo])
async def list_documents(
    doc_svc: Annotated[DocumentService, Depends(get_document_service)],
) -> list[DocumentInfo]:
    return doc_svc.list_documents()


@app.delete("/api/documents/{rel_path:path}")
async def delete_document(
    rel_path: str,
    doc_svc: Annotated[DocumentService, Depends(get_document_service)],
) -> dict[str, str]:
    doc_svc.delete_document(rel_path, remove_file=True)
    return {"status": "deleted", "filename": rel_path}


@app.get("/api/documents/status", response_model=StatusResponse)
async def documents_status(
    doc_svc: Annotated[DocumentService, Depends(get_document_service)],
) -> StatusResponse:
    return StatusResponse(
        total_documents=doc_svc.get_document_count(),
        total_chunks=doc_svc.get_chunk_count(),
        last_sync=doc_svc.get_last_sync_time(),
    )
