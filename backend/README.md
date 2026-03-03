# BookBuddy — Backend

Django REST API for the BookBuddy app. Handles authentication, user profiles, and (eventually) books, reviews, and social features.

## Tech Stack

- **Django 6** with **Django REST Framework 3.16**
- **djangorestframework-simplejwt** — JWT access + refresh tokens
- **Argon2** — password hashing (via argon2-cffi)
- **django-cors-headers** — CORS for the React frontend
- **django-environ** — environment variable management
- **SQLite** — development database

## Setup

**1. Activate the virtual environment:**
```bash
source venv/bin/activate
```

**2. Install dependencies:**
```bash
pip install -r requirements.txt
```

**3. Create a `.env` file in this directory:**
```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

**4. Run migrations and start the server:**
```bash
python manage.py migrate
python manage.py runserver
```

Server runs at http://localhost:8000

## Common Commands

```bash
python manage.py test             # Run the test suite (11 passing)
python manage.py makemigrations   # Generate migrations after model changes
python manage.py migrate          # Apply pending migrations
python manage.py createsuperuser  # Create an admin user
```

## Project Structure

```
backend/
├── config/
│   ├── settings.py   # JWT config, Argon2, REST_FRAMEWORK defaults, env vars
│   ├── urls.py       # Root URL routing (includes api/ prefix)
│   ├── wsgi.py
│   └── asgi.py
├── api/
│   ├── models.py     # UserProfile model (OneToOne with Django User)
│   ├── serializers.py # RegisterSerializer, ChangePasswordSerializer, etc.
│   ├── views.py      # Function-based views (@api_view)
│   ├── urls.py       # All routes under /api/
│   ├── admin.py
│   ├── tests.py      # 11 integration tests
│   └── migrations/
├── manage.py
├── requirements.txt
└── .env              # Not committed — contains SECRET_KEY
```

## API Endpoints

All auth routes are under `/api/auth/`:

| Method | URL | Auth Required | Description |
|--------|-----|:-------------:|-------------|
| POST | `/api/auth/register/` | No | Create a new user + profile |
| POST | `/api/auth/login/` | No | Returns access + refresh tokens |
| POST | `/api/auth/logout/` | Yes | Blacklists the refresh token |
| POST | `/api/auth/token/refresh/` | No | Exchanges refresh token for new access token |
| GET/PATCH | `/api/auth/me/` | Yes | Get or update User fields (username, email) |
| GET/PATCH | `/api/auth/profile/` | Yes | Get or update UserProfile fields (bio, location, etc.) |
| POST | `/api/auth/password_change/` | Yes | Change password (requires current password) |

### Authentication

Send the access token as a header on protected requests:
```
Authorization: Bearer <access_token>
```

Token lifetimes:
- **Access token:** 15 minutes
- **Refresh token:** 7 days (rotated on use, blacklisted on logout)

### Register — `POST /api/auth/register/`

Request body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "password2": "securepassword"
}
```

### Login — `POST /api/auth/login/`

Request body:
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

Response:
```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

### Me — `GET /api/auth/me/`

Response:
```json
{
  "user": { "id": 1, "username": "johndoe", "email": "john@example.com" },
  "profile": { "bio": "", "location": "", "avatar_url": "", ... }
}
```

### Password Change — `POST /api/auth/password_change/`

Request body:
```json
{
  "old_password": "currentpassword",
  "new_password": "newpassword123",
  "new_password2": "newpassword123"
}
```

## Data Model

### UserProfile

Extends Django's built-in `User` (OneToOne relationship):

| Field | Type | Notes |
|-------|------|-------|
| `bio` | TextField | Optional |
| `avatar_url` | URLField | Optional — file upload deferred to Phase 5 |
| `location` | CharField | Optional |
| `website` | URLField | Optional |
| `annual_reading_goal` | IntegerField | Default 0 |
| `profile_visibility` | CharField | `public` / `followers_only` / `private` |
| `show_reading_activity` | BooleanField | Default True |
| `allow_others_see_shelves` | BooleanField | Default True |
| `allow_others_see_stats` | BooleanField | Default True |

## Tests

11 tests in `api/tests.py` covering:

- Successful registration
- Registration with mismatched passwords
- Successful login
- Login with invalid credentials
- Login with wrong password for a valid user
- Authenticated access to `/me/`
- Unauthenticated access to `/me/` returns 401
- Password change — success (verifies DB state)
- Password change — wrong old password (verifies DB unchanged)
- Password change — mismatched new passwords (verifies DB unchanged)
- Password change — unauthenticated returns 401

Run with:
```bash
python manage.py test
```
