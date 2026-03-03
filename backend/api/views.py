"""
views.py

All API view functions for the BookTrack application.

Views are function-based and use DRF's @api_view decorator to handle HTTP method
routing and request/response parsing. Authentication is enforced via
@permission_classes — most endpoints require IsAuthenticated, which DRF satisfies
by validating the JWT access token in the Authorization header.

Auth endpoints summary (all prefixed with /api/auth/):
    POST   register/           — Create a new user account (public)
    POST   login/              — Obtain JWT access + refresh tokens (SimpleJWT, public)
    POST   logout/             — Blacklist a refresh token (authenticated)
    POST   token/refresh/      — Exchange a refresh token for a new access token (SimpleJWT, public)
    POST   password_change/    — Change the authenticated user's password
    GET    me/                 — Get current user's account + profile data
    PATCH  me/                 — Update current user's account fields (username, email)
    GET    profile/            — Get current user's extended profile fields
    PATCH  profile/            — Update current user's extended profile fields
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer, ChangePasswordSerializer


# ---------------------------------------------------------------------------
# Development / Health Check
# ---------------------------------------------------------------------------

# Temporary test endpoint — confirms the backend is reachable from the frontend
@api_view(['GET'])
@permission_classes([AllowAny])
def hello_world(request):
    return Response({
        'message': 'Hello from Django!',
        'status': 'success'
    })


# ---------------------------------------------------------------------------
# Registration & Logout
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    POST /api/auth/register/

    Public endpoint — creates a new User + UserProfile.

    RegisterSerializer validates:
      - All required fields are present (username, email, password, password2)
      - password and password2 match
      - Username is unique (enforced by the User model)
      - Email is valid format

    On success: returns 201 with the new user's basic info.
    On failure: returns 400 with field-level validation errors.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    POST /api/auth/logout/

    Requires authentication. Invalidates the user's refresh token by adding it
    to the SimpleJWT token blacklist, preventing it from being used to obtain
    new access tokens.

    The client is responsible for also discarding the access token locally
    (by clearing it from memory and localStorage).

    Request body:
        { "refresh": "<refresh_token>" }

    On success: returns 200.
    On failure (invalid/missing token): returns 400.
    """
    try:
        token = RefreshToken(request.data['refresh'])
        token.blacklist()
        return Response({
            'message': 'User logged out successfully'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'message': 'Failed to log out user',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# ---------------------------------------------------------------------------
# Current User — Account & Profile
# ---------------------------------------------------------------------------

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    GET/PATCH /api/auth/me/

    Requires authentication. Operates on the core Django User model fields
    (username, email). For extended profile fields (bio, location, etc.),
    use the /api/auth/profile/ endpoint instead.

    DRF populates request.user automatically when a valid JWT access token
    is present in the Authorization header.

    GET  — Returns the current user's account fields + their linked profile.
    PATCH — Partially updates User model fields. partial=True means only the
            fields included in the request body are updated; omitted fields
            are left unchanged.

    On success: returns 200 with updated user data.
    On validation failure: returns 400 with field-level errors.
    """
    if request.method == 'PATCH':
        # partial=True allows sending only the fields you want to update
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User details updated successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'message': 'User details retrieved successfully',
        'user': UserSerializer(request.user).data,
        # request.user.profile works because of related_name='profile' on the OneToOneField
        'profile': UserProfileSerializer(request.user.profile).data
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_details(request):
    """
    GET/PATCH /api/auth/profile/

    Requires authentication. Operates on the UserProfile model — the extended
    profile data linked to the user via a OneToOne relationship. This includes
    bio, location, website, reading goal, and privacy settings.

    This endpoint is separate from /api/auth/me/ to keep account fields
    (username, email) distinct from profile fields (bio, location, etc.).

    GET  — Returns the current user's profile fields.
    PATCH — Partially updates profile fields. The existing profile instance is
            passed to the serializer to ensure it updates rather than creates.

    On success: returns 200 with updated profile data.
    On validation failure: returns 400 with field-level errors.
    """
    if request.method == 'PATCH':
        serializer = UserProfileSerializer(request.user.profile, data=request.data, partial=True)
        if serializer.is_valid():
            profile = serializer.save()
            return Response({
                'message': 'User profile updated successfully',
                'profile': UserProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({
        'message': 'User profile details retrieved successfully',
        'profile': UserProfileSerializer(request.user.profile).data
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Password Management
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    POST /api/auth/password_change/

    Requires authentication. Allows the currently authenticated user to change
    their password by providing their existing password for verification.

    Uses POST rather than PATCH because this is an action with side effects
    (password hashing, session invalidation) rather than a simple data update,
    and it is not idempotent — calling it twice with the same old_password
    would fail on the second call.

    Validation is delegated to ChangePasswordSerializer, which:
      - Verifies old_password matches the current password (field-level validator)
      - Confirms new_password and new_password2 match (cross-field validator)

    Request body:
        {
            "old_password": "<current_password>",
            "new_password": "<new_password>",
            "new_password2": "<new_password_confirmation>"
        }

    The user is passed via serializer context so the serializer can call
    user.check_password() and user.set_password() without needing to
    re-fetch the user from the database.

    On success: returns 200.
    On validation failure: returns 400 with field-level errors.
    """
    serializer = ChangePasswordSerializer(data=request.data, context={'user': request.user})
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
