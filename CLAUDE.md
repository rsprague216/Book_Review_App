# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BookBuddy — a full-stack Goodreads-like app for tracking reading, discovering books, writing reviews, and connecting with readers. Phase 1 (Foundation & Authentication) is fully complete — backend and frontend. Phase 2 (Book Management) is next.

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TailwindCSS 4 (PostCSS pipeline)
- **Backend:** Django 6 + Django REST Framework 3.16 + django-cors-headers + djangorestframework-simplejwt
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
python manage.py test                 # Run Django tests (11 passing)
python manage.py createsuperuser      # Create admin user
```

### Running the Full App
Both servers must run simultaneously. CORS is configured to allow `localhost:5173` and `127.0.0.1:5173`.

## Architecture

### Backend (`backend/`)
- **`config/`** — Django project settings, root URL routing, WSGI/ASGI configs
- **`config/settings.py`** — JWT config, Argon2 hasher, REST_FRAMEWORK defaults, env vars via django-environ
- **`api/`** — Main Django app: models, views, URLs, serializers, migrations
- **`api/models.py`** — `UserProfile` (OneToOne with Django's built-in `User`)
- **`api/serializers.py`** — `UserSerializer`, `UserProfileSerializer`, `RegisterSerializer`, `ChangePasswordSerializer`
- **`api/views.py`** — Function-based views using `@api_view` decorator
- **`api/urls.py`** — All routes under `/api/` prefix
- **`backend/.env`** — `SECRET_KEY` and env vars (not committed to git)
- URL routing: `config/urls.py` includes `api/urls.py` under the `/api/` prefix

### Auth Endpoints (all under `/api/auth/`)
| Method | URL | View | Notes |
|--------|-----|------|-------|
| POST | `register/` | `views.register` | Public — creates User + UserProfile |
| POST | `login/` | `TokenObtainPairView` | SimpleJWT built-in — returns access + refresh tokens |
| POST | `logout/` | `views.logout` | Blacklists refresh token |
| POST | `token/refresh/` | `TokenRefreshView` | SimpleJWT built-in |
| GET/PATCH | `me/` | `views.me` | Returns `{ user, profile }` — PATCH updates User fields |
| GET/PATCH | `profile/` | `views.profile_details` | PATCH updates UserProfile fields |
| POST | `password_change/` | `views.change_password` | Requires auth — old + new passwords |

### Authentication
- JWT via SimpleJWT: 15-min access tokens, 7-day refresh tokens with rotation + blacklisting
- Password hashing: Argon2
- DRF default: `JWTAuthentication` + `IsAuthenticated` (override with `@permission_classes([AllowAny])` for public endpoints)
- Access token sent as `Authorization: Bearer <token>` header

### Frontend (`frontend/src/`)
- **`main.jsx`** — Entry point, renders `<App />` in StrictMode
- **`App.jsx`** — Router root: `AuthProvider` → `BrowserRouter` → `Header` + `Routes`
- **`index.css`** — Tailwind v4 import + `@theme` block with brand design tokens
- **`api/client.js`** — Axios instance (baseURL: `localhost:8000/api`); request interceptor attaches Bearer token; response interceptor silently refreshes on 401
- **`contexts/AuthContext.jsx`** — Global auth state (`user`, `isLoading`); exposes `login`, `logout`, `register`; silently restores session from localStorage refresh token on startup

### Frontend File Structure
```
src/
  api/
    client.js               # Axios instance + JWT interceptors
  components/
    auth/
      LoginForm.jsx          # Controlled form — calls useAuth().login()
      RegisterForm.jsx       # Controlled form — calls useAuth().register()
      PasswordChangeForm.jsx # Calls apiClient directly (no auth state change)
    layout/
      Header.jsx             # Top bar: BookBuddy logo (left) + Navbar (right)
      Navbar.jsx             # Auth-aware nav links
      ProtectedRoute.jsx     # Route guard: redirects to /login if not authenticated
  contexts/
    AuthContext.jsx          # Auth state provider
  pages/
    HomePage.jsx             # Public landing page (stub)
    LoginPage.jsx            # Centered card wrapping LoginForm
    RegisterPage.jsx         # Centered card wrapping RegisterForm
    DashboardPage.jsx        # Protected stub — Phase 2
    ProfilePage.jsx          # Protected — contains PasswordChangeForm
```

### Routing (App.jsx)
- Public: `/`, `/login`, `/register`
- Protected (via pathless layout route + `ProtectedRoute` + `Outlet`): `/dashboard`, `/profile`

### Token Storage
- Access token: in-memory only (module-level variable in `client.js`) — XSS-safe, lost on refresh
- Refresh token: `localStorage` — persists across page refreshes; exchanged for new access token on startup

### Design System (`index.css` + `book-review-app-wireframes.md`)
Tailwind v4 `@theme` tokens (use these, not raw hex or Tailwind default color names):
- `text-primary` / `bg-primary` — #2563EB (brand blue)
- `hover:bg-primary-dark` — #1E40AF
- `text-primary-light` / `bg-primary-light` — #DBEAFE
- `text-success` / `text-error` / `text-warning` / `text-ai` — semantic colors
- `bg-bg-secondary` — #F9FAFB (default page background, set on body)
- Font: Inter (loaded via Google Fonts in `index.html`)

## Phase 1 Status — Complete ✅

### Backend
- JWT + Argon2 configured
- UserProfile model + migration
- All auth endpoints: register, login, logout, token refresh, me, profile, password_change
- 11 tests passing

### Frontend
- Axios client with request/response interceptors + silent token refresh
- AuthContext with session persistence (localStorage refresh token)
- Auth forms: Login, Register, PasswordChange
- Layout: Header, Navbar, ProtectedRoute
- Router with public + protected route groups (layout route pattern)
- Pages: Home, Login, Register, Dashboard (stub), Profile
- Design system: Inter font, brand colors via `@theme`, `#F9FAFB` body background

## Design Documentation

Extensive design docs live at the repo root — consult these before implementing features:
- **`implementation-plan.md`** — Phase-by-phase implementation plan (source of truth for what to build next)
- **`book-review-app-design-doc.md`** — Full project spec (goals, features, phases, architecture)
- **`schema-api-updates-summary.md`** — Database schema with all planned models and fields
- **`book-review-app-erd.mermaid`** — Entity Relationship Diagram
- **`react-component-structure.md`** — Complete React component hierarchy and specs
- **`external-api-integration.md`** — Third-party API integration guide
- **`security-authentication-guide.md`** — Auth and security specifications
- **`book-review-app-wireframes.md`** — UI/UX wireframes and design system

## AI Interaction Style

The user is learning — Claude should act as a **senior developer mentor**. Guide, explain, and advise rather than generating all the code. Let the user write and develop code themselves. Only provide small illustrative snippets when helpful.

## Key Notes

- Backend dependencies pinned in `backend/requirements.txt` — install with `pip install -r requirements.txt` (from `backend/` with venv active)
- `SECRET_KEY` is in `backend/.env` (not in settings.py) — never commit `.env`
- `DEBUG` loaded from `.env` — currently `True` for dev
- `ALLOWED_HOSTS = []` — dev-only configuration
- ESLint uses flat config format (ESLint 9.x); `no-unused-vars` is an error except for identifiers matching `^[A-Z]`
- `avatar_upload` endpoint deferred — model has `avatar_url` URLField; file upload requires S3 setup (Phase 5)
- `/me/` returns `{ user: {...}, profile: {...} }` — `fetchUser()` stores only `response.data.user` in AuthContext state
- Password/username recovery deferred to Phase 5 — planned as OTP/magic link via email (Resend)
