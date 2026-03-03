# BookBuddy

A full-stack book tracking and discovery app — think Goodreads — for logging your reading, writing reviews, and connecting with other readers. Built with React + Django.

## Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 7** — Build tool and dev server
- **TailwindCSS v4** — Utility-first CSS (PostCSS pipeline, `@theme` design tokens)
- **Axios** — HTTP client with JWT interceptors
- **React Router v6** — Client-side routing

### Backend
- **Django 6** — Python web framework
- **Django REST Framework 3.16** — API toolkit
- **djangorestframework-simplejwt** — JWT authentication
- **django-cors-headers** — Cross-origin resource sharing
- **django-environ** — Environment variable management
- **Argon2** — Password hashing (via argon2-cffi)

### Database
- **SQLite** — Development
- **PostgreSQL** — Planned for production

## Project Structure

```
.
├── backend/
│   ├── api/                # Main Django app (models, views, serializers, URLs, tests)
│   ├── config/             # Django project settings + URL routing
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client + JWT interceptors
│   │   ├── components/
│   │   │   ├── auth/       # LoginForm, RegisterForm, PasswordChangeForm
│   │   │   └── layout/     # Header, Navbar, ProtectedRoute
│   │   ├── contexts/       # AuthContext (global auth state)
│   │   ├── pages/          # Page components (Login, Register, Dashboard, Profile)
│   │   ├── App.jsx         # Router root + route definitions
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind import + design tokens
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.14+
- Node.js 22+
- npm 10+

### Backend Setup

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

Then run migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver
```

Backend available at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend available at http://localhost:5173

> Both servers must run simultaneously. CORS is configured to allow `localhost:5173`.

## API Endpoints

All auth endpoints are under `/api/auth/`:

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/auth/register/` | No | Create a new account |
| POST | `/api/auth/login/` | No | Returns access + refresh JWT tokens |
| POST | `/api/auth/logout/` | Yes | Blacklists refresh token |
| POST | `/api/auth/token/refresh/` | No | Exchange refresh token for new access token |
| GET/PATCH | `/api/auth/me/` | Yes | Get or update the current user |
| GET/PATCH | `/api/auth/profile/` | Yes | Get or update the current user's profile |
| POST | `/api/auth/password_change/` | Yes | Change password (requires current password) |

Authentication uses JWT (`Authorization: Bearer <token>` header). Access tokens expire after 15 minutes; refresh tokens last 7 days with rotation and blacklisting.

## Development

### Useful Commands

**Backend** (from `backend/` with venv active):
```bash
python manage.py test            # Run tests (11 passing)
python manage.py makemigrations  # Generate migrations after model changes
python manage.py createsuperuser
```

**Frontend** (from `frontend/`):
```bash
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Key Files
- Backend views: [backend/api/views.py](backend/api/views.py)
- Backend models: [backend/api/models.py](backend/api/models.py)
- URL routing: [backend/api/urls.py](backend/api/urls.py)
- Django settings: [backend/config/settings.py](backend/config/settings.py)
- Axios client: [frontend/src/api/client.js](frontend/src/api/client.js)
- Auth context: [frontend/src/contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx)
- Router root: [frontend/src/App.jsx](frontend/src/App.jsx)

## Current Status

**Phase 1 — Foundation & Authentication: Complete ✅**
- JWT authentication with token rotation and blacklisting
- Argon2 password hashing
- User + UserProfile model with full REST endpoints
- Password change endpoint
- Axios client with silent token refresh on 401
- Global auth state via React Context (session persists across page refreshes)
- Protected route guarding with layout route pattern
- Login, Register, and Profile pages with styled form components
- 11 passing backend tests

## Planned Phases

- **Phase 2** — Book search and discovery (Open Library / Google Books API)
- **Phase 3** — Reading lists, reviews, and ratings
- **Phase 4** — Social features (following users, activity feeds)
- **Phase 5** — File uploads (avatar images via S3), password recovery via email

## License

MIT
