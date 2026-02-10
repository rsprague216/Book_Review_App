# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BookTrack — a full-stack Goodreads-like app for tracking reading, discovering books, writing reviews, and connecting with readers. Currently in early scaffolding phase: both frontend and backend have basic proof-of-concept setups with a single test endpoint. All features are specified in design docs but not yet implemented.

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TailwindCSS 4 (PostCSS pipeline)
- **Backend:** Django 6 + Django REST Framework 3.16 + django-cors-headers
- **Database:** SQLite (dev), planned PostgreSQL for production
- **Python:** 3.14+ with virtualenv at `backend/venv/`
- **Node:** 22+ with npm

## Commands

### Frontend (run from `frontend/`)
```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # Production build
npm run lint       # ESLint (flat config, React hooks + refresh plugins)
npm run preview    # Preview production build
```

### Backend (run from `backend/`)
```bash
source venv/bin/activate              # Activate virtualenv (required first)
python manage.py runserver            # Dev server on http://localhost:8000
python manage.py migrate              # Apply database migrations
python manage.py makemigrations       # Generate migrations after model changes
python manage.py test                 # Run Django tests
python manage.py createsuperuser      # Create admin user
```

### Running the Full App
Both servers must run simultaneously. CORS is configured to allow `localhost:5173` and `127.0.0.1:5173`.

## Architecture

### Backend (`backend/`)
- **`config/`** — Django project settings, root URL routing, WSGI/ASGI configs
- **`api/`** — Main Django app: models, views, URLs, serializers, migrations
- URL routing: `config/urls.py` includes `api/urls.py` under the `/api/` prefix
- Views use DRF's `@api_view` decorator (function-based views)
- Currently one endpoint: `GET /api/hello/`

### Frontend (`frontend/src/`)
- **`main.jsx`** — Entry point, renders `<App />` in StrictMode
- **`App.jsx`** — Main component, fetches from backend API, manages state with `useState`/`useEffect`
- **`index.css`** — Single Tailwind v4 import (`@import "tailwindcss"`)
- Components directory (`src/components/`) exists but is empty; planned hierarchy is documented in `react-component-structure.md`

### Communication
Frontend calls backend REST API over HTTP with JSON. No auth system implemented yet.

## Design Documentation

Extensive design docs live at the repo root — consult these before implementing features:
- **`book-review-app-design-doc.md`** — Full project spec (goals, features, phases, architecture)
- **`schema-api-updates-summary.md`** — Database schema with all planned models and fields
- **`book-review-app-erd.mermaid`** — Entity Relationship Diagram
- **`react-component-structure.md`** — Complete React component hierarchy and specs
- **`external-api-integration.md`** — Third-party API integration guide
- **`security-authentication-guide.md`** — Auth and security specifications
- **`book-review-app-wireframes.md`** — UI/UX wireframes

## Key Notes

- No `requirements.txt` exists yet — backend dependencies are installed directly in the venv (`Django==6.0.2`, `djangorestframework==3.16.1`, `django-cors-headers==4.9.0`)
- Django `SECRET_KEY` in settings is insecure (dev placeholder) — must be replaced for production
- `DEBUG = True` and `ALLOWED_HOSTS = []` — dev-only configuration
- ESLint uses flat config format (ESLint 9.x); `no-unused-vars` is an error except for identifiers matching `^[A-Z]`
- Database models in `api/models.py` are empty — schema is documented in `schema-api-updates-summary.md`
