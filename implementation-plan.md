# BookBuddy Implementation Plan

## Context

BookBuddy is a full-stack Goodreads-like app. Phase 1 (Foundation & Authentication) is fully complete — backend and frontend. Phase 2 (Books & Reading Core) is next.

All features are fully specified in design docs at the repo root.

The goal is to establish clear development phases, each building on the last, with backend implemented before frontend at every level (both across phases and within each phase).

**Tech stack:** Django 6 + DRF 3.16 + SimpleJWT | React 19 + Vite 7 + TailwindCSS 4
**Auth:** JWT via `djangorestframework-simplejwt` (15-min access, 7-day refresh with rotation)
**External APIs:** Google Books, Anthropic Claude, Resend Email, AWS S3

---

## Phase 1: Foundation & Authentication

**Goal:** Users can register, log in, and have a profile. This is the prerequisite for every other feature.

### Backend
1. ✅ Install `djangorestframework-simplejwt`, `argon2-cffi`, and `django-environ` — update `requirements.txt`
2. ✅ Configure JWT settings in `config/settings.py` (Argon2 password hasher, token lifetimes, rotation)
3. ✅ Add `.env` support via `django-environ`; move `SECRET_KEY` out of settings
4. ✅ Create `UserProfile` model in `api/models.py` (bio, avatar, location, reading goal, privacy settings) — OneToOne with Django's built-in `User`
5. ✅ `makemigrations` + `migrate`
6. ✅ Create `api/serializers.py` with `UserSerializer`, `UserProfileSerializer`, `RegisterSerializer`, `LoginSerializer`
7. ✅ Create auth views: `register`, `login`, `logout`, `token_refresh`, `me`, `password_change`
8. ✅ Create profile views: `profile_detail` (get/update), `avatar_upload` (deferred — requires file storage)
9. ✅ Update `api/urls.py` with all auth + profile routes
10. ✅ Register `UserProfile` in `api/admin.py`
11. ✅ Write Django tests for auth endpoints (11/11 passing)

### Frontend
12. ✅ Install `axios`, `react-router-dom` — update `package.json`
13. ✅ Create `src/api/client.js` — Axios instance with base URL, JWT interceptors (auto-refresh on 401)
14. ✅ Create `src/contexts/AuthContext.jsx` — global auth state, token storage in memory + localStorage session restore
15. ✅ Create `src/components/auth/` — `LoginForm`, `RegisterForm`, `PasswordChangeForm`
16. ✅ Create `src/components/layout/` — `Header`, `Navbar`, `ProtectedRoute`
17. ✅ Update `App.jsx` to use React Router with protected/public routes (layout route pattern)
18. ✅ Create `src/pages/` — `HomePage`, `LoginPage`, `RegisterPage`, `DashboardPage`, `ProfilePage`

### Design System
19. ✅ Configure Inter font via Google Fonts
20. ✅ Define brand design tokens in `index.css` via Tailwind v4 `@theme` block
21. ✅ Style Login and Register pages — centered card layout with styled inputs and buttons

**Verification:** ✅ Register a user, log in, get a JWT, fetch `/api/me/`, change password, log out — all working end-to-end through the UI. Protected routes redirect unauthenticated users to `/login`. Session persists across page refreshes.

---

## Phase 2: Books & Reading Core

**Goal:** Users can search for books via Google Books API, add them to shelves, track reading progress, and write reviews.

### Backend
1. Add `GOOGLE_BOOKS_API_KEY` to `.env` + settings
2. Create models: `Book`, `UserBook`, `Review`, `ReviewLike`, `Comment` in `api/models.py`
3. `makemigrations` + `migrate`
4. Create `api/services/google_books.py` — wrapper for Google Books API with caching (store results in `Book` table)
5. Add serializers: `BookSerializer`, `UserBookSerializer`, `ReviewSerializer`, `CommentSerializer`
6. Create views + URL routes:
   - Books: `search`, `detail`, `add_to_shelf`, `book_reviews`, `book_rating_stats`
   - User Books: list, detail, update (shelf/progress), stats
   - Reviews: CRUD, like/unlike
   - Comments: CRUD with threading
7. Add pagination to list endpoints
8. Write tests for book search (mock Google Books), shelf operations, review CRUD

### Frontend
9. Create `src/components/books/` — `BookCard`, `BookDetail`, `BookSearchBar`, `ShelfSelector`
10. Create `src/components/reviews/` — `ReviewForm`, `ReviewCard`, `StarRating`, `CommentThread`
11. Create `src/components/shelves/` — `ShelfView`, `ReadingProgress`, `ProgressBar`
12. Create `src/pages/` — `SearchPage`, `BookDetailPage`, `MyShelvesPage`, `ReviewDetailPage`
13. Wire up all API calls via `src/api/books.js`, `src/api/reviews.js`

**Verification:** Search "The Martian", add to "Currently Reading", set page progress, write a review with a star rating, view review on book page.

---

## Phase 3: Social Features

**Goal:** Users can follow each other, see activity feeds, interact with reviews, and receive notifications.

### Backend
1. Create models: `Follow`, `Activity`, `Notification`, `NotificationPreferences`, `UserBlock` in `api/models.py`
2. `makemigrations` + `migrate`
3. Add serializers: `FollowSerializer`, `ActivitySerializer`, `NotificationSerializer`
4. Create views + URL routes:
   - Follows: follow, unfollow, check, suggestions
   - Activity: personal feed, global feed (with filtering)
   - Notifications: list, mark-read, unread-count
   - Users: search by username, user's books/reviews/followers/following
5. Add signals in `api/signals.py` to auto-create `Activity` and `Notification` records on model saves (review created, book added, follow created)
6. Write tests for follow logic, feed ordering, notification creation

