"""
serializers.py

DRF serializers for the BookTrack API.

Serializers serve two purposes:
  1. Deserialization — validate and parse incoming request data (POST/PATCH bodies)
  2. Serialization  — convert model instances to JSON for API responses

Serializer types used here:
  - ModelSerializer: auto-generates fields from a model; handles create/update
  - Serializer:      manually defined fields; used when the data doesn't map
                     directly to a single model (e.g. login, password change)

Validation hooks:
  - validate_<field>(value): field-level validator, runs on a single field
  - validate(data):          cross-field validator, runs after all field validators pass
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes the core Django User model fields.

    Used for:
      - Reading user info in API responses (GET /api/auth/me/)
      - Partial updates to account fields (PATCH /api/auth/me/)
      - Nested representation inside UserProfileSerializer

    Only exposes safe, non-sensitive fields. Password is intentionally excluded.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializes the UserProfile model — the extended profile data linked to each
    User via a OneToOne relationship.

    The nested UserSerializer (read_only=True) means the full user object is
    included when reading, but cannot be updated through this serializer.
    Profile updates go through this serializer; account updates (username, email)
    go through UserSerializer via the /api/auth/me/ endpoint.

    Used for:
      - Reading profile data (GET /api/auth/me/, GET /api/auth/profile/)
      - Partial updates to profile fields (PATCH /api/auth/profile/)
    """
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'user',
            'bio',
            'avatar_url',
            'location',
            'website',
            'annual_reading_goal',
            'profile_visibility',
            'show_reading_activity',
            'allow_others_see_shelves',
            'allow_others_see_stats',
            'username_changes_count',
            'last_username_change_at',
        ]


class RegisterSerializer(serializers.ModelSerializer):
    """
    Validates and processes new user registration.

    Accepts: username, email, password, password2.

    Validation:
      - email is required and must be valid format
      - password and password2 must match (cross-field check in validate())
      - username uniqueness is enforced by the User model

    On save (create()):
      - Creates the Django User with a hashed password via create_user()
      - Automatically creates a linked UserProfile record

    password and password2 are write_only so they are never included in responses.
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        """Cross-field validation: ensure both password fields match."""
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """
        Create and return a new User + UserProfile.

        create_user() is used instead of create() because it handles
        password hashing automatically (Argon2 in this project's config).
        password2 is not passed to create_user() as it is only used for
        validation and has no corresponding model field.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    """
    Validates login credentials.

    Note: This serializer is defined for completeness and potential future use,
    but the /api/auth/login/ endpoint uses SimpleJWT's TokenObtainPairView
    directly, which handles its own validation internally.

    password is write_only so it is never reflected back in any response.
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    """
    Validates and processes a password change for an authenticated user.

    Unlike RegisterSerializer, this does not extend ModelSerializer because
    it does not create or update a model record in the standard DRF way —
    it instead calls Django's set_password() method directly.

    The current user is passed in via serializer context:
        ChangePasswordSerializer(data=request.data, context={'user': request.user})

    Validation runs in two stages:
      1. validate_old_password() — field-level: verifies the old password is correct
         by calling check_password() against the stored hash
      2. validate() — cross-field: confirms new_password and new_password2 match

    On save():
      - Calls set_password() which hashes the new password using the configured
        password hasher (Argon2)
      - Calls user.save() to persist the change to the database

    All fields are write_only so passwords are never included in any response.
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    new_password2 = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        """Verify the provided old password matches the user's current password."""
        user = self.context['user']
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate(self, data):
        """Cross-field validation: ensure both new password fields match."""
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError("New passwords do not match.")
        return data

    def save(self, **kwargs):
        """Hash and save the new password to the database."""
        user = self.context['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
