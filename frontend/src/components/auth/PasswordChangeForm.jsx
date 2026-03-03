/**
 * PasswordChangeForm.jsx
 *
 * Controlled form component for changing the authenticated user's password.
 *
 * Unlike LoginForm and RegisterForm, this component calls apiClient directly
 * rather than going through AuthContext. This is because changing a password
 * does not affect authentication state — no tokens change, the user object
 * stays the same. AuthContext owns "who is logged in"; this is just a data
 * operation for an already-authenticated user.
 *
 * The access token is automatically attached to the request by the Axios
 * request interceptor in client.js — no manual auth handling needed here.
 *
 * Client-side validation: checks new passwords match before the API call.
 * Backend validation: verifies old password is correct and new passwords match.
 *
 * On success: displays a green confirmation message (no navigation — user
 *             stays on the same page, typically their profile settings).
 * On failure: displays a red error message inline.
 *
 * Used by: ProfilePage (settings section)
 */

import { useState } from 'react';
import apiClient from '../../api/client';

const PasswordChangeForm = () => {
    // Controlled input state — each field is driven by React state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // null = no error; string = error message to display
    const [error, setError] = useState(null);

    // null = not yet succeeded; string = success message to display
    const [success, setSuccess] = useState(null);

    // Prevents double-submission and drives the button's disabled/label state
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handles form submission.
     *
     * Validates new passwords match client-side first, then sends a POST to
     * /auth/password_change/ with snake_case field names as expected by the
     * Django backend. Displays success or error message in place.
     * isSubmitting is always reset in the finally block regardless of outcome.
     */
    const handleSubmit = async (e) => {
        // Prevent the browser's default form submission (page reload)
        e.preventDefault();

        // Client-side validation: check new passwords match before hitting the API
        if (newPassword !== confirmNewPassword) {
            setError("New passwords do not match");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            // Field names are snake_case to match the Django serializer's expected keys
            await apiClient.post('/auth/password_change/', {
                old_password: currentPassword,
                new_password: newPassword,
                new_password2: confirmNewPassword
            });
            // TODO: remove console.log once confirmed working end-to-end
            console.log("Password changed successfully");
            setSuccess("Password changed successfully");
        } catch (error) {
            console.error("Password change failed:", error);
            setError("Failed to change password. Please try again.");
            setSuccess(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Current Password:</label>
                {/* value + onChange makes this a controlled input */}
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>New Password:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Confirm New Password:</label>
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
            </div>

            {/* Only renders when error is non-null */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Only renders when success is non-null */}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {/* Disabled while submitting to prevent duplicate requests */}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Changing password...' : 'Change Password'}
            </button>
        </form>
    );
};

export default PasswordChangeForm;
