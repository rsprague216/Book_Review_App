# Database Schema & API Updates Summary

## Overview
This document summarizes all new features discovered in the wireframes and how they're now supported in the database schema and API.

---

## Database Schema Changes

### Modified Models

#### 1. Review Model
**Added Fields:**
- `review_title` (CharField, max_length=100, nullable) - Optional title for reviews

**Wireframe Feature:** Write Review modal shows "Review Title: (optional)"

---

#### 2. UserProfile Model
**Added Fields:**
- `profile_visibility` (CharField, choices, default='public') - Public, Followers Only, Private
- `show_reading_activity` (BooleanField, default=True) - Show activity in feeds
- `allow_others_see_shelves` (BooleanField, default=True) - Allow viewing shelves
- `allow_others_see_stats` (BooleanField, default=True) - Allow viewing statistics
- `username_changes_count` (IntegerField, default=0) - Track username changes
- `last_username_change_at` (DateTimeField, nullable) - Last change timestamp

**Wireframe Features:** 
- Profile Settings tab with privacy controls
- "Can only change username once" requirement

---

#### 3. ChatRoom Model
**Added Fields:**
- `last_activity_at` (DateTimeField, auto_now=True) - Last message timestamp
- `messages_today` (IntegerField, default=0) - Count of messages today
- `last_message_reset_date` (DateField, auto_now=True) - Reset counter daily

**Wireframe Features:**
- Chat room cards show "Last active: 2min ago"
- Activity indicators on chat rooms

---

#### 4. ChatRoomMembership Model
**Added Fields:**
- `is_muted` (BooleanField, default=False) - Mute notifications for this room
- `muted_at` (DateTimeField, nullable) - When muted

**Wireframe Feature:** [Mute] button on chat room cards and in chat room header

---

#### 5. Activity Model
**Added Fields:**
- `comment` (FK → Comment, nullable) - Link to comment for comment-related activities
- `is_read` (BooleanField, default=False) - Track if user has viewed this activity
- `read_at` (DateTimeField, nullable) - When marked as read

**Enhanced activity_type choices:**
- Added: 'comment_on_review', 'reply_to_comment', 'liked_review', 'mentioned_in_chat', 'mentioned_in_comment'

**Wireframe Features:**
- My Activity tab with unread filtering
- Activity item cards with read/unread states

---

### New Models

