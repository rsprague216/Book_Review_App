/**
 * ProtectedRoute.jsx
 *
 * Route guard component that restricts access to authenticated users only.
 *
 * Wraps any route that requires a logged-in user. Three possible outcomes:
 *
 *   1. Auth check in progress (isLoading): renders a loading placeholder
 *      while AuthContext silently restores the session from a stored refresh
 *      token. Without this check, the user would be incorrectly redirected
 *      to /login on every page refresh before the session has a chance to
 *      restore.
 *
 *   2. No authenticated user: redirects to /login using <Navigate replace>.
 *      The `replace` prop replaces the current history entry rather than
 *      pushing a new one — so pressing the browser back button after being
 *      redirected won't send the user back to the protected page they just
 *      tried to access.
 *
 *   3. User is authenticated: renders the child component(s) as normal.
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={
 *       <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   } />
 *
 * The loading placeholder (<p>Loading...</p>) is intentionally simple for
 * now. It will be replaced with a skeleton UI component in a later phase —
 * only what renders during isLoading needs to change, not the logic.
 *
 * Used by: App.jsx (wraps all authenticated routes)
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    // isLoading is true while AuthContext is restoring session on startup
    // user is null when logged out, a user object when authenticated
    const { user, isLoading } = useAuth();

    // Wait for session restore before making any redirect decision.
    // Without this, a logged-in user with a valid refresh token would be
    // incorrectly bounced to /login on every page refresh.
    if (isLoading) {
        return <p>Loading...</p>;
    }

    // No authenticated user — send to login.
    // `replace` prevents the protected URL from appearing in browser history.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated — render the protected page
    return children;
};

export default ProtectedRoute;
