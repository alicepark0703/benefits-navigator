### Start backend

Run from repository root:

```bash
source .venv/bin/activate
pip install -r backend/requirements.txt
cp .env.example .env
cd backend && uvicorn main:app --reload --port 8000
```

### Ingest your documents (run once only)

In a second terminal (from repo root):

```bash
source .venv/bin/activate
python scripts/sync_documents.py
```