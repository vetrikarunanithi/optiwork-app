# Optiwork Backend (Simple FastAPI)

This is a lightweight in-memory FastAPI backend to be used with the Optiwork frontend during development.

Features
- Endpoints: /users, /tasks, /skills, /reports, /performance/{id}, /analytics, /training-suggestions
- CORS configured for `http://localhost:5173`
- Simple in-memory data store seeded from sample data

Run locally (PowerShell):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Open http://127.0.0.1:8000/docs for interactive API docs.
