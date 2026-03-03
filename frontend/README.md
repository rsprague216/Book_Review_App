# BookBuddy — Frontend

React 19 + Vite 7 frontend for the BookBuddy app. Handles UI, client-side routing, and communication with the Django REST API.

## Tech Stack

- **React 19** — UI library
- **Vite 7** — Build tool and dev server
- **TailwindCSS v4** — Utility-first CSS with `@theme` design tokens
- **Axios** — HTTP client with JWT request/response interceptors
- **React Router v6** — Client-side routing with protected route pattern

## Setup

```bash
npm install
npm run dev
```

Dev server runs at http://localhost:5173. The Django backend must also be running at http://localhost:8000.

## Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run lint     # ESLint (flat config, React hooks + refresh plugins)
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
  api/
    client.js               # Axios instance (baseURL: localhost:8000/api)
                            # Request interceptor: attaches Bearer token
                            # Response interceptor: silent refresh on 401
  components/
    auth/
      LoginForm.jsx          # Controlled form — calls useAuth().login()
      RegisterForm.jsx       # Controlled form — calls useAuth().register()
      PasswordChangeForm.jsx # Calls apiClient directly (no auth state change)
    layout/
      Header.jsx             # Top bar: BookBuddy logo (left) + Navbar (right)
      Navbar.jsx             # Auth-aware nav links (logged in / logged out)
      ProtectedRoute.jsx     # Redirects to /login if unauthenticated
  contexts/
    AuthContext.jsx          # Global auth state: user, isLoading, login, logout, register
                            # Silently restores session from localStorage on startup
  pages/
    HomePage.jsx             # Public landing page
    LoginPage.jsx            # Centered card wrapping LoginForm
    RegisterPage.jsx         # Centered card wrapping RegisterForm
    DashboardPage.jsx        # Protected — Phase 2
    ProfilePage.jsx          # Protected — contains PasswordChangeForm
  App.jsx                   # Router root: AuthProvider → BrowserRouter → Header + Routes
  main.jsx                  # Entry point
  index.css                 # Tailwind import + @theme design tokens
```

## Routing

Public routes (no auth required):
- `/` — Home
- `/login` — Login
- `/register` — Register

Protected routes (redirect to `/login` if not authenticated):
- `/dashboard` — Dashboard
- `/profile` — Profile & settings

Protection is implemented via a pathless layout route wrapping all protected routes with `ProtectedRoute` + `Outlet`.

## Auth & Token Strategy

- **Access token** — stored in memory only (module-level variable in `client.js`). Attached to every request via Axios interceptor. Lost on page refresh — silently replaced using the refresh token.
- **Refresh token** — stored in `localStorage`. Persists across page refreshes. On app startup, `AuthContext` exchanges it for a new access token automatically.
- **On 401** — the response interceptor attempts a silent token refresh and retries the original request. If the refresh fails, the user is redirected to `/login`.

## Design System

Design tokens are defined in `index.css` using Tailwind v4's `@theme` block:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#2563EB` | Brand blue — buttons, links, focus rings |
| `primary-dark` | `#1E40AF` | Hover state for primary |
| `primary-light` | `#DBEAFE` | Subtle blue backgrounds |
| `success` | `#10B981` | Success messages |
| `error` | `#EF4444` | Error messages |
| `warning` | `#F59E0B` | Warnings, trending |
| `ai` | `#7C3AED` | AI-powered features |
| `bg-secondary` | `#F9FAFB` | Default page background |

Font: **Inter** (loaded via Google Fonts in `index.html`).

Use `text-primary`, `bg-primary`, `hover:bg-primary-dark`, `text-error` etc. — not raw hex or Tailwind's default color names.