### Frontend
7. Create `src/components/social/` — `FollowButton`, `FollowerList`, `ActivityFeedItem`, `NotificationBadge`, `NotificationList`
8. Create `src/components/users/` — `UserCard`, `UserProfileHeader`, `UserStats`
9. Create `src/pages/` — `ActivityFeedPage`, `UserProfilePage`, `NotificationsPage`
10. Wire up `src/api/social.js`, `src/api/users.js`
11. Add notification badge to `Navbar`

**Verification:** Follow another user, write a review, verify follower sees it in activity feed, verify review author gets notification for likes/comments.

---

## Phase 4: Community — Chat & Lists

**Goal:** Each book has a real-time chat room. Users can create custom book lists and track reading goals.

### Backend
1. Add `channels` and `channels-redis` (or `channels` with in-memory layer for dev) — update `requirements.txt`
2. Configure Django Channels in `config/asgi.py` and `config/settings.py`
3. Create models: `ChatRoom`, `ChatMessage`, `ChatRoomMembership`, `UserMention`, `MessageReaction`, `BookList`, `BookListItem`, `BookListLike`, `ReadingGoal` in `api/models.py`
4. `makemigrations` + `migrate`
5. Create `api/consumers.py` — `ChatConsumer` WebSocket consumer (JWT auth on connect, broadcast messages, handle reactions/mentions)
6. Add WebSocket URL routing in `config/routing.py`
7. Add REST serializers and views for:
   - Chat Rooms: list, detail, join/leave, mute, message history
   - Book Lists: CRUD, add/remove books, reorder, like, discover public lists
   - Reading Goals: create, update, progress auto-calculated from `UserBook`
8. Write tests for WebSocket consumer (using `channels.testing`), list operations, goal tracking

### Frontend
9. Create `src/components/chat/` — `ChatRoom`, `ChatMessage`, `ChatInput`, `MessageReaction`, `MentionAutocomplete`
10. Create `src/hooks/useWebSocket.js` — WebSocket client with reconnect logic
11. Create `src/components/lists/` — `BookListCard`, `BookListDetail`, `AddToListModal`
12. Create `src/components/goals/` — `ReadingGoalCard`, `GoalProgress`
13. Create `src/pages/` — `BookChatPage`, `MyListsPage`, `DiscoverListsPage`, `ReadingGoalsPage`

**Verification:** Open book chat room in two browser tabs (as different users), send messages, add emoji reaction, create a book list and add 3 books, set a reading goal and verify progress updates when books are marked finished.

---

## Phase 5: AI Features & Polish

**Goal:** AI-powered recommendations, smart search, and review summarization using Anthropic Claude.

### Backend
1. Add `anthropic` SDK — update `requirements.txt`
2. Add `ANTHROPIC_API_KEY` to `.env` + settings
3. Create `api/services/ai.py` — Claude client wrapper (smart book search, review summarization, recommendations, Q&A)
4. Create models: `RecommendationFeed`, `RecommendationFeedItem`, `TrendingBook` in `api/models.py`
5. `makemigrations` + `migrate`
6. Add AI views + URL routes:
   - `POST /api/ai/search/` — natural language book search (with rate throttle: 10/hour)
   - `GET /api/ai/recommendations/` — personalized recommendations feed
   - `POST /api/ai/summarize/{book_id}/` — summarize reviews for a book
   - `POST /api/ai/qa/{book_id}/` — Q&A about a book
   - `GET /api/ai/list-suggestions/{list_id}/` — AI themes for a custom list
7. Add `TrendingBook` management command for scheduled updates
8. Write tests (mock Claude API responses)

### Frontend
9. Create `src/components/ai/` — `AISearchBar`, `AIRecommendationCard`, `ReviewSummary`, `BookQA`
10. Create `src/pages/` — `AISearchPage`, `RecommendationsPage`
11. Add AI search entry point to `Navbar`

### Polish (both)
12. Backend: Add `django-environ`-based production settings (`DEBUG=False`, PostgreSQL config stub, security headers), `python manage.py check --deploy`
13. Backend: Add DRF throttling globally (100/hour anonymous, 1000/hour authenticated)
14. Frontend: Add loading skeletons, error boundaries, responsive breakpoints for mobile
15. Frontend: Run `npm run lint` and fix all warnings

**Verification:** Use AI search to find a book by description, view personalized recommendations, request review summary for a heavily-reviewed book, get a spoiler-flagged Q&A answer.

---

## Critical Files

| File | Purpose |
|------|---------|
| `backend/api/models.py` | All 24+ models go here (or split into `api/models/` package later) |
| `backend/api/serializers.py` | DRF serializers |
| `backend/api/views.py` | All views (or split into `api/views/` package per feature) |
| `backend/api/urls.py` | URL routing |
| `backend/api/signals.py` | Auto-create Activity/Notification records |
| `backend/api/consumers.py` | WebSocket consumer for chat |
| `backend/api/services/` | Google Books + AI service wrappers |
| `backend/config/settings.py` | Django settings |
| `backend/config/asgi.py` | Channels ASGI config (Phase 4) |
| `frontend/src/api/client.js` | Axios instance with JWT interceptors |
| `frontend/src/contexts/AuthContext.jsx` | Global auth state |
| `frontend/src/hooks/useWebSocket.js` | WebSocket client hook (Phase 4) |

---

## Design Doc References

Consult these before implementing each phase:
- `schema-api-updates-summary.md` — exact model fields
- `book-review-app-design-doc.md` — feature requirements per phase
- `react-component-structure.md` — component props and hierarchy
- `external-api-integration.md` — Google Books + Claude API usage patterns
- `security-authentication-guide.md` — JWT config, serializer validation patterns
