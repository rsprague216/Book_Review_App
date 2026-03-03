"""
urls.py

URL routing for the BookTrack API.

All routes are mounted under the /api/ prefix by config/urls.py, so the full
paths are /api/<route> as shown in the table below.

SimpleJWT provides TokenObtainPairView (login) and TokenRefreshView (token refresh)
as pre-built class-based views — these are wired directly rather than going through
custom views.py functions.

Route summary:
    GET    /api/hello/                  — Health check (dev only)
    POST   /api/auth/register/          — Create new user account
    POST   /api/auth/login/             — Obtain JWT access + refresh tokens
    POST   /api/auth/logout/            — Blacklist refresh token
    POST   /api/auth/token/refresh/     — Exchange refresh token for new access token
    POST   /api/auth/password_change/   — Change authenticated user's password
    GET    /api/auth/me/                — Get current user's account + profile
    PATCH  /api/auth/me/                — Update current user's account fields
    GET    /api/auth/profile/           — Get current user's extended profile
    PATCH  /api/auth/profile/           — Update current user's extended profile
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Development health check — confirms the API is reachable
    path('hello/', views.hello_world, name='hello_world'),

    # Registration — public, no token required
    path('auth/register/', views.register, name='register'),

    # Login — handled by SimpleJWT; returns access + refresh tokens
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),

    # Logout — blacklists the provided refresh token
    path('auth/logout/', views.logout, name='logout'),

    # Token refresh — exchanges a refresh token for a new access token
    # Used automatically by the Axios response interceptor on 401 responses
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Password change — requires old password verification
    path('auth/password_change/', views.change_password, name='change_password'),

    # Current user's account fields (username, email)
    path('auth/me/', views.me, name='me'),

    # Current user's extended profile fields (bio, location, reading goal, etc.)
    path('auth/profile/', views.profile_details, name='profile_details'),
]
