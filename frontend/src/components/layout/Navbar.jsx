/**
 * Navbar.jsx
 *
 * Persistent top-level navigation bar rendered on every page.
 *
 * Auth-aware: reads user state from AuthContext and renders different
 * nav items depending on whether the user is logged in or not.
 *
 * Logged out: shows Login and Register links.
 * Logged in:  shows a welcome message with the username and a Logout button.
 *
 * Uses React Router's <Link> for client-side navigation (no full page reload)
 * and useNavigate() for the programmatic redirect that follows logout.
 *
 * Logout sequence:
 *   1. logout() clears auth state and tokens (AuthContext + localStorage)
 *   2. navigate('/login') sends the user to the login page
 *   Both steps are needed — logout() alone doesn't change the URL.
 *
 * The Home link has been removed — the BookBuddy title in Header serves as
 * the home link, so duplicating it here is unnecessary.
 *
 * Used by: Header.jsx
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    // user is null when logged out, a user object when logged in
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles the logout button click.
     *
     * Calls AuthContext.logout() to clear tokens and user state, then
     * navigates to /login. The navigate call must come after logout() so
     * the user object is cleared before the login page mounts.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        // flex + gap lays all nav items out as a horizontal row
        <nav className="flex items-center gap-6">
            {/* Conditional nav items based on auth state */}
            {user ? (
                // Authenticated: show username and logout button
                <div className="flex items-center gap-6">
                    {/* user.username matches the field returned by the /me/ endpoint */}
                    <span className="text-sm text-gray-600">Welcome, {user.username}!</span>
                    {/* button (not Link) — logout is an action, not a navigation */}
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                // Unauthenticated: show login and register links
                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                    >
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
