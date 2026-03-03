/**
 * LoginForm.jsx
 *
 * Controlled form component for user authentication.
 *
 * Calls login() from AuthContext, which handles the API request, token
 * storage, and user state. This component is only responsible for capturing
 * input, managing form-level UI state, and navigating on success.
 *
 * On success: navigates to /dashboard.
 * On failure: displays an error message inline (no page reload).
 *
 * Used by: LoginPage
 */

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
    // Controlled input state — each field is driven by React state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // null = no error; string = error message to display
    const [error, setError] = useState(null);

    // Prevents double-submission and drives the button's disabled/label state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles form submission.
     *
     * Clears any previous error, calls AuthContext.login(), and navigates
     * to the dashboard on success. On failure, displays the error message.
     * isSubmitting is always reset in the finally block regardless of outcome.
     */
    const handleSubmit = async (e) => {
        // Prevent the browser's default form submission (page reload)
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            // Show a generic message — avoid confirming whether the username exists
            setError("Invalid username or password");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Username</label>
                {/* value + onChange makes this a controlled input */}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your username"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                />
            </div>

            {/* Only renders when error is non-null */}
            {error && (
                <p className="text-sm text-error bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                </p>
            )}

            {/* Disabled while submitting to prevent duplicate requests */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
        </form>
    );
};

export default LoginForm;
