/**
 * client.js
 *
 * Configures and exports a pre-built Axios instance (apiClient) for all
 * communication between the React frontend and the Django backend API.
 *
 * Responsibilities:
 *  - Sets the base URL so callers only need to specify the endpoint path
 *  - Manages JWT access and refresh tokens in memory (not localStorage),
 *    which prevents XSS attacks from reading tokens via the DOM
 *  - Attaches the access token to every outgoing request via a request interceptor
 *  - Automatically attempts a token refresh on 401 Unauthorized responses,
 *    then retries the original request transparently (response interceptor)
 *  - Redirects the user to /login if the refresh token is also expired
 *
 * Token storage strategy:
 *  - Access token: module-level variable (in memory) — fast, XSS-safe, lost on page refresh
 *  - Refresh token: module-level variable (in memory) — same tradeoffs; can be moved
 *    to an httpOnly cookie in production for added security
 *
 * Known limitation:
 *  - If multiple requests fail with 401 simultaneously, multiple refresh calls
 *    may fire. A refresh lock/queue should be added before production.
 *
 * Usage:
 *  import apiClient from './api/client';
 *  apiClient.get('/auth/me/');
 *
 *  import { setAccessToken, setRefreshToken } from './api/client';
 *  setAccessToken(token);   // called by AuthContext after login
 *  setRefreshToken(token);  // called by AuthContext after login
 */

import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * All requests made through apiClient will automatically have the base URL
 * and Content-Type header applied.
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * In-memory token store.
 * Stored as module-level variables so they persist across component renders
 * but are cleared when the page is refreshed or the tab is closed.
 * AuthContext calls the setters below after a successful login or token refresh.
 */
let accessToken = null;
let refreshToken = null;

/**
 * Updates the in-memory access token.
 * Called by AuthContext on login, logout (null), and after a silent token refresh.
 *
 * @param {string|null} token - The new JWT access token, or null to clear it.
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Updates the in-memory refresh token.
 * Called by AuthContext on login and logout (null).
 *
 * @param {string|null} token - The new JWT refresh token, or null to clear it.
 */
export const setRefreshToken = (token) => {
  refreshToken = token;
};

export default apiClient;


// ---------------------------------------------------------------------------
// Interceptors
// ---------------------------------------------------------------------------

/**
 * Request interceptor — attaches the JWT access token to every outgoing request.
 *
 * Runs before each request is sent. If an access token is present in memory,
 * it is added to the Authorization header in the format expected by
 * Django SimpleJWT: "Bearer <token>".
 *
 * If no token exists (e.g. the user is not logged in), the request is sent
 * without the header. Public endpoints (login, register) work fine without it;
 * protected endpoints will receive a 401 from the server, which the response
 * interceptor below will handle.
 */
apiClient.interceptors.request.use(config => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  // config must always be returned so Axios knows what to send
  return config;
}, error => {
  // This handler fires if something goes wrong building the request itself
  // (rare — not an HTTP error). Pass the error downstream.
  return Promise.reject(error);
});

/**
 * Response interceptor — handles 401 Unauthorized errors with a silent token refresh.
 *
 * Flow when a 401 is received:
 *  1. Call POST /api/auth/token/refresh/ with the current refresh token.
 *     (Uses plain axios, not apiClient, to avoid triggering this interceptor again.)
 *  2. On success: store the new access token, patch the failed request's Authorization
 *     header, and replay the original request so the caller receives their data
 *     transparently — no error is surfaced to the component.
 *  3. On failure (refresh token expired or invalid): clear both tokens from memory
 *     and redirect the user to /login so they can re-authenticate.
 *
 * Non-401 errors are passed through unchanged via Promise.reject(error).
 */
apiClient.interceptors.response.use(response => {
  // Successful response — pass it through untouched
  return response;
}, async error => {
  if (error.response && error.response.status === 401) {
    try {
      // Attempt a silent token refresh using the stored refresh token.
      // Plain axios is used here (not apiClient) to prevent an infinite loop
      // where a failed refresh triggers another 401, which triggers another refresh, etc.
      const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', { refresh: refreshToken });

      const newAccessToken = response.data.access;

      // Store the new access token in memory so future requests use it
      setAccessToken(newAccessToken);

      // Patch the Authorization header on the original failed request config
      // so the retry goes out with the fresh token
      error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

      // Replay the original request — the calling component receives this
      // response as if the 401 never happened
      return apiClient.request(error.config);

    } catch (refreshError) {
      // The refresh token is expired or invalid — the session cannot be recovered.
      // Clear both tokens and send the user back to the login page.
      console.error('Session expired. Redirecting to login.', refreshError);
      setAccessToken(null);
      setRefreshToken(null);
      window.location.href = '/login';
    }
  }

  // For all non-401 errors, reject normally so the calling code can handle them
  return Promise.reject(error);
});
