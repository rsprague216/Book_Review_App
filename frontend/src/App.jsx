/**
 * App.jsx
 *
 * Application root — sets up global providers and client-side routing.
 *
 * Provider hierarchy (order matters):
 *   AuthProvider    — must be outermost so all components can access auth state
 *     Router        — must wrap everything that uses Link, useNavigate, or Route
 *       Navbar      — always visible; uses both useAuth() and Link
 *       Routes      — matches the current URL and renders the correct page
 *
 * Route structure:
 *   Public routes   — accessible without authentication
 *   Protected routes — grouped under a pathless layout route that gates access
 *                      via ProtectedRoute. Adding a new protected route only
 *                      requires nesting it inside this group.
 *
 * Layout route pattern:
 *   A pathless <Route> with no `path` prop acts purely as a layout wrapper.
 *   Its element (ProtectedRoute + Outlet) runs for every matched child route.
 *   <Outlet /> is the React Router placeholder where the matched child renders.
 *   This avoids wrapping each protected route element individually.
 *
 * Page stubs:
 *   Route elements are currently inline <h1> placeholders. These will be
 *   replaced with real page components (LoginPage, RegisterPage, etc.) in
 *   Step 18.
 */

import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    // AuthProvider makes user, login, logout, register available to the entire tree
    <AuthProvider>
      {/* Router enables client-side navigation — no full page reloads */}
      <Router>
        {/* Header renders on every page, outside Routes so it is never unmounted */}
        <Header />

        <Routes>
          {/* ---- Public routes ---- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ---- Protected routes ---- */}
          {/* Pathless layout route: no path prop, only provides the ProtectedRoute guard.
              Outlet renders whichever child route matched. Any unauthenticated request
              to a child path is intercepted here and redirected to /login. */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
