# Cookbook Application

## Quick start (Docker)

- Prereqs: Docker Desktop
- From repo root:
  - `docker compose up --build`
  - Backend: http://localhost:8000/health → `{ "status": "ok" }`
  - Frontend: http://localhost:3000

Services:
- Postgres: 5432
- Django API: 8000
- Frontend (Nginx): 3000

## Environment

- Backend: `backend/.env` (a sample is in `backend/.env.example`).
- Frontend: create `frontend/.env.local` (or use the example below)
  - `VITE_API_BASE=http://localhost:8000`

## Backend (Django API)

- Auth (JWT):
  - `POST /api/users/register`
  - `POST /api/users/token`
  - `POST /api/users/token/refresh`
  - `GET  /api/users/me` (Authorization: Bearer <access>)

- Recipes (JWT required):
  - `GET    /api/recipes/?q=<query>`
  - `POST   /api/recipes/` (JSON or multipart with `image`)
  - `GET    /api/recipes/{id}/`
  - `PUT    /api/recipes/{id}/`
  - `DELETE /api/recipes/{id}/`

Images are stored under `backend/media/recipes/` and served in DEBUG.

## Frontend (React)

- Dev (local Vite):
  - `cd frontend`
  - `npm install`
  - create `.env.local` with `VITE_API_BASE=http://localhost:8000`
  - `npm run dev` (http://localhost:5173)

- Docker (Nginx build):
  - `docker compose up --build`
  - open http://localhost:3000

## Common issues

- 404 on `/api/users/register`: ensure Django imports `users.urls` and not a stray top-level `users/` folder.
- 401/invalid token: ensure `Authorization: Bearer <access>` (use access token, not refresh).
- DB errors (`relation does not exist`): restart compose so entrypoint runs migrations.