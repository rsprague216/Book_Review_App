/**
 * AuthContext.jsx
 *
 * Provides global authentication state and actions to the entire React component
 * tree via React Context. Any component can access auth state by calling useAuth()
 * instead of receiving it through prop drilling.
 *
 * State managed here:
 *  - user        {object|null}  — The current user object from /api/auth/me/, or null if logged out
 *  - isLoading   {boolean}      — True while the app is checking for an existing session on startup.
 *                                 Components should wait for isLoading=false before rendering
 *                                 protected or auth-dependent UI, to avoid a flash of wrong state.
 *
 * Actions exposed via context:
 *  - login(username, password)                     — Authenticate and store tokens
 *  - logout()                                      — Clear all auth state
 *  - register(username, email, password, password2) — Create account and auto-login
 *
 * Session persistence strategy:
 *  - Access token:  stored in memory only (via client.js) — fast, XSS-safe, lost on page refresh
 *  - Refresh token: persisted to localStorage — survives page refresh; used to silently
 *                   restore the session on app startup without requiring the user to log in again
 *
 * On every app startup, AuthContext checks localStorage for a saved refresh token.
 * If found, it exchanges it for a fresh access token, then fetches the current user.
 * This "silent restore" happens before isLoading is set to false, so the rest of the
 * app never sees a logged-out state for a user who is actually authenticated.
 *
 * Usage:
 *  // Wrap your app (in main.jsx or App.jsx):
 *  <AuthProvider>
 *    <App />
 *  </AuthProvider>
 *
 *  // In any component:
 *  const { user, login, logout, isLoading } = useAuth();
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient, { setAccessToken, setRefreshToken } from "../api/client";

/**
 * The React Context object. Not used directly — components should use useAuth() instead.
 */
const AuthContext = createContext();

/**
 * Custom hook for consuming auth context.
 * Provides a clean import interface so components don't need to import AuthContext directly.
 *
 * @returns {{ user, isLoading, login, logout, register }} The auth context value
 *
 * @example
 * const { user, logout } = useAuth();
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * AuthProvider component — wraps the app and makes auth state available to all children.
 * Should be placed high in the component tree (e.g. wrapping <App /> in main.jsx).
 *
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  /** The authenticated user object from /api/auth/me/, or null if not logged in */
  const [user, setUser] = useState(null);

  /**
   * True while the initial session restore is in progress.
   * Starts as true so nothing renders before we've checked localStorage.
   * Set to false once the check completes (success or failure).
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On mount, attempt to silently restore a previous session.
   *
   * Flow:
   *  1. Read the refresh token from localStorage
   *  2. If found, exchange it for a fresh access token via the refresh endpoint
   *  3. Store the new access token in memory (client.js)
   *  4. Fetch the current user to populate the user state
   *  5. If anything fails (expired token, network error), call logout() to clean up
   *  6. Always set isLoading=false when done so the app can render
   *
   * The empty dependency array [] means this runs once when the component mounts.
   * The useEffect callback itself cannot be async, so we define an inner async
   * function (initializeAuth) and call it immediately.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedRefreshToken) {
        // Put the refresh token into the client.js memory store so the
        // response interceptor can use it if needed during this startup flow
        setRefreshToken(storedRefreshToken);
        try {
          // Exchange the stored refresh token for a new short-lived access token.
          // The access token is never stored in localStorage — only in memory.
          const response = await apiClient.post('/auth/token/refresh/', { refresh: storedRefreshToken });

          const newAccessToken = response.data.access;

          // Store the fresh access token in memory so the request interceptor
          // can attach it to all subsequent API calls
          setAccessToken(newAccessToken);

          // Fetch the user profile to fully restore the session
          await fetchUser();
        } catch (error) {
          // Refresh token was expired or invalid — session cannot be restored.
          // Clear all auth state so the user lands on the login screen.
          console.error("Failed to refresh token:", error);
          logout();
        }
      }

      // Always mark loading as complete, whether session was restored or not.
      // This unblocks the rest of the app from rendering.
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Fetches the current user's data from the API and stores it in state.
   * Called after login, registration, and session restore.
   * If the request fails (e.g. token was revoked), logs the user out.
   */
  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/auth/me/");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      logout();
    }
  };

  /**
   * Registers a new user account, then automatically logs them in.
   *
   * The backend validates that password and password2 match. The registration
   * form should also validate this client-side for instant feedback before
   * making the API call.
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @param {string} password2 - Must match password (validated by backend)
   * @throws Will re-throw API errors so the form can display them to the user
   */
  const register = async (username, email, password, password2) => {
    try {
      await apiClient.post("/auth/register/", { username, email, password, password2 });
      // Auto-login after successful registration for a seamless UX
      await login(username, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  /**
   * Authenticates a user with username and password.
   * On success: stores tokens (access in memory, refresh in localStorage)
   * and fetches the user profile.
   *
   * @param {string} username
   * @param {string} password
   * @throws Will re-throw API errors so the form can display them to the user
   */
  const login = async (username, password) => {
    try {
      const response = await apiClient.post("/auth/login/", { username, password });
      const { access, refresh } = response.data;

      // Store access token in memory only (XSS-safe)
      setAccessToken(access);
      // Store refresh token in both memory and localStorage (for session persistence)
      setRefreshToken(refresh);
      localStorage.setItem("refreshToken", refresh);

      await fetchUser();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  /**
   * Logs the user out by clearing all auth state.
   * Removes tokens from memory (via client.js setters) and from localStorage.
   * Setting user to null will cause ProtectedRoute components to redirect to login.
   */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("refreshToken");
  };

  /**
   * Memoized context value — only recomputes when user or isLoading changes.
   * Functions (login, logout, register) are stable references and don't need
   * to be in the dependency array.
   */
  const value = useMemo(() => ({ user, login, logout, register, isLoading }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