#### 6. NotificationPreferences
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
- created_at, updated_at
```

**Wireframe Feature:** Settings tab > Notification Settings section

**Purpose:** Allow users to control what notifications they receive via email and push

---

#### 7. MessageReaction
```python
- id (PK)
- message (FK → ChatMessage)
- user (FK → User)
- reaction_type (CharField) - 'thumbs_up', 'heart', 'laugh', 'surprised'
- created_at (DateTimeField)
Unique: (message, user, reaction_type)
```

**Wireframe Feature:** Chat messages show reaction emojis (👍 ❤️ 😂 😮) with counts

**Purpose:** Allow users to react to messages with emoji reactions

---

#### 8. CommentMention
```python
- id (PK)
- comment (FK → Comment)
- mentioned_user (FK → User)
- created_at (DateTimeField)
- is_read (BooleanField, default=False)
- read_at (DateTimeField, nullable)
Unique: (comment, mentioned_user)
```

**Wireframe Feature:** @mentions work in review comments, not just chat

**Purpose:** Notify users when mentioned in comments

---

#### 9. UserBlock
```python
- id (PK)
- blocker (FK → User, related_name='blocking')
- blocked (FK → User, related_name='blocked_by')
- reason (TextField, nullable)
- created_at (DateTimeField)
Unique: (blocker, blocked)
Check: blocker ≠ blocked
```

**Wireframe Feature:** Other user profile menu shows [Block] option

**Purpose:** Allow users to block other users from interacting with them

---

#### 10. UserReport
```python
- id (PK)
- reporter (FK → User)
- reported_user (FK → User, nullable)
- reported_review (FK → Review, nullable)
- reported_comment (FK → Comment, nullable)
- reported_message (FK → ChatMessage, nullable)
- report_type (CharField) - spam, harassment, inappropriate_content, etc.
- description (TextField)
- status (CharField) - pending, reviewing, resolved, dismissed
- reviewed_by (FK → User, nullable)
- reviewed_at, resolution_notes
- created_at (DateTimeField)
```

**Wireframe Feature:** Other user profile menu shows [Report] option

**Purpose:** Allow users to report inappropriate content or behavior

---

#### 11. TrendingBook
```python
- id (PK)
- book (FK → Book)
- time_period (CharField) - daily, weekly, monthly
- add_count (IntegerField)
- review_count (IntegerField)
- average_rating (FloatField)
- rank (IntegerField)
- period_start, period_end (DateField)
- last_updated (DateTimeField)
Unique: (book, time_period, period_start)
```

**Wireframe Features:**
- Discover page "🔥 Trending This Week" section
- Dashboard sidebar "🔥 Trending This Week" widget

**Purpose:** Cache and track trending books to avoid expensive aggregation queries

---

## API Endpoint Changes

### New Endpoint Groups

#### 1. Message Reactions (3 endpoints)
```
POST   /api/messages/{message_id}/react/
DELETE /api/messages/{message_id}/react/{reaction_type}/
GET    /api/messages/{message_id}/reactions/
```

**Supports:** Chat message emoji reactions

---

#### 2. Enhanced Activity (6 endpoints)
```
GET    /api/activity/
GET    /api/activity/user/{user_id}/
GET    /api/activity/unread-count/
PUT    /api/activity/{id}/mark-read/
PUT    /api/activity/mark-all-read/
GET    /api/activity/filter/
```

**Supports:** My Activity tab with filtering and read tracking

---

#### 3. User Preferences (5 endpoints)
```
GET    /api/users/{id}/privacy/
PUT    /api/users/{id}/privacy/
GET    /api/users/{id}/notification-preferences/
PUT    /api/users/{id}/notification-preferences/
PATCH  /api/users/{id}/notification-preferences/
```

**Supports:** Profile Settings tab (privacy and notifications)

---

#### 4. User Blocking & Reporting (7 endpoints)
```
POST   /api/users/block/
DELETE /api/users/unblock/{user_id}/
GET    /api/users/blocked/
POST   /api/reports/
GET    /api/reports/
GET    /api/reports/{id}/
PUT    /api/reports/{id}/resolve/
```

**Supports:** Block and report functionality from user profiles

---

#### 5. Trending (3 endpoints)
```
GET    /api/trending/books/
GET    /api/trending/books/weekly/
GET    /api/trending/books/monthly/
```

**Supports:** Trending sections on Discover and Dashboard

---

### Enhanced Endpoint Groups

#### 6. Chat Rooms (Enhanced from 9 to 12 endpoints)
**Added:**
```
GET    /api/chat-rooms/
PATCH  /api/chat-rooms/{id}/mute/
PATCH  /api/chat-rooms/{id}/unmute/
GET    /api/chat-rooms/{id}/stats/
```

**Supports:** 
- List all user's chat rooms
- Mute/unmute functionality
- Activity statistics (last active, messages today)

---

## Updated Database Indexes

**New/Updated Indexes:**
- UserProfile: `(profile_visibility, created_at)`
- Activity: `(user, is_read, created_at DESC)`
- ChatRoom: `(last_activity_at DESC)`, `(book)`
- ChatRoomMembership: `(user, is_muted)`
- MessageReaction: `(message, user, reaction_type)` (unique), `(message, reaction_type)`
- UserBlock: `(blocker, blocked)` (unique), `blocker`, `blocked`
- UserReport: `(status, created_at)`, `(reporter, created_at DESC)`
- CommentMention: `(comment, mentioned_user)` (unique), `(mentioned_user, is_read)`
- TrendingBook: `(time_period, rank)`, `(book, time_period, period_start)` (unique)

---

## Updated Relationships

**New relationships added:**
- User 1:1 NotificationPreferences
- User 1:N MessageReaction
- User 1:N CommentMention
- User N:N UserBlock (self-referential)
- User 1:N UserReport (as reporter and as reported_user)
- ChatMessage 1:N MessageReaction
- Comment 1:N CommentMention
- Book 1:N TrendingBook
- Review/Comment/ChatMessage 1:N UserReport

---

## Total Statistics

**Database Models:**
- **Before:** 17 models
- **After:** 24 models
- **Added:** 7 new models

**API Endpoints:**
- **Before:** ~100 endpoints
- **After:** ~120 endpoints
- **Added:** ~20 new endpoints

---

## Implementation Priority

### Phase 1 (Core Functionality)
1. ✅ Review titles (simple field addition)
2. ✅ Activity read tracking (enables My Activity filtering)
3. ✅ Chat room muting (improves chat UX)

### Phase 2 (Enhanced Features)
4. Message reactions (chat engagement)
5. Comment mentions (social engagement)
6. Trending books (discovery feature)

### Phase 3 (Privacy & Safety)
7. Privacy settings (user control)
8. Notification preferences (user experience)
9. User blocking (safety)
10. Content reporting (moderation)

---

## Migration Notes

### Data Migration Required
1. **UserProfile**: Add new privacy fields with defaults
2. **Review**: Add nullable review_title field
3. **ChatRoom**: Add activity tracking fields
4. **ChatRoomMembership**: Add muting fields
5. **Activity**: Add is_read field (default False for existing)

### New Tables
1. NotificationPreferences (auto-create for existing users with defaults)
2. MessageReaction (starts empty)
3. CommentMention (starts empty)
4. UserBlock (starts empty)
5. UserReport (starts empty)
6. TrendingBook (populated via background job)

### Background Jobs Needed
1. **Daily**: Reset ChatRoom.messages_today counter
2. **Hourly**: Update TrendingBook rankings
3. **Weekly**: Send email summaries (based on preferences)

---

## Testing Checklist

### Schema Tests
- [ ] All new models can be created
- [ ] Constraints work correctly (unique, check)
- [ ] Relationships are properly defined
- [ ] Indexes improve query performance
- [ ] Migrations run without errors

### API Tests
- [ ] Privacy settings endpoints work
- [ ] Notification preferences save correctly
- [ ] Mute/unmute chat rooms functions
- [ ] Message reactions add/remove properly
- [ ] Block user prevents interactions
- [ ] Report submission creates records
- [ ] Trending books return correct data
- [ ] Activity filtering works as expected

### Integration Tests
- [ ] Blocked users can't see content
- [ ] Muted rooms don't send notifications
- [ ] Privacy settings hide content appropriately
- [ ] Username change limit enforced
- [ ] Comment mentions create activity
- [ ] Trending calculations are accurate

---

## Documentation Updates Required

1. ✅ Database ERD updated with new models
2. ✅ API documentation includes new endpoints
3. ✅ Model descriptions added
4. [ ] Frontend API client needs new methods
5. [ ] User documentation for new features
6. [ ] Admin panel for managing reports

---

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Status:** Schema & API Updated, Ready for Implementation
