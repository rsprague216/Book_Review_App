/**
 * RegisterForm.jsx
 *
 * Controlled form component for new user registration.
 *
 * Performs client-side password match validation before calling the API,
 * providing instant feedback without a network round-trip. The backend also
 * validates password match independently as a second line of defence.
 *
 * Calls register() from AuthContext, which creates the account and
 * automatically logs the user in on success (no separate login step required).
 *
 * On success: navigates to /dashboard.
 * On failure: displays an error message inline.
 *
 * Used by: RegisterPage
 */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const RegisterForm = () => {
    // Controlled input state — each field is driven by React state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    // null = no error; string = error message to display
    const [error, setError] = useState(null);

    // Prevents double-submission and drives the button's disabled/label state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles form submission.
     *
     * Validates passwords match client-side first (fast feedback), then calls
     * AuthContext.register() which creates the account and auto-logs in.
     * Navigates to dashboard on success; displays error on failure.
     * isSubmitting is always reset in the finally block regardless of outcome.
     */
    const handleSubmit = async (e) => {
        // Prevent the browser's default form submission (page reload)
        e.preventDefault();

        // Client-side validation: check passwords match before hitting the API
        if (password !== password2) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            // register() creates the account then calls login() automatically
            await register(username, email, password, password2);
            navigate('/dashboard');
        } catch (error) {
            console.error("Registration failed:", error);
            setError("Registration failed. Please try again.");
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
                    placeholder="Choose a username"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                {/* type="email" triggers browser-level format validation */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your email"
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
                    placeholder="Create a password"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
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
                {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
        </form>
    );
};

export default RegisterForm;
