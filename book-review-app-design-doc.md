# Book Review & Reading Tracker - Comprehensive Design Document

**Project Name:** BookTrack (working title)  
**Version:** 2.0  
**Date:** February 9, 2026  
**Document Status:** Complete Design & Implementation Guide

**Companion Documents:**
- [Wireframes & UI Design](book-review-app-wireframes.md)
- [React Component Structure](react-component-structure.md)
- [External API Integration](external-api-integration.md)
- [Security & Authentication Guide](security-authentication-guide.md)
- [Schema & API Updates Summary](schema-api-updates-summary.md)
- [Entity Relationship Diagram](book-review-app-erd.mermaid)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals & Objectives](#2-goals--objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Database Schema](#5-database-schema)
6. [API Documentation](#6-api-documentation)
7. [Feature Specifications](#7-feature-specifications)
8. [User Interface & Experience](#8-user-interface--experience)
9. [Development Phases](#9-development-phases)
10. [Technical Considerations](#10-technical-considerations)
11. [Future Enhancements](#11-future-enhancements)
12. [External API Integration](#12-external-api-integration)
13. [Security & Authentication](#13-security-authentication)
14. [Frontend Architecture](#14-frontend-architecture)
15. [Implementation Readiness](#15-implementation-readiness)

---

## 1. Project Overview

### 1.1 Introduction

BookTrack is a full-stack web application designed to help readers track their reading progress, discover new books, write reviews, and connect with other readers. Similar to Goodreads but with enhanced features including real-time chat rooms, AI-powered recommendations, and customizable book collections.

### 1.2 Purpose

This application serves multiple purposes:
- **Personal Learning:** A comprehensive project to demonstrate full-stack development skills
- **Portfolio Piece:** Showcases modern web technologies, real-time features, and AI integration
- **Practical Application:** A functional tool for book lovers to organize and track their reading

### 1.3 Target Users

- Avid readers who want to track their reading progress
- Book club members looking to discuss books
- People seeking book recommendations
- Users who want to organize their reading lists
- Social readers who enjoy sharing reviews and connecting with others

### 1.4 Key Differentiators

- **Real-time Chat Rooms:** Live discussions for each book with threaded conversations
- **AI-Powered Features:** Smart recommendations, review summarization, and book discovery
- **Custom Collections:** Unlimited user-created lists beyond basic reading shelves
- **Reading Progress:** Detailed tracking with page numbers and statistics
- **Modern Tech Stack:** Built with current technologies and best practices

---

## 2. Goals & Objectives

### 2.1 Primary Goals

1. **Demonstrate Full-Stack Proficiency**
   - Build a production-quality application from scratch
   - Implement both frontend and backend technologies
   - Integrate third-party APIs and services

2. **Showcase Modern Development Practices**
   - RESTful API design
   - Real-time communication (WebSockets)
   - AI/LLM integration
   - Responsive design
   - Database optimization

3. **Create a Feature-Rich Application**
   - Core book tracking functionality
   - Social networking features
   - Real-time communication
   - AI-powered enhancements

### 2.2 Learning Objectives

- Master Django and Django REST Framework
- Build complex React applications with state management
- Implement WebSocket communication with Django Channels
- Integrate and work with LLM APIs
- Design and optimize relational databases
- Deploy full-stack applications

### 2.3 Success Criteria

- Fully functional MVP with core features
- Clean, maintainable codebase
- Responsive design across devices
- Deployed and accessible online
- Portfolio-ready documentation

---

## 3. Technology Stack

### 3.1 Frontend

**Core Framework:**
- **React** (v18+) - UI library
- **Vite** - Build tool and dev server

**Routing:**
- **React Router** (v6+) - Client-side routing

**State Management:**
- **TanStack Query (React Query)** - Server state management and caching
- **Context API** - Global UI state (user authentication, theme)

**Styling:**
- **Tailwind CSS** - Utility-first CSS framework

**Forms:**
- **React Hook Form** - Form handling and validation

**HTTP Client:**
- **Axios** or native **Fetch API** - API requests

### 3.2 Backend

**Core Framework:**
- **Python** (v3.10+)
- **Django** (v5.0+) - Web framework
- **Django REST Framework (DRF)** - API building

**Authentication:**
- **djangorestframework-simplejwt** - JWT token authentication

**Real-time:**
- **Django Channels** - WebSocket support
- **Redis** - Channel layer and caching
- **Daphne** or **Uvicorn** - ASGI server

**Database:**
- **MySQL** (v8.0+) - Primary database
- Development: MySQL locally
- Production: MySQL on cloud provider

**Additional Libraries:**
- **django-cors-headers** - CORS handling
- **python-decouple** or **django-environ** - Environment variables
- **Pillow** - Image handling
- **requests** or **httpx** - HTTP client for external APIs

### 3.3 External Services

**Book Data:**
- **Google Books API** - Book search and metadata

**AI/LLM:**
- **OpenAI API** or **Anthropic Claude API** - AI features
  - Review summarization
  - Smart book search
  - Personalized recommendations
  - Book Q&A

### 3.4 Development Tools

**Version Control:**
- **Git** - Version control
- **GitHub** - Repository hosting

**Package Management:**
- **npm** or **pnpm** - Frontend packages
- **pip** - Python packages
- **virtualenv** or **venv** - Python virtual environment

**Code Quality:**
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Black** - Python code formatting
- **Flake8** - Python linting

### 3.5 Deployment (Future)

**Frontend:**
- Vercel, Netlify, or Cloudflare Pages

**Backend:**
- Railway, Render, or Fly.io

**Database:**
- Managed MySQL on hosting provider
- Or separate service like PlanetScale, AWS RDS

**Redis:**
- Redis Labs, Upstash, or provider's Redis service

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           React Application (Vite)                    │  │
│  │  - Components, Pages, Routes                          │  │
│  │  - TanStack Query (API state)                         │  │
│  │  - Context (Global state)                             │  │
│  │  - Tailwind CSS (Styling)                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Django + Django REST Framework                │  │
│  │  - URL Routing                                        │  │
│  │  - JWT Authentication                                 │  │
│  │  - Rate Limiting                                      │  │
│  │  - CORS Headers                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                       │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   REST API       │  │   WebSocket      │                │
│  │   (DRF Views)    │  │   (Channels)     │                │
│  │                  │  │                  │                │
│  │  - Serializers   │  │  - Consumers     │                │
│  │  - Viewsets      │  │  - Routing       │                │
│  │  - Permissions   │  │  - Auth          │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Django Models & Services                 │  │
│  │  - User, Book, Review, ChatRoom, etc.                 │  │
│  │  - Business logic and validation                      │  │
│  │  - Signal handlers                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    MySQL     │  │    Redis     │  │  External    │      │
│  │   Database   │  │   (Cache +   │  │    APIs      │      │
│  │              │  │   Channels)  │  │              │      │
│  │  - User data │  │              │  │ - Google     │      │
│  │  - Books     │  │ - Session    │  │   Books API  │      │
│  │  - Reviews   │  │   cache      │  │ - OpenAI/    │      │
│  │  - Messages  │  │ - WebSocket  │  │   Claude API │      │
│  │  - etc.      │  │   layer      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow

**Standard REST Request:**
1. User interacts with React UI
2. React Query triggers API request
3. Request sent to Django REST API endpoint
4. Django authenticates via JWT
5. DRF View processes request
6. Model/database operations performed
7. Response serialized and returned
8. React Query caches and updates UI

**WebSocket (Chat) Flow:**
1. User opens chat room
2. WebSocket connection established
3. Django Channels authenticates connection
4. User sends message
5. Consumer receives message via WebSocket
6. Message saved to database
7. Message broadcast to all connected users via Redis
8. All clients receive and display message

**External API Integration:**
1. User searches for book
2. Django backend calls Google Books API
3. Results processed and returned to frontend
4. User selects book to add
5. Minimal book data cached in local database

### 4.3 Authentication Flow

**Registration/Login:**
1. User submits credentials
2. Django validates and creates/verifies user
3. JWT tokens generated (access + refresh)
4. Tokens returned to client
5. Client stores tokens (localStorage/sessionStorage)
6. Subsequent requests include access token in header

**Token Refresh:**
1. Access token expires
2. Client detects 401 Unauthorized
3. Client sends refresh token
4. New access token generated and returned
5. Original request retried with new token

**WebSocket Authentication:**
1. WebSocket connection includes JWT in query params
2. Django Channels validates token
3. Connection accepted or rejected
4. User identity available in consumer

---

## 5. Database Schema

### 5.1 Entity-Relationship Diagram

See separate `book-review-app-erd.mermaid` file for visual ERD.

### 5.2 Core Models

#### 5.2.1 User & Profile

**User** (Django built-in)
```python
- id (PK, auto)
- username (CharField, unique, max_length=150)
- email (EmailField, unique)
- password (CharField, hashed)
- first_name (CharField, max_length=150)
- last_name (CharField, max_length=150)
- date_joined (DateTimeField)
- is_active (BooleanField)
- is_staff (BooleanField)
- is_superuser (BooleanField)
```

**UserProfile**
```python
- id (PK)
- user (OneToOneField → User)
- bio (TextField, nullable)
- avatar_url (URLField, nullable)
- location (CharField, nullable)
- website (URLField, nullable)
- annual_reading_goal (IntegerField, default=0)
- profile_visibility (CharField, choices=['public', 'followers_only', 'private'], default='public')
- show_reading_activity (BooleanField, default=True)
- allow_others_see_shelves (BooleanField, default=True)
- allow_others_see_stats (BooleanField, default=True)
- username_changes_count (IntegerField, default=0)
- last_username_change_at (DateTimeField, nullable)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

#### 5.2.2 Books

**Book**
```python
- id (PK)
- google_books_id (CharField, unique, indexed)
- title (CharField, max_length=500)
- authors (JSONField)  # ["Author Name", ...]
- cover_image_url (URLField, nullable)
- thumbnail_url (URLField, nullable)
- description (TextField, nullable)
- isbn_10 (CharField, nullable, indexed)
- isbn_13 (CharField, nullable, indexed)
- page_count (IntegerField, nullable)
- published_date (CharField, nullable)
- publisher (CharField, nullable)
- categories (JSONField)  # ["Genre", ...]
- language (CharField, default='en')
- average_rating (FloatField, nullable)
- ratings_count (IntegerField, nullable)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

#### 5.2.3 User Books (Reading Shelves)

**UserBook**
```python
- id (PK)
- user (FK → User)
- book (FK → Book)
- shelf_status (CharField, choices=['want_to_read', 'currently_reading', 'finished'])
- current_page (IntegerField, default=0)
- total_pages (IntegerField, nullable)
- start_date (DateField, nullable)
- finish_date (DateField, nullable)
- created_at (DateTimeField)
- updated_at (DateTimeField)

Constraints:
- Unique: (user, book)
```

#### 5.2.4 Reviews & Ratings

**Review**
```python
- id (PK)
- user (FK → User)
- book (FK → Book)
- rating (IntegerField, 1-5)
- review_title (CharField, max_length=100, nullable)
- review_text (TextField, nullable)
- contains_spoilers (BooleanField, default=False)
- created_at (DateTimeField)
- updated_at (DateTimeField)
- likes_count (IntegerField, default=0)

Constraints:
- Unique: (user, book)
- Check: rating >= 1 AND rating <= 5
```

**ReviewLike**
```python
- id (PK)
- user (FK → User)
- review (FK → Review)
- created_at (DateTimeField)

Constraints:
- Unique: (user, review)
```

#### 5.2.5 Comments

**Comment**
```python
- id (PK)
- user (FK → User)
- review (FK → Review)
- comment_text (TextField)
- parent_comment (FK → self, nullable)
- created_at (DateTimeField)
- updated_at (DateTimeField)
- is_deleted (BooleanField, default=False)
- deleted_at (DateTimeField, nullable)
```

#### 5.2.6 Social - Follows

**Follow**
```python
- id (PK)
- follower (FK → User, related_name='following')
- following (FK → User, related_name='followers')
- created_at (DateTimeField)

Constraints:
- Unique: (follower, following)
- Check: follower ≠ following
```

#### 5.2.7 Activity Feed

**Activity**
```python
- id (PK)
- user (FK → User)
- activity_type (CharField, choices)
  # 'added_book', 'started_book', 'finished_book', 
  # 'wrote_review', 'rated_book', 'joined', 'followed_user',
  # 'comment_on_review', 'reply_to_comment', 'liked_review',
  # 'mentioned_in_chat', 'mentioned_in_comment'
- book (FK → Book, nullable)
- review (FK → Review, nullable)
- comment (FK → Comment, nullable)
- target_user (FK → User, nullable)
- metadata (JSONField, default=dict)
- is_read (BooleanField, default=False)
- read_at (DateTimeField, nullable)
- created_at (DateTimeField, indexed)
```

#### 5.2.8 Chat Rooms

**ChatRoom**
```python
- id (PK)
- book (OneToOneField → Book)
- created_at (DateTimeField)
- is_active (BooleanField, default=True)
- message_count (IntegerField, default=0)
- last_activity_at (DateTimeField, auto_now=True)
- messages_today (IntegerField, default=0)
- last_message_reset_date (DateField, auto_now=True)
```

**ChatMessage**
```python
- id (PK)
- chat_room (FK → ChatRoom)
- user (FK → User)
- message_text (TextField)
- parent_message (FK → self, nullable)
- created_at (DateTimeField, indexed)
- edited_at (DateTimeField, nullable)
- is_deleted (BooleanField, default=False)
- deleted_at (DateTimeField, nullable)
```

**UserMention**
```python
- id (PK)
- message (FK → ChatMessage)
- mentioned_user (FK → User)
- created_at (DateTimeField)
- is_read (BooleanField, default=False)

Constraints:
- Unique: (message, mentioned_user)
```

**ChatRoomMembership**
```python
- id (PK)
- chat_room (FK → ChatRoom)
- user (FK → User)
- joined_at (DateTimeField)
- last_read_at (DateTimeField, nullable)
- is_muted (BooleanField, default=False)
- muted_at (DateTimeField, nullable)

Constraints:
- Unique: (chat_room, user)
```

#### 5.2.9 Reading Goals

**ReadingGoal**
```python
- id (PK)
- user (FK → User)
- year (IntegerField)
- target_books (IntegerField)
- created_at (DateTimeField)
- updated_at (DateTimeField)

Constraints:
- Unique: (user, year)
- Check: target_books > 0
```

#### 5.2.10 Notifications

**Notification**
```python
- id (PK)
- user (FK → User, recipient)
- actor (FK → User, nullable, who triggered it)
- notification_type (CharField, choices)
  # 'new_follower', 'review_like', 'review_comment',
  # 'comment_reply', 'chat_mention', 'comment_mention'
- target_content_type (CharField, nullable)
- target_object_id (IntegerField, nullable)
- message (TextField)
- is_read (BooleanField, default=False)
- created_at (DateTimeField, indexed)
- read_at (DateTimeField, nullable)
```

#### 5.2.11 Book Lists/Collections

**BookList**
```python
- id (PK)
- user (FK → User)
- name (CharField, max_length=200)
- description (TextField, nullable)
- is_public (BooleanField, default=True)
- created_at (DateTimeField)
- updated_at (DateTimeField)
- books_count (IntegerField, default=0)

Constraints:
- Unique: (user, name)
```

**BookListItem**
```python
- id (PK)
- book_list (FK → BookList)
- book (FK → Book)
- position (IntegerField)
- note (TextField, nullable)
- added_at (DateTimeField)
- added_by (FK → User, nullable)

Constraints:
- Unique: (book_list, book)
- Check: position >= 0
```

**BookListLike**
```python
- id (PK)
- user (FK → User)
- book_list (FK → BookList)
- created_at (DateTimeField)

Constraints:
- Unique: (user, book_list)
```

#### 5.2.12 AI Recommendation Feeds

**RecommendationFeed**
```python
- id (PK)
- user (FK → User)
- name (CharField, max_length=200)
- description (TextField)
- criteria (JSONField)  # Structured AI-extracted preferences
- auto_refresh (BooleanField, default=False)
- refresh_frequency (CharField, choices=['daily', 'weekly', 'monthly'])
- last_refreshed_at (DateTimeField, nullable)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

**RecommendationFeedItem**
```python
- id (PK)
- feed (FK → RecommendationFeed)
- book (FK → Book)
- match_score (FloatField, 0.0-1.0)
- match_reasons (JSONField)  # ["reason1", "reason2", ...]
- ai_summary (TextField, nullable)
- key_themes (JSONField)
- added_at (DateTimeField)
- is_viewed (BooleanField, default=False)
- is_dismissed (BooleanField, default=False)

Constraints:
- Unique: (feed, book)
- Check: 0.0 <= match_score <= 1.0
```

#### 5.2.13 Notification Preferences

**NotificationPreferences**
```python
- id (PK)
- user (OneToOneField → User)
- email_new_follower (BooleanField, default=True)
- email_review_comment (BooleanField, default=True)
- email_comment_reply (BooleanField, default=True)
- email_chat_mention (BooleanField, default=True)
- email_comment_mention (BooleanField, default=True)
- email_weekly_summary (BooleanField, default=True)
- push_chat_message (BooleanField, default=True)
- push_activity (BooleanField, default=True)
- push_new_releases (BooleanField, default=False)
- push_recommendation (BooleanField, default=True)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

#### 5.2.14 Message Reactions

**MessageReaction**
```python
- id (PK)
- message (FK → ChatMessage)
- user (FK → User)
- reaction_type (CharField, max_length=20)  # 'thumbs_up', 'heart', 'laugh', 'surprised'
- created_at (DateTimeField)

Constraints:
- Unique: (message, user, reaction_type)
```

#### 5.2.15 Comment Mentions

**CommentMention**
```python
- id (PK)
- comment (FK → Comment)
- mentioned_user (FK → User)
- created_at (DateTimeField)
- is_read (BooleanField, default=False)
- read_at (DateTimeField, nullable)

Constraints:
- Unique: (comment, mentioned_user)
```

#### 5.2.16 User Blocking & Reporting

**UserBlock**
```python
- id (PK)
- blocker (FK → User, related_name='blocking')
- blocked (FK → User, related_name='blocked_by')
- reason (TextField, nullable)
- created_at (DateTimeField)

Constraints:
- Unique: (blocker, blocked)
- Check: blocker ≠ blocked
```

**UserReport**
```python
- id (PK)
- reporter (FK → User)
- reported_user (FK → User, nullable)
- reported_review (FK → Review, nullable)
- reported_comment (FK → Comment, nullable)
- reported_message (FK → ChatMessage, nullable)
- report_type (CharField, choices)
  # 'spam', 'harassment', 'inappropriate_content', 
  # 'hate_speech', 'violence', 'misinformation', 'other'
- description (TextField)
- status (CharField, choices=['pending', 'reviewing', 'resolved', 'dismissed'], default='pending')
- reviewed_by (FK → User, nullable)
- reviewed_at (DateTimeField, nullable)
- resolution_notes (TextField, nullable)
- created_at (DateTimeField)

Constraints:
- Check: At least one of (reported_user, reported_review, reported_comment, reported_message) must be set
```

#### 5.2.17 Trending Books (Cached Aggregation)

**TrendingBook**
```python
- id (PK)
- book (FK → Book)
- time_period (CharField, choices=['daily', 'weekly', 'monthly'])
- add_count (IntegerField, default=0)
- review_count (IntegerField, default=0)
- average_rating (FloatField, nullable)
- rank (IntegerField)
- period_start (DateField)
- period_end (DateField)
- last_updated (DateTimeField, auto_now=True)

Constraints:
- Unique: (book, time_period, period_start)
- Index: (time_period, rank)
```

### 5.3 Key Relationships Summary

```
User 1:1 UserProfile
User 1:1 NotificationPreferences
User 1:N UserBook
User 1:N Review
User 1:N ReviewLike
User 1:N Comment
User N:N Follow (self-referential)
User 1:N Activity
User 1:N ChatMessage
User N:N ChatRoom (through ChatRoomMembership)
User 1:N UserMention
User 1:N CommentMention
User 1:N MessageReaction
User 1:N ReadingGoal
User 1:N Notification
User 1:N BookList
User 1:N RecommendationFeed
User N:N UserBlock (self-referential)
User 1:N UserReport (as reporter)
User 1:N UserReport (as reported_user)

Book 1:N UserBook
Book 1:N Review
Book 1:1 ChatRoom
Book 1:N Activity
Book 1:N BookListItem
Book 1:N RecommendationFeedItem
Book 1:N TrendingBook

Review 1:N Comment
Review 1:N ReviewLike
Review 1:N Activity
Review 1:N UserReport

Comment 1:N Comment (self-referential threading)
Comment 1:N CommentMention
Comment 1:N UserReport

ChatRoom 1:N ChatMessage
ChatRoom 1:N ChatRoomMembership

ChatMessage 1:N UserMention
ChatMessage 1:N MessageReaction
ChatMessage 1:N ChatMessage (self-referential threading)
ChatMessage 1:N UserReport

BookList 1:N BookListItem
BookList 1:N BookListLike

RecommendationFeed 1:N RecommendationFeedItem
```

### 5.4 Database Indexes

**Critical Performance Indexes:**
- User: `username` (unique), `email` (unique)
- UserProfile: `(profile_visibility, created_at)`
- Book: `google_books_id` (unique), `title`, `isbn_10`, `isbn_13`
- UserBook: `(user, book)` (unique), `(user, shelf_status)`, `(user, finish_date)`
- Review: `(user, book)` (unique), `(book, created_at)`, `(book, rating)`
- Activity: `(user, created_at DESC)`, `(created_at DESC)`, `(user, is_read, created_at DESC)`
- ChatRoom: `(last_activity_at DESC)`, `(book)`
- ChatMessage: `(chat_room, created_at)`, `(chat_room, is_deleted, created_at)`
- ChatRoomMembership: `(chat_room, user)` (unique), `(user, is_muted)`
- MessageReaction: `(message, user, reaction_type)` (unique), `(message, reaction_type)`
- Notification: `(user, is_read)`, `(user, created_at DESC)`
- Follow: `(follower, following)` (unique), `follower`, `following`
- UserBlock: `(blocker, blocked)` (unique), `blocker`, `blocked`
- UserReport: `(status, created_at)`, `(reporter, created_at DESC)`
- BookList: `(user, name)` (unique), `(is_public, created_at)`
- CommentMention: `(comment, mentioned_user)` (unique), `(mentioned_user, is_read)`
- TrendingBook: `(time_period, rank)`, `(book, time_period, period_start)` (unique)
- RecommendationFeedItem: `(feed, match_score DESC)`

---

## 6. API Documentation

### 6.1 API Design Principles

- RESTful architecture
- JSON request/response format
- JWT authentication for protected endpoints
- Pagination for list endpoints (default 20 items)
- Consistent error handling
- Rate limiting on expensive operations

### 6.2 Authentication

**Headers:**
```
Authorization: Bearer <access_token>
```

**Token Refresh:**
```
POST /api/auth/refresh/
{
  "refresh": "<refresh_token>"
}
```

### 6.3 Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 100,
    "count": 20
  }
}
```

**Error:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ],
  "message": "Validation failed"
}
```

**Pagination:**
```json
{
  "count": 150,
  "next": "http://api/endpoint/?offset=40",
  "previous": "http://api/endpoint/?offset=0",
  "results": [...]
}
```

### 6.4 Core Endpoints Summary

#### Authentication (8 endpoints)
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/me/
PUT    /api/auth/me/
PATCH  /api/auth/me/password/
POST   /api/auth/forgot-password/
POST   /api/auth/reset-password/
```

#### Users (11 endpoints)
```
GET    /api/users/
GET    /api/users/search/
GET    /api/users/{id}/
PUT    /api/users/{id}/
PATCH  /api/users/{id}/avatar/
GET    /api/users/{id}/books/
GET    /api/users/{id}/reviews/
GET    /api/users/{id}/activity/
GET    /api/users/{id}/followers/
GET    /api/users/{id}/following/
GET    /api/users/{id}/follow-stats/
GET    /api/users/{id}/stats/
```

#### Books (6 endpoints)
```
GET    /api/books/search/
GET    /api/books/{id}/
POST   /api/books/
GET    /api/books/{id}/reviews/
GET    /api/books/{id}/average-rating/
GET    /api/books/{id}/stats/
```

#### User Books (11 endpoints)
```
POST   /api/user-books/
GET    /api/user-books/
GET    /api/user-books/{id}/
PUT    /api/user-books/{id}/
PATCH  /api/user-books/{id}/progress/
DELETE /api/user-books/{id}/
POST   /api/user-books/{id}/mark-reading/
POST   /api/user-books/{id}/mark-finished/
GET    /api/user-books/genres/
GET    /api/user-books/authors/
GET    /api/user-books/shelf-stats/
GET    /api/user-books/reading-stats/
```

#### Reviews (7 endpoints)
```
POST   /api/reviews/
GET    /api/reviews/
GET    /api/reviews/{id}/
PUT    /api/reviews/{id}/
DELETE /api/reviews/{id}/
GET    /api/reviews/{id}/comments/
POST   /api/reviews/{id}/like/
DELETE /api/reviews/{id}/like/
GET    /api/reviews/{id}/likes/
```

#### Comments (5 endpoints)
```
POST   /api/comments/
GET    /api/comments/{id}/
PUT    /api/comments/{id}/
DELETE /api/comments/{id}/
GET    /api/comments/{id}/replies/
```

#### Follows (3 endpoints)
```
POST   /api/follows/
DELETE /api/follows/{id}/
GET    /api/follows/check/{user_id}/
GET    /api/follows/suggestions/
```

#### Activity Feed (3 endpoints)
```
GET    /api/feed/
GET    /api/feed/global/
GET    /api/feed/user/{user_id}/
```

#### Chat Rooms (12 REST + WebSocket)
```
GET    /api/chat-rooms/
GET    /api/chat-rooms/book/{book_id}/
GET    /api/chat-rooms/{id}/
GET    /api/chat-rooms/{id}/messages/
POST   /api/chat-rooms/{id}/join/
DELETE /api/chat-rooms/{id}/leave/
GET    /api/chat-rooms/{id}/members/
PUT    /api/chat-rooms/{id}/mark-read/
GET    /api/chat-rooms/{id}/unread-count/
PATCH  /api/chat-rooms/{id}/mute/
PATCH  /api/chat-rooms/{id}/unmute/
GET    /api/chat-rooms/{id}/stats/

WS     /ws/chat/{room_id}/
```

#### Message Reactions (3 endpoints)
```
POST   /api/messages/{message_id}/react/
DELETE /api/messages/{message_id}/react/{reaction_type}/
GET    /api/messages/{message_id}/reactions/
```

#### Activity (Enhanced - 6 endpoints)
```
GET    /api/activity/
GET    /api/activity/user/{user_id}/
GET    /api/activity/unread-count/
PUT    /api/activity/{id}/mark-read/
PUT    /api/activity/mark-all-read/
GET    /api/activity/filter/
```

#### User Preferences (5 endpoints)
```
GET    /api/users/{id}/privacy/
PUT    /api/users/{id}/privacy/
GET    /api/users/{id}/notification-preferences/
PUT    /api/users/{id}/notification-preferences/
PATCH  /api/users/{id}/notification-preferences/
```

#### User Blocking & Reporting (7 endpoints)
```
POST   /api/users/block/
DELETE /api/users/unblock/{user_id}/
GET    /api/users/blocked/
POST   /api/reports/
GET    /api/reports/
GET    /api/reports/{id}/
PUT    /api/reports/{id}/resolve/
```

#### Trending (3 endpoints)
```
GET    /api/trending/books/
GET    /api/trending/books/weekly/
GET    /api/trending/books/monthly/
```

#### Reading Goals (5 endpoints)
```
POST   /api/reading-goals/
GET    /api/reading-goals/
GET    /api/reading-goals/current/
PUT    /api/reading-goals/{id}/
DELETE /api/reading-goals/{id}/
```

#### Notifications (5 endpoints)
```
GET    /api/notifications/
GET    /api/notifications/unread-count/
PUT    /api/notifications/{id}/mark-read/
PUT    /api/notifications/mark-all-read/
DELETE /api/notifications/{id}/
```

#### Book Lists (15 endpoints)
```
POST   /api/lists/
GET    /api/lists/
GET    /api/lists/{id}/
PUT    /api/lists/{id}/
PATCH  /api/lists/{id}/
DELETE /api/lists/{id}/
POST   /api/lists/{id}/books/
DELETE /api/lists/{list_id}/books/{book_id}/
PUT    /api/lists/{id}/reorder/
PATCH  /api/lists/{list_id}/books/{book_id}/
GET    /api/lists/popular/
GET    /api/lists/discover/
POST   /api/lists/{id}/copy/
GET    /api/books/{book_id}/lists/
POST   /api/lists/{id}/like/
DELETE /api/lists/{id}/like/
GET    /api/lists/{id}/likes/
POST   /api/lists/{id}/suggest-books/
```

#### Recommendation Feeds (8 endpoints)
```
POST   /api/recommendation-feeds/create/
GET    /api/recommendation-feeds/
GET    /api/recommendation-feeds/{id}/
PUT    /api/recommendation-feeds/{id}/
DELETE /api/recommendation-feeds/{id}/
POST   /api/recommendation-feeds/{id}/refresh/
GET    /api/recommendation-feeds/{id}/new/
POST   /api/recommendation-feeds/{id}/items/{item_id}/dismiss/
PUT    /api/recommendation-feeds/{id}/items/{item_id}/viewed/
```

#### General Recommendations (5 endpoints)
```
GET    /api/recommendations/
GET    /api/recommendations/trending/
GET    /api/recommendations/genre/{genre}/
GET    /api/recommendations/new-releases/
GET    /api/recommendations/similar/{book_id}/
```

#### LLM Features (4 endpoints)
```
POST   /api/llm/summarize-reviews/
POST   /api/llm/search-book/
POST   /api/llm/book-qa/
POST   /api/llm/personalized-recommendations/
```

**Total: 120+ API Endpoints**

### 6.5 New Features API Details

#### 6.5.1 Privacy Settings Endpoint

**PUT /api/users/{id}/privacy/**

Request:
```json
{
  "profile_visibility": "followers_only",  // public, followers_only, private
  "show_reading_activity": true,
  "allow_others_see_shelves": true,
  "allow_others_see_stats": false
}
```

Response:
```json
{
  "id": 123,
  "profile_visibility": "followers_only",
  "show_reading_activity": true,
  "allow_others_see_shelves": true,
  "allow_others_see_stats": false,
  "updated_at": "2026-02-09T10:30:00Z"
}
```

#### 6.5.2 Notification Preferences Endpoint

**PUT /api/users/{id}/notification-preferences/**

Request:
```json
{
  "email_new_follower": true,
  "email_review_comment": true,
  "email_comment_reply": true,
  "email_chat_mention": true,
  "email_comment_mention": true,
  "email_weekly_summary": false,
  "push_chat_message": true,
  "push_activity": true,
  "push_new_releases": false,
  "push_recommendation": true
}
```

#### 6.5.3 Chat Room Mute Endpoint

**PATCH /api/chat-rooms/{id}/mute/**

Request:
```json
{}
```

Response:
```json
{
  "chat_room_id": 456,
  "is_muted": true,
  "muted_at": "2026-02-09T10:30:00Z"
}
```

#### 6.5.4 Message Reaction Endpoint

**POST /api/messages/{message_id}/react/**

Request:
```json
{
  "reaction_type": "thumbs_up"  // thumbs_up, heart, laugh, surprised
}
```

Response:
```json
{
  "message_id": 789,
  "user_id": 123,
  "reaction_type": "thumbs_up",
  "created_at": "2026-02-09T10:30:00Z",
  "reaction_counts": {
    "thumbs_up": 5,
    "heart": 2,
    "laugh": 1,
    "surprised": 0
  }
}
```

**GET /api/messages/{message_id}/reactions/**

Response:
```json
{
  "message_id": 789,
  "reactions": [
    {
      "reaction_type": "thumbs_up",
      "count": 5,
      "users": [
        {"id": 123, "username": "john_doe"},
        {"id": 124, "username": "alice_reads"}
      ]
    }
  ],
  "user_reactions": ["thumbs_up"]
}
```

#### 6.5.5 Block User Endpoint

**POST /api/users/block/**

Request:
```json
{
  "user_id": 456,
  "reason": "Spam or harassment"
}
```

Response:
```json
{
  "id": 789,
  "blocker_id": 123,
  "blocked_id": 456,
  "created_at": "2026-02-09T10:30:00Z"
}
```

#### 6.5.6 Report Content Endpoint

**POST /api/reports/**

Request:
```json
{
  "reported_user_id": 456,  // optional, one of these must be provided
  "reported_review_id": null,
  "reported_comment_id": null,
  "reported_message_id": null,
  "report_type": "harassment",  // spam, harassment, inappropriate_content, etc.
  "description": "User is repeatedly posting offensive content"
}
```

Response:
```json
{
  "id": 789,
  "reporter_id": 123,
  "report_type": "harassment",
  "status": "pending",
  "created_at": "2026-02-09T10:30:00Z"
}
```

#### 6.5.7 Trending Books Endpoint

**GET /api/trending/books/**

Query params:
- `period`: daily, weekly, monthly (default: weekly)
- `limit`: number of results (default: 20)

Response:
```json
{
  "period": "weekly",
  "period_start": "2026-02-03",
  "period_end": "2026-02-09",
  "last_updated": "2026-02-09T10:00:00Z",
  "books": [
    {
      "rank": 1,
      "book": {
        "id": 123,
        "title": "Project Hail Mary",
        "authors": ["Andy Weir"],
        "cover_image_url": "https://...",
        "average_rating": 4.7
      },
      "add_count": 1234,
      "review_count": 892,
      "trend": "up"  // up, down, stable, new
    }
  ]
}
```

#### 6.5.8 Activity Feed with Filters

**GET /api/activity/**

Query params:
- `type`: all, comments, replies, mentions, likes, followers
- `unread_only`: true/false
- `limit`: number of results
- `offset`: pagination offset

Response:
```json
{
  "count": 150,
  "unread_count": 12,
  "next": "http://api/activity/?offset=20",
  "previous": null,
  "results": [
    {
      "id": 789,
      "activity_type": "comment_on_review",
      "actor": {
        "id": 456,
        "username": "alice_reads",
        "avatar_url": "https://..."
      },
      "target": {
        "type": "review",
        "id": 123,
        "book_title": "The Name of the Wind"
      },
      "message": "@alice_reads commented on your review",
      "is_read": false,
      "created_at": "2026-02-09T09:15:00Z"
    }
  ]
}
```

### 6.6 Rate Limiting

```
- Authentication endpoints: 5 req/min
- Search endpoints: 100 req/hour
- LLM endpoints: 20 req/hour
- General endpoints: 1000 req/hour
- WebSocket connections: 10 concurrent per user
```

---

## 7. Feature Specifications

### 7.1 Phase 1: MVP (Core Features)

#### 7.1.1 Authentication & User Management
- User registration with email verification
- Login/logout with JWT tokens
- Password reset via email
- User profile management (bio, avatar, location)
- Annual reading goal setting

#### 7.1.2 Book Discovery
- Search books via Google Books API
- View detailed book information
- Browse by genre, author, publication date
- See aggregated ratings and review counts

#### 7.1.3 Reading Shelves
- Three default shelves: Want to Read, Currently Reading, Read
- Add/remove books from shelves
- Move books between shelves
- Quick actions for shelf management

#### 7.1.4 Reading Progress Tracking
- Track current page and total pages
- Calculate reading percentage automatically
- Record start and finish dates
- View reading statistics:
  - Pages per day
  - Days spent reading
  - Estimated completion date
  - Total pages read

#### 7.1.5 Reviews & Ratings
- Write and edit reviews
- Rate books (1-5 stars)
- Mark reviews with spoiler warnings
- View all reviews for a book
- See average ratings and rating distributions
- Filter and sort reviews

#### 7.1.6 Basic Statistics
- Personal reading dashboard
- Books by shelf counts
- Reading streaks
- Genre preferences
- Favorite authors

### 7.2 Phase 2: Social Features

#### 7.2.1 Social Following
- Follow/unfollow users
- View followers list with search
- View following list with search
- See mutual followers
- Follow statistics on profile

#### 7.2.2 Activity Feed
- Personalized feed from followed users
- Global activity feed for discovery
- Activity types:
  - Added book to shelf
  - Started reading
  - Finished reading
  - Wrote review
  - Rated book
  - Followed user

#### 7.2.3 Review Interactions
- Like/unlike reviews
- Comment on reviews
- Nested comment threads (replies)
- View who liked a review
- Edit/delete own comments

#### 7.2.4 Notifications
- Real-time notification system
- Notification types:
  - New follower
  - Review liked
  - Comment on review
  - Reply to comment
  - Mention in chat
- Mark as read/unread
- Notification badge count
- Notification history

#### 7.2.5 User Discovery
- Search users by username
- Suggested users to follow based on:
  - Similar reading tastes
  - Mutual followers
  - Popular users

### 7.3 Phase 3: Community & Organization

#### 7.3.1 Real-time Chat Rooms
- One chat room per book
- WebSocket-based real-time messaging
- Features:
  - Threaded message replies
  - @mention users
  - Edit messages (with timestamp)
  - Delete messages (soft delete)
  - Join/leave rooms
  - See active members
  - Unread message counts
  - Message history pagination

#### 7.3.2 Book Lists/Collections
- Create unlimited custom lists
- Public and private lists
- Features:
  - Add books to multiple lists
  - Manual reordering (drag & drop)
  - Add notes to books in lists
  - List descriptions
  - Like public lists
  - Copy others' lists
  - Discover popular lists
  - Search lists by theme

#### 7.3.3 Advanced Organization
- Filter books by:
  - Genre
  - Author
  - Shelf status
  - Rating
  - Publication year
- Sort books by:
  - Title
  - Author
  - Date added
  - Rating
  - Pages
- Search within collection
- View all genres in library
- View all authors in library

#### 7.3.4 Reading Goals
- Set annual reading goals
- Track progress automatically
- View statistics:
  - Books read vs target
  - Progress percentage
  - On track indicator
  - Books behind/ahead
  - Projected completion
  - Days remaining

### 7.4 Phase 4: AI & Recommendations

#### 7.4.1 Basic Recommendations
- Personalized based on reading history
- Recommendations by genre
- Trending/popular books
- New releases
- Similar books
- Books by favorite authors

#### 7.4.2 AI List Suggestions
- Get AI suggestions for custom lists
- Analyze list themes automatically
- Receive match explanations
- Confidence scores for each suggestion
- Filter suggestions by preferences

#### 7.4.3 AI Recommendation Feeds
- Create custom feeds with natural language
  - Example: "Space opera with strong female leads"
- Auto-refreshing feeds (daily/weekly/monthly)
- Features:
  - Match scores and explanations
  - Key themes extracted
  - Dismiss unwanted suggestions
  - Track viewed vs new items
  - Multiple feeds per user

#### 7.4.4 LLM Features
- **Review Summarization:**
  - AI-generated summaries of all reviews
  - Key themes extraction
  - Sentiment analysis
  - Customizable summary length

- **Smart Book Search:**
  - Search by description
  - Example: "Book about detective in Victorian London"
  - Confidence scores
  - Match explanations

- **Book Q&A:**
  - Ask questions about books
  - Conversational interface
  - Spoiler warnings
  - Context from reviews and descriptions

- **Personalized AI Recommendations:**
  - Natural language preferences
  - Detailed explanations
  - Similar book suggestions
  - Theme-based matching

---

## 8. User Interface & Experience

### 8.1 Design Principles

- **Clean and Modern:** Minimalist interface focusing on content
- **Responsive:** Mobile-first design, works on all devices
- **Intuitive:** Clear navigation and user flows
- **Fast:** Optimized loading and interactions
- **Accessible:** WCAG 2.1 AA compliance where possible

### 8.2 Key Pages/Views

#### 8.2.1 Authentication
- Login page
- Registration page
- Password reset flow
- Email verification

#### 8.2.2 Main Navigation
- Home/Dashboard
- My Books
- Discover/Search
- Activity Feed
- Profile
- Notifications (with badge)

#### 8.2.3 Dashboard/Home
- Reading progress summary
- Currently reading books with progress bars
- Activity feed from followed users
- Reading goal progress
- Quick stats (books read this year, pages read)
- Personalized recommendations

#### 8.2.4 My Books
- Tabbed interface: Want to Read, Currently Reading, Read
- Filter and sort controls
- Grid/list view toggle
- Book cards with:
  - Cover image
  - Title and author
  - Progress bar (for currently reading)
  - Quick actions (update progress, move shelf, review)

#### 8.2.5 Book Detail Page
- Book information (cover, title, author, description)
- Add to shelf dropdown
- Reading progress (if on shelf)
- Average rating and distribution
- User's review (if exists) or "Write Review" button
- All reviews section
- "Add to List" button
- Chat room link
- Similar books recommendations

#### 8.2.6 Search/Discover
- Search bar with filters
- Results from Google Books API
- Quick add to shelf
- Trending books section
- New releases section
- Genre browse

#### 8.2.7 User Profile
- Profile header (avatar, username, bio, stats)
- Tabs: Books, Reviews, Lists, Activity
- Follow/Following lists
- Reading statistics
- Follow button (for other users)

#### 8.2.8 Activity Feed
- Tabs: Following, Global
- Activity cards with:
  - User avatar and name
  - Activity description
  - Book cover (if applicable)
  - Timestamp
  - Like/comment options

#### 8.2.9 Chat Room
- Book header with cover and title
- Message list (infinite scroll)
- Threaded replies (collapsible)
- Message input with @mention autocomplete
- Active members sidebar
- Unread indicator

#### 8.2.10 Lists
- My Lists page (grid of list cards)
- List detail page:
  - List info (name, description, public/private)
  - Ordered book list
  - Drag-to-reorder
  - Add books button
  - Edit/delete controls
- Discover Lists page

#### 8.2.11 AI Features
- Recommendation Feeds page
- Feed detail with match scores
- AI chat interface for book Q&A
- Review summary display

### 8.3 UI Components

**Reusable Components:**
- BookCard (grid/list variants)
- UserCard
- ReviewCard
- CommentThread
- ActivityItem
- NotificationItem
- ProgressBar
- RatingStars
- Modal/Dialog
- Dropdown
- SearchBar
- FilterPanel
- Tabs
- Badge
- Avatar
- Button (variants: primary, secondary, danger)
- Input/Textarea
- Form components

### 8.4 Color Scheme & Typography

**Colors (Tailwind):**
- Primary: Blue (for actions, links)
- Secondary: Gray (for text, backgrounds)
- Success: Green (for positive actions)
- Warning: Yellow (for warnings)
- Danger: Red (for destructive actions)
- Neutral: Various grays for backgrounds and borders

**Typography:**
- Headings: System font stack (san-serif)
- Body: System font stack
- Monospace: For code/technical content if needed

### 8.5 Responsive Breakpoints

```
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl, 2xl)
```

**Mobile Adaptations:**
- Hamburger menu for navigation
- Single column layouts
- Touch-friendly buttons and controls
- Bottom navigation bar (optional)
- Collapsible sections

---

## 9. Development Phases

### 9.1 Phase 1: MVP - Core Functionality (Weeks 1-6)

**Goal:** Build a functional book tracking application with essential features.

#### Week 1-2: Project Setup & Authentication
**Backend:**
- Django project setup
- MySQL database configuration
- User model and authentication
- JWT implementation
- Basic API structure

**Frontend:**
- Vite + React project setup
- Tailwind CSS configuration
- React Router setup
- Authentication pages (login, register)
- Protected route handling
- Context for user state

**Deliverable:** Users can register, login, and access protected pages.

#### Week 3-4: Books & Shelves
**Backend:**
- Book model
- UserBook model
- Google Books API integration
- Book search endpoints
- Shelf management endpoints
- Reading progress endpoints

**Frontend:**
- Book search page
- Book detail page
- My Books page with shelves
- Add to shelf functionality
- Progress tracking UI
- Book cards and lists

**Deliverable:** Users can search books, add to shelves, and track reading progress.

#### Week 5-6: Reviews & Ratings
**Backend:**
- Review model
- ReviewLike model
- Review CRUD endpoints
- Rating aggregation
- Book statistics endpoints

**Frontend:**
- Review form
- Review display
- Rating component
- Like functionality
- Review list on book page
- User's review history

**Deliverable:** Users can write reviews, rate books, and see others' reviews.

**Phase 1 Completion Criteria:**
- ✅ User authentication working
- ✅ Book search functional
- ✅ Can add books to shelves
- ✅ Progress tracking operational
- ✅ Can write and view reviews
- ✅ Basic stats displaying

---

### 9.2 Phase 2: Social Features (Weeks 7-10)

**Goal:** Add social networking capabilities.

#### Week 7-8: Following & Activity Feed
**Backend:**
- Follow model
- Activity model
- Follow endpoints
- Activity feed endpoints
- Notification model basics

**Frontend:**
- Follow/unfollow buttons
- Followers/following lists
- Activity feed page
- Activity item components
- User search

**Deliverable:** Users can follow others and see activity feeds.

#### Week 9-10: Comments & Notifications
**Backend:**
- Comment model
- Comment endpoints with threading
- Notification system
- Signal handlers for notifications
- Notification endpoints

**Frontend:**
- Comment components
- Nested comment threads
- Notification bell with badge
- Notification dropdown/page
- Real-time notification updates (polling initially)

**Deliverable:** Users can comment on reviews and receive notifications.

**Phase 2 Completion Criteria:**
- ✅ Following system working
- ✅ Activity feed populated
- ✅ Comments functional
- ✅ Notifications displaying
- ✅ User profiles complete

---

### 9.3 Phase 3: Community & Organization (Weeks 11-16)

**Goal:** Add real-time chat and advanced organization.

#### Week 11-13: Real-time Chat
**Backend:**
- Django Channels setup
- Redis configuration
- ChatRoom model
- ChatMessage model
- UserMention model
- ChatRoomMembership model
- WebSocket consumers
- Chat API endpoints

**Frontend:**
- WebSocket connection handling
- Chat room UI
- Message list with infinite scroll
- Threaded replies
- @mention autocomplete
- Message editing/deletion
- Real-time updates

**Deliverable:** Functional real-time chat rooms for books.

#### Week 14-15: Book Lists & Advanced Filters
**Backend:**
- BookList model
- BookListItem model
- BookListLike model
- List endpoints
- Advanced filtering for UserBooks
- Stats aggregation endpoints

**Frontend:**
- Create/edit lists UI
- List detail page
- Drag-and-drop reordering
- Filter panel for My Books
- Genre/author aggregation
- Advanced stats dashboard

**Deliverable:** Users can create custom lists and filter their books.

#### Week 16: Reading Goals & Polish
**Backend:**
- ReadingGoal model
- Goal tracking logic
- Progress calculations

**Frontend:**
- Reading goal setting
- Goal progress display
- Dashboard enhancements
- UI polish and bug fixes

**Deliverable:** Reading goals functional, UI polished.

**Phase 3 Completion Criteria:**
- ✅ Chat rooms working in real-time
- ✅ Custom lists functional
- ✅ Advanced filtering operational
- ✅ Reading goals tracking
- ✅ Major features complete

---

### 9.4 Phase 4: AI & Recommendations (Weeks 17-20)

**Goal:** Integrate AI features for enhanced recommendations.

#### Week 17-18: Basic Recommendations & AI Setup
**Backend:**
- LLM API integration (OpenAI/Anthropic)
- Basic recommendation algorithm
- Trending books logic
- Similar books logic
- RecommendationFeed model
- RecommendationFeedItem model

**Frontend:**
- Recommendations page
- Trending books section
- Similar books display
- Recommendation cards

**Deliverable:** Basic recommendations working.

#### Week 19-20: Advanced AI Features
**Backend:**
- Review summarization endpoint
- Smart book search endpoint
- Book Q&A endpoint
- AI list suggestions endpoint
- Recommendation feed endpoints
- Feed refresh logic

**Frontend:**
- AI recommendation feeds UI
- Feed creation wizard
- Review summary display
- Smart search interface
- Book Q&A chat interface
- AI suggestion integration in lists

**Deliverable:** All AI features functional.

**Phase 4 Completion Criteria:**
- ✅ Recommendations displaying
- ✅ AI feeds working
- ✅ Review summaries generated
- ✅ Smart search functional
- ✅ Book Q&A operational

---

### 9.5 Phase 5: Testing, Optimization & Deployment (Weeks 21-24)

**Goal:** Ensure quality, optimize performance, and deploy.

#### Week 21: Testing
- Unit tests for critical backend logic
- Integration tests for API endpoints
- Frontend component tests
- E2E testing for critical user flows
- Bug fixing

#### Week 22: Optimization
- Database query optimization
- API response caching
- Frontend bundle optimization
- Image optimization
- Performance profiling
- Load testing

#### Week 23: Documentation & Polish
- API documentation
- User guide/help section
- Code documentation
- README files
- Final UI polish
- Accessibility improvements

#### Week 24: Deployment
- Production environment setup
- Database migration to production
- Environment variables configuration
- Deploy backend to hosting service
- Deploy frontend to hosting service
- DNS configuration
- SSL certificates
- Monitoring setup
- Final testing in production

**Phase 5 Completion Criteria:**
- ✅ All critical paths tested
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Deployed and accessible
- ✅ Monitoring in place

---

### 9.6 Post-Launch (Ongoing)

**Maintenance & Enhancement:**
- Monitor error logs and performance
- Fix bugs as discovered
- Collect user feedback (if applicable)
- Consider additional features:
  - Book clubs with scheduling
  - Reading challenges
  - Social features expansion
  - Mobile app (React Native)
  - Import/export data
  - Third-party integrations

---

## 10. Technical Considerations

### 10.1 Security

**Authentication & Authorization:**
- JWT tokens with secure storage
- Token expiration and refresh mechanism
- Password hashing (Django default PBKDF2)
- CSRF protection
- Rate limiting on authentication endpoints

**Data Protection:**
- HTTPS only in production
- SQL injection prevention (Django ORM)
- XSS prevention (React escapes by default)
- CORS properly configured
- Environment variables for secrets
- Secure headers (Django middleware)

**WebSocket Security:**
- JWT authentication for WebSocket connections
- Message validation and sanitization
- Rate limiting on message sending

### 10.2 Performance

**Backend Optimization:**
- Database indexing on frequent queries
- Query optimization (select_related, prefetch_related)
- Caching with Redis:
  - Popular books
  - User sessions
  - API responses
- Pagination for large datasets
- Async tasks for expensive operations (Celery, optional)

**Frontend Optimization:**
- Code splitting (React.lazy)
- Image lazy loading
- React Query caching
- Debouncing search inputs
- Virtual scrolling for long lists
- Bundle size optimization

**Database:**
- Proper indexing (defined in schema)
- Denormalized counts where appropriate
- Connection pooling
- Query monitoring and optimization

### 10.3 Scalability

**Horizontal Scaling:**
- Stateless backend (JWT tokens)
- Redis for session/cache sharing
- Load balancer ready
- Database read replicas (future)

**Vertical Scaling:**
- Efficient queries
- Resource monitoring
- Optimization based on bottlenecks

### 10.4 Error Handling

**Backend:**
- Custom exception handlers
- Detailed error logging
- User-friendly error messages
- Error tracking (Sentry, optional)

**Frontend:**
- Error boundaries for React components
- Graceful degradation
- User-friendly error messages
- Retry mechanisms for failed requests

### 10.5 Testing Strategy

**Backend:**
- Unit tests (Django TestCase)
- API tests (DRF APITestCase)
- Integration tests
- Test database

**Frontend:**
- Component tests (React Testing Library)
- Integration tests
- E2E tests (Playwright/Cypress, optional)

**Coverage Goals:**
- Backend: >80% for critical paths
- Frontend: >70% for components

### 10.6 Monitoring & Logging

**Logging:**
- Application logs (Django logging)
- Error logs
- Access logs
- WebSocket connection logs

**Monitoring:**
- Server health
- Database performance
- API response times
- Error rates
- User activity metrics

**Tools (Optional):**
- Sentry for error tracking
- New Relic/DataDog for performance
- Google Analytics for user metrics

### 10.7 Development Workflow

**Version Control:**
- Git with feature branches
- Main branch protected
- Pull request reviews
- Semantic commit messages

**Development Process:**
1. Feature planning
2. Branch creation
3. Development
4. Local testing
5. Pull request
6. Code review
7. Merge to main
8. Deploy to staging (optional)
9. Deploy to production

**Code Quality:**
- ESLint + Prettier (frontend)
- Black + Flake8 (backend)
- Pre-commit hooks
- Code review checklist

---

## 11. Future Enhancements

### 11.1 Short-term (Post-MVP)

**Enhanced Social Features:**
- Direct messaging between users
- User blocking/reporting
- Privacy settings (private profiles)
- Post to social media integration

**Reading Features:**
- Reading challenges (e.g., "Read 52 books in 52 weeks")
- Book club features with scheduling
- Buddy reads
- Reading streaks and achievements

**Organization:**
- Tags for books
- Advanced search filters
- Saved searches
- Book comparisons

**Mobile:**
- Progressive Web App (PWA)
- Native mobile app (React Native)
- Offline reading progress tracking

### 11.2 Long-term

**Community Features:**
- Author pages and verification
- Publisher partnerships
- Book giveaways
- Reading events calendar

**Advanced AI:**
- Mood-based recommendations
- Reading style analysis
- Personalized reading speed insights
- Content warnings detection

**Monetization (if applicable):**
- Affiliate links to bookstores
- Premium features subscription
- Ad-free experience
- Advanced analytics

**Integrations:**
- Goodreads import/export
- Kindle integration
- Library catalog integration
- Calendar sync for book club events

**Analytics:**
- Advanced reading insights
- Comparative stats with other users
- Genre trends over time
- Predictive recommendations

### 11.3 Technical Improvements

**Infrastructure:**
- Microservices architecture (if scale requires)
- GraphQL API (in addition to REST)
- Server-side rendering (if SEO becomes priority)
- CDN for static assets
- Advanced caching strategies

**Performance:**
- Database sharding
- Read replicas
- Advanced query optimization
- Edge computing

**Features:**
- Real-time collaborative lists
- Voice input for progress updates
- Barcode scanning for book entry
- Audiobook integration

---

## 12. External API Integration

### 12.1 Overview

The application integrates with three primary external services to provide core functionality:

1. **Google Books API** - Book data and search
2. **Anthropic Claude API** - AI-powered features  
3. **Resend Email Service** - Transactional emails

**Estimated Monthly Cost:** ~$15 (AI only; others free tier)

### 12.2 Google Books API

**Purpose:** Book metadata, search, cover images

**Key Features:**
- Search books by title, author, ISBN
- Retrieve detailed book information
- Access book cover images
- Publication data and ratings

**Implementation:**
- Free tier: 1,000 requests/day
- Aggressive caching (1-24 hours)
- Database-first approach
- Fallback to local search if API fails

**Service Location:** `services/google_books_service.py`

### 12.3 Anthropic Claude API

**Purpose:** AI-powered recommendations and search

**Key Features:**
- Natural language book search
- Personalized recommendations
- AI recommendation feeds
- Review summarization

**Implementation:**
- Claude Sonnet 4 model
- ~$15/month estimated cost
- Caching for 24 hours
- Rate limiting: 10 searches/user/day

**Service Location:** `services/ai_service.py`

**Why Claude over OpenAI:**
- Superior reasoning for book recommendations
- 200K token context window
- Better at nuanced, subjective tasks
- Competitive pricing

### 12.4 Resend Email Service

**Purpose:** Transactional and notification emails

**Email Types:**
- Email verification
- Password reset
- Notification emails (comments, followers, mentions)
- Weekly reading summaries

**Implementation:**
- Free tier: 3,000 emails/month
- Template-based emails
- User preference integration
- Background job processing

**Service Location:** `services/email_service.py`

### 12.5 Security & Error Handling

**API Key Management:**
- All keys stored in environment variables
- Never committed to version control
- Separate keys for dev/staging/production

**Error Handling:**
- Graceful degradation with fallbacks
- Circuit breaker pattern for failed services
- Comprehensive logging
- User-friendly error messages

**Rate Limiting:**
- Per-service quotas tracked
- Per-user limits enforced
- Monitoring and alerts at 80% quota

**Complete Integration Guide:** See `external-api-integration.md`

---

## 13. Security & Authentication

### 13.1 Authentication System

**JWT-Based Authentication:**
- Access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry
- Token rotation on refresh
- Token blacklisting on logout

**Implementation:**
- `djangorestframework-simplejwt`
- Custom token serializer with user data
- Automatic refresh on 401 errors
- In-memory token storage (frontend)

### 13.2 Password Security

**Hashing:**
- Argon2 algorithm (most secure)
- Automatic Django password management
- Never store plaintext passwords

**Requirements:**
- Minimum 8 characters
- Uppercase + lowercase letters
- Numbers + special characters
- Not similar to username/email
- Not in common password list

### 13.3 Email Verification

**Flow:**
1. User registers (account inactive)
2. Verification token generated (24-hour expiry)
3. Email sent with verification link
4. User clicks link, account activated
5. Auto-login with JWT tokens

**Security:**
- Cryptographically secure tokens
- Time-limited (24 hours)
- Single-use tokens
- Stored in Redis cache

### 13.4 Password Reset

**Flow:**
1. User requests reset (no user enumeration)
2. Token generated if email exists (1-hour expiry)
3. Email sent with reset link
4. User sets new password
5. All sessions invalidated

**Security:**
- No indication if email exists
- Time-limited tokens (1 hour)
- Password validation enforced
- Token invalidated after use

### 13.5 Authorization & Permissions

**Permission Classes:**
- `IsOwner` - Only object owner
- `IsOwnerOrReadOnly` - Owner can edit, others read
- `IsPublicOrOwner` - Public items readable by all
- `CanViewProfile` - Respects privacy settings

**Privacy Controls:**
- Profile visibility (public/followers/private)
- Activity feed visibility toggle
- Shelf visibility toggle
- Statistics visibility toggle

### 13.6 API Security

**Protection Against:**
- SQL Injection (ORM + parameterized queries)
- XSS (auto-escaping + sanitization)
- CSRF (token validation)
- Rate limiting (per-endpoint throttling)
- File upload attacks (type/size validation)

**Security Headers:**
- HSTS (HTTPS enforcement)
- Content Security Policy
- X-Frame-Options (clickjacking)
- X-Content-Type-Options
- XSS Protection

### 13.7 WebSocket Security

**Authentication:**
- JWT token in connection query string
- Token validation on connect
- Room access verification
- User identity in all messages

**Message Security:**
- Input sanitization
- XSS prevention
- Rate limiting
- Message size limits

### 13.8 Production Checklist

**Pre-Launch Security:**
- [ ] HTTPS enabled with valid certificate
- [ ] Security headers configured
- [ ] Rate limiting active on all endpoints
- [ ] File upload validation in place
- [ ] Secrets not in version control
- [ ] Password policies enforced
- [ ] Email verification required
- [ ] Token rotation working
- [ ] Logging configured (no sensitive data)
- [ ] Dependencies scanned for vulnerabilities

**Complete Security Guide:** See `security-authentication-guide.md`

---

## 14. Frontend Architecture

### 14.1 Component Structure

**100+ React Components organized by feature:**

**Layout Components (5):**
- Layout, Navigation, BottomNavigation, Sidebar, Footer

**Dashboard Components (10):**
- CurrentlyReadingSection, RecommendedBooksCarousel, ActivityFeed, ReadingGoalWidget, QuickStatsWidget, TrendingBooksWidget, AIFeedsSection

**My Books Components (8):**
- ShelfTabs, ListTabs, BooksCarousel, ShelfBookCard, ListCard, ListsGrid

**Discover Components (12):**
- SearchBar, AISearchModal, AISearchResults, SearchResults, TrendingSection, GenreBrowser

**Book Detail Components (7):**
- BookHeader, BookActions, DescriptionSection, ReviewsSection, ReviewCard, SimilarBooksSection

**Chat Components (15):**
- ChatRoom, ChatRoomCard, MessagesPanel, ChatMessage, MessageInput, MembersSidebar, MessageReactions

**Profile Components (12):**
- ProfileHeader, ProfileTabs, BooksTab, ReviewsTab, StatsTab, ReadingGoalCard, GenreDistributionChart, AchievementsBadges

**Shared Components (40+):**
- BookCard, Button, Input, Modal, Carousel, Avatar, Badge, Tag, Toast, etc.

### 14.2 State Management

**Context Providers:**
- `AuthContext` - User authentication & token management
- `ThemeContext` - Light/dark theme
- `NotificationContext` - Real-time notifications

**TanStack Query (React Query):**
- Server state management
- Automatic caching & invalidation
- Optimistic updates
- Background refetching

**Custom Hooks:**
- `useAuth`, `useDebounce`, `useInfiniteScroll`
- `useWebSocket`, `useMediaQuery`, `useClickOutside`

### 14.3 Routing

**React Router Setup:**
- Protected routes (require authentication)
- Public routes (login, register)
- Nested layouts
- 404 handling

**Main Routes:**
- `/` - Dashboard
- `/books` - My Books
- `/discover` - Discover/Search
- `/books/:bookId` - Book Detail
- `/chat` - Community Hub
- `/chat/:roomId` - Chat Room
- `/profile/:userId` - User Profile
- `/settings` - Settings

### 14.4 Styling Architecture

**Tailwind CSS:**
- Utility-first CSS framework
- Custom design system configuration
- Responsive utilities
- Dark mode support

**CSS Variables:**
- Colors, spacing, typography
- Consistent design tokens
- Theme switching support

**Component Patterns:**
- Consistent prop interfaces
- PropTypes validation
- Accessibility considerations
- Responsive design patterns

**Complete Component Spec:** See `react-component-structure.md`

---

## 15. Implementation Readiness

### 15.1 What's Complete ✅

**Planning & Design:**
- [x] Complete database schema (24 models)
- [x] Comprehensive API design (120+ endpoints)
- [x] Full UI wireframes (6 views × 3 breakpoints)
- [x] Design system (colors, typography, spacing)
- [x] Component architecture (100+ components)
- [x] Development roadmap (4 phases, 24 weeks)

**Integration Specifications:**
- [x] Google Books API integration
- [x] Anthropic Claude AI integration
- [x] Resend email service integration
- [x] Image storage (AWS S3) configuration

**Security Implementation:**
- [x] JWT authentication system
- [x] Password security (Argon2 hashing)
- [x] Email verification flow
- [x] Password reset flow
- [x] Authorization & permissions
- [x] API security measures
- [x] WebSocket security

**Documentation:**
- [x] Main design document
- [x] ERD diagram
- [x] Wireframes document
- [x] Component structure guide
- [x] API integration guide
- [x] Security guide

### 15.2 Ready to Build 🚀

**Backend (Django):**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt
pip install django-cors-headers django-channels channels-redis
pip install argon2-cffi mysqlclient python-decouple
pip install anthropic resend pillow bleach

# Create project
django-admin startproject config .
python manage.py startapp users
python manage.py startapp books
# ... create other apps

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

**Frontend (React + Vite):**
```bash
# Create React app
npm create vite@latest frontend -- --template react

# Install dependencies
cd frontend
npm install react-router-dom @tanstack/react-query axios
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react

# Setup Tailwind
npx tailwindcss init -p

# Run development server
npm run dev
```

### 15.3 Development Workflow

**Phase 1 (Weeks 1-6): MVP Core Features**
1. Set up development environment
2. Create database models
3. Build authentication system
4. Implement book search & management
5. Create basic UI components
6. Deploy to staging

**Phase 2 (Weeks 7-12): Social & Real-time**
1. Implement reviews & ratings
2. Add social features (follow, activity)
3. Build chat system with WebSocket
4. Integrate external APIs
5. Add notifications

**Phase 3 (Weeks 13-18): AI & Enhanced Features**
1. Implement AI recommendations
2. Create AI search
3. Build custom lists
4. Add reading goals & stats
5. Polish UI/UX

**Phase 4 (Weeks 19-24): Polish & Launch**
1. Testing & bug fixes
2. Performance optimization
3. Security hardening
4. Documentation
5. Production deployment

### 15.4 Next Steps

**Immediate (Before Coding):**
1. Set up version control (Git/GitHub)
2. Create `.env.example` file
3. Set up project structure
4. Initialize Django & React projects

**First Week:**
1. Configure Django settings
2. Create database models
3. Set up authentication
4. Build basic API endpoints
5. Create React app skeleton

**First Month:**
1. Complete MVP features
2. Basic UI implementation
3. External API integration
4. Testing setup
5. Deploy to staging environment

### 15.5 Project Statistics

**Database:**
- 24 models
- 100+ fields
- 50+ relationships
- 20+ indexes

**API:**
- 120+ endpoints
- 8 main resource groups
- REST + WebSocket
- Full CRUD operations

**Frontend:**
- 100+ components
- 6 main views
- 3 responsive breakpoints
- 10+ custom hooks

**External Services:**
- 3 API integrations
- ~$15/month cost (estimated)
- Free tiers utilized
- Secure configuration

**Estimated Lines of Code:**
- Backend: ~15,000 lines
- Frontend: ~20,000 lines
- Tests: ~10,000 lines
- **Total: ~45,000 lines**

### 15.6 Success Metrics

**Technical:**
- API response time < 200ms (p95)
- Page load time < 2 seconds
- Test coverage > 80%
- Zero critical security vulnerabilities
- 99% uptime

**Functional:**
- All MVP features working
- Responsive on mobile/tablet/desktop
- WebSocket real-time updates
- AI features operational
- Email delivery reliable

**User Experience:**
- Intuitive navigation
- Fast interactions
- Clear error messages
- Accessible (WCAG 2.1 AA)
- Cross-browser compatible

---

## Appendix

### A. Glossary

**Terms:**
- **Shelf:** One of three reading statuses (Want to Read, Currently Reading, Read)
- **List:** Custom user-created book collection
- **Feed:** AI-generated recommendation stream
- **Chat Room:** Real-time discussion space for a book
- **Mention:** @username reference in chat
- **Activity:** User action displayed in feed
- **Review:** User's written evaluation and rating of a book
- **Progress:** Current reading position (page number or percentage)

### B. File Structure (Preliminary)

```
project-root/
├── backend/                    # Django project
│   ├── config/                # Project settings
│   ├── apps/
│   │   ├── users/            # User app
│   │   ├── books/            # Books app
│   │   ├── reviews/          # Reviews app
│   │   ├── social/           # Follow, Activity
│   │   ├── chat/             # Chat rooms
│   │   ├── lists/            # Book lists
│   │   ├── recommendations/  # AI recommendations
│   │   └── notifications/    # Notifications
│   ├── utils/                # Shared utilities
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/                  # React project
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── docs/                     # Documentation
│   ├── api/                 # API documentation
│   ├── user-guide/          # User documentation
│   └── design/              # Design docs
│
└── README.md
```

### C. External Resources

**APIs:**
- Google Books API: https://developers.google.com/books
- OpenAI API: https://platform.openai.com/docs
- Anthropic Claude API: https://docs.anthropic.com

**Documentation:**
- Django: https://docs.djangoproject.com
- Django REST Framework: https://www.django-rest-framework.org
- Django Channels: https://channels.readthedocs.io
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- TanStack Query: https://tanstack.com/query

**Learning Resources:**
- Full-Stack Development best practices
- WebSocket implementation guides
- LLM integration tutorials
- Database optimization techniques

### D. Version History

- **v1.0 (2026-02-08):** Initial comprehensive design document
- **v2.0 (2026-02-09):** Complete update with:
  - Updated database schema (17 → 24 models)
  - Enhanced API documentation (100 → 120+ endpoints)
  - External API integration specifications
  - Complete security & authentication guide
  - Frontend component architecture (100+ components)
  - UI wireframes for all views and breakpoints
  - Implementation readiness sections
  - Companion documentation created

---

**End of Design Document**

This document serves as the complete blueprint for the Book Review & Reading Tracker application. All companion documents provide detailed implementation guides for specific areas.

**Ready for Implementation:** All planning, design, and architectural decisions are complete. The project is ready to begin development.
