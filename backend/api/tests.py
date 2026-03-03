"""
tests.py

Integration tests for the BookTrack API auth endpoints.

Uses DRF's APIClient to make HTTP requests against the live URL routing,
providing full end-to-end coverage of the request/response cycle including
serializer validation, view logic, and database state.

Test strategy:
  - Each test is independent: setUp() creates a fresh APIClient
  - Users are created directly via User.objects.create_user() (bypasses the API)
    except when testing the register endpoint itself
  - force_authenticate() is used to simulate authenticated requests without
    needing to obtain a real JWT token — this tests the view logic in isolation
    from the token infrastructure
  - Password change tests verify both the HTTP response AND the actual database
    state using user.refresh_from_db() + user.check_password()

Test count: 11 tests covering registration, login, /me/, and password change.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import UserProfile


class AuthTests(TestCase):
    """
    Tests for all authentication endpoints.

    setUp() runs before each individual test method, providing a clean
    APIClient instance and commonly used URL constants.
    """

    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.me_url = '/api/auth/me/'

    # -----------------------------------------------------------------------
    # Registration tests
    # -----------------------------------------------------------------------

    def test_register_success(self):
        """Valid registration data creates a new User in the database."""
        response = self.client.post(self.register_url, {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_password_mismatch(self):
        """Mismatched passwords return 400 and do not create a user."""
        response = self.client.post(self.register_url, {
            'username': 'testuser2',
            'email': 'test2@example.com',
            'password': 'testpass123',
            'password2': 'differentpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username='testuser2').exists())

    # -----------------------------------------------------------------------
    # Login tests
    # -----------------------------------------------------------------------

    def test_login_success(self):
        """Valid credentials return 200 with a JWT access token in the response."""
        User.objects.create_user(username='testuser3', password='testpass1234')
        response = self.client.post(self.login_url, {
            'username': 'testuser3',
            'password': 'testpass1234'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_invalid_credentials(self):
        """Non-existent username returns 401."""
        response = self.client.post(self.login_url, {
            'username': 'nonexistent',
            'password': 'wrongpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_wrong_password_valid_user(self):
        """Correct username with wrong password returns 401."""
        User.objects.create_user(username='testuser5', password='testpass123456')
        response = self.client.post(self.login_url, {
            'username': 'testuser5',
            'password': 'wrongpass'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -----------------------------------------------------------------------
    # /me/ endpoint tests
    # -----------------------------------------------------------------------

    def test_me_authenticated(self):
        """Authenticated GET /me/ returns 200 with the correct username."""
        user = User.objects.create_user(username='testuser4', password='testpass12345')
        UserProfile.objects.create(user=user)
        self.client.force_authenticate(user=user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'testuser4')

    def test_me_requires_auth(self):
        """Unauthenticated GET /me/ returns 401."""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -----------------------------------------------------------------------
    # Password change tests
    # -----------------------------------------------------------------------

    def test_password_change_success(self):
        """
        Correct old password + matching new passwords returns 200.
        Verifies the password was actually changed in the database.
        """
        user = User.objects.create_user(username='testuser6', password='oldpassword')
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/auth/password_change/', {
            'old_password': 'oldpassword',
            'new_password': 'newpassword123',
            'new_password2': 'newpassword123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Reload the user from the database to get the updated password hash
        user.refresh_from_db()
        self.assertTrue(user.check_password('newpassword123'))

    def test_password_change_wrong_old_password(self):
        """
        Incorrect old password returns 400.
        Verifies the original password was NOT changed in the database.
        """
        user = User.objects.create_user(username='testuser7', password='oldpassword')
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/auth/password_change/', {
            'old_password': 'wrongoldpassword',
            'new_password': 'newpassword123',
            'new_password2': 'newpassword123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertTrue(user.check_password('oldpassword'))

    def test_password_change_mismatch_new_passwords(self):
        """
        Mismatched new passwords return 400.
        Verifies the original password was NOT changed in the database.
        """
        user = User.objects.create_user(username='testuser8', password='oldpassword')
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/auth/password_change/', {
            'old_password': 'oldpassword',
            'new_password': 'newpassword123',
            'new_password2': 'differentnewpassword'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertTrue(user.check_password('oldpassword'))

    def test_password_change_unauthenticated(self):
        """Unauthenticated password change request returns 401."""
        response = self.client.post('/api/auth/password_change/', {
            'old_password': 'doesntmatter',
            'new_password': 'newpassword123',
            'new_password2': 'newpassword123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
