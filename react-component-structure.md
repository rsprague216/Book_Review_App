# Book Review App - React Component Structure

**Version:** 1.0  
**Date:** February 9, 2026  
**Framework:** React 18+ with Vite  
**Status:** Complete Component Architecture

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [Core Components](#core-components)
4. [Feature Components](#feature-components)
5. [Shared/Common Components](#shared-components)
6. [State Management](#state-management)
7. [Routing Structure](#routing)
8. [Hooks & Utilities](#hooks)
9. [Styling Architecture](#styling)
10. [Component Specifications](#specifications)

---

<a name="project-structure"></a>
## 1. Project Structure

```
book-review-app/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   ├── common/           # Shared/reusable components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── books/            # My Books components
│   │   ├── discover/         # Discover/Search components
│   │   ├── book-detail/      # Book detail page components
│   │   ├── chat/             # Chat/Community components
│   │   ├── profile/          # Profile components
│   │   └── modals/           # Modal components
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── MyBooks.jsx
│   │   ├── Discover.jsx
│   │   ├── BookDetail.jsx
│   │   ├── Chat.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBooks.js
│   │   ├── useChat.js
│   │   ├── useNotifications.js
│   │   ├── useInfiniteScroll.js
│   │   └── useDebounce.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   │
│   ├── services/
│   │   ├── api.js            # Axios instance & config
│   │   ├── auth.js           # Auth API calls
│   │   ├── books.js          # Books API calls
│   │   ├── chat.js           # Chat API calls
│   │   ├── websocket.js      # WebSocket service
│   │   └── storage.js        # LocalStorage utilities
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── styles/
│   │   ├── globals.css       # Global styles
│   │   ├── variables.css     # CSS variables
│   │   └── animations.css    # Animation keyframes
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

<a name="component-hierarchy"></a>
## 2. Component Hierarchy

### Visual Component Tree

```
App
├── AuthProvider
│   ├── ThemeProvider
│   │   ├── NotificationProvider
│   │   │   ├── Router
│   │   │   │   ├── Layout
│   │   │   │   │   ├── Navigation (Desktop/Mobile)
│   │   │   │   │   ├── Page Content
│   │   │   │   │   │   ├── Dashboard
│   │   │   │   │   │   ├── MyBooks
│   │   │   │   │   │   ├── Discover
│   │   │   │   │   │   ├── BookDetail
│   │   │   │   │   │   ├── Chat
│   │   │   │   │   │   └── Profile
│   │   │   │   │   └── Footer
│   │   │   │   └── Modals (Portal)
```

---

<a name="core-components"></a>
## 3. Core Components

### 3.1 Layout Components

#### **Layout.jsx**
```jsx
/**
 * Main layout wrapper
 * Provides navigation, footer, and content area
 */
src/components/layout/Layout.jsx

Props: { children }
Responsibilities:
  - Render navigation (desktop/mobile)
  - Render page content
  - Render footer
  - Handle responsive layout switching
```

#### **Navigation.jsx**
```jsx
/**
 * Top navigation bar (desktop/tablet)
 */
src/components/layout/Navigation.jsx

Props: { user, onLogout }
State:
  - isMenuOpen (mobile hamburger)
  - unreadCount (notifications)
Responsibilities:
  - Logo and brand
  - Nav links (Dashboard, Books, Discover, Chat, Profile)
  - Notification bell with badge
  - User avatar with dropdown
  - Responsive hamburger menu
```

#### **BottomNavigation.jsx**
```jsx
/**
 * Bottom navigation (mobile only)
 */
src/components/layout/BottomNavigation.jsx

Props: { currentPath }
Responsibilities:
  - 5 icon buttons (Home, Books, Discover, Chat, Profile)
  - Active state highlighting
  - Badge on chat for unread messages
  - Fixed position at bottom
```

#### **Sidebar.jsx**
```jsx
/**
 * Sidebar for dashboard and other pages
 */
src/components/layout/Sidebar.jsx

Props: { children, position: 'left' | 'right' }
Responsibilities:
  - Collapsible on tablet/mobile
  - Sticky positioning on desktop
  - Drawer animation on mobile
```

#### **Footer.jsx**
```jsx
/**
 * Site footer
 */
src/components/layout/Footer.jsx

Props: None
Responsibilities:
  - Footer links (About, Support, Legal, Social)
  - Copyright notice
  - Responsive column layout
```

---

<a name="feature-components"></a>
## 4. Feature Components

### 4.1 Dashboard Components

#### **Dashboard.jsx** (Page)
```jsx
src/pages/Dashboard.jsx

Components:
  - CurrentlyReadingSection
  - RecommendedBooksCarousel
  - ActivityFeed
  - ReadingGoalWidget (sidebar)
  - QuickStatsWidget (sidebar)
  - TrendingBooksWidget (sidebar)
  - AIFeedsSection
```

#### **CurrentlyReadingSection.jsx**
```jsx
src/components/dashboard/CurrentlyReadingSection.jsx

Props: { books, limit: 2 }
State:
  - currentPage
Children:
  - CurrentlyReadingCard (2 desktop, 1 mobile)
  - Pagination controls
Responsibilities:
  - Display currently reading books
  - Carousel navigation
  - "See more" link
```

#### **CurrentlyReadingCard.jsx**
```jsx
src/components/dashboard/CurrentlyReadingCard.jsx

Props: { book, userBook, onUpdate }
State:
  - showProgressModal
Features:
  - Book cover image
  - Title, author
  - Progress bar with percentage
  - Pages read / total
  - Reading pace calculation
  - [Update Progress] button
  - Menu (Mark finished, Remove, etc.)
```

#### **RecommendedBooksCarousel.jsx**
```jsx
src/components/dashboard/RecommendedBooksCarousel.jsx

Props: { books, limit: 5 }
State:
  - currentIndex
Children:
  - BookCard (5 desktop, 3 tablet, 1 mobile)
  - Carousel controls (arrows, dots)
Features:
  - Swipeable on touch devices
  - Match score display
  - "Based on your reading history" subtitle
```

#### **ActivityFeed.jsx**
```jsx
src/components/dashboard/ActivityFeed.jsx

Props: { userId, filter: 'following' | 'global' }
State:
  - activities
  - loading
  - hasMore
Children:
  - ActivityItem (3-4 items)
  - InfiniteScroll trigger
Features:
  - Filter dropdown
  - Load more on scroll
  - Real-time updates (optional)
```

#### **ActivityItem.jsx**
```jsx
src/components/dashboard/ActivityItem.jsx

Props: { activity }
Variants:
  - FinishedBook
  - WroteReview
  - StartedReading
  - FollowedUser
  - JoinedChat
Features:
  - User avatar
  - Activity text
  - Book thumbnail (if applicable)
  - Timestamp
  - Engagement buttons (Like, Comment)
```

#### **ReadingGoalWidget.jsx**
```jsx
src/components/dashboard/ReadingGoalWidget.jsx

Props: { goal, currentYear }
State:
  - showEditModal
Features:
  - Progress bar with gradient
  - X / Y books (percentage)
  - Status message ("On track!", "2 books ahead")
  - Edit icon → opens modal
```

#### **QuickStatsWidget.jsx**
```jsx
src/components/dashboard/QuickStatsWidget.jsx

Props: { stats }
Features:
  - 4 stats stacked (Books, Pages, Streak, Avg Rating)
  - Each stat clickable (navigates to profile stats)
  - Icons for each stat type
```

#### **TrendingBooksWidget.jsx**
```jsx
src/components/dashboard/TrendingBooksWidget.jsx

Props: { books, limit: 4 }
Features:
  - Compact book list
  - Rank badges (#1, #2, etc.)
  - Add count ("+ 1,234 this week")
  - [View All →] link
```

#### **AIFeedCard.jsx**
```jsx
src/components/dashboard/AIFeedCard.jsx

Props: { feed }
Features:
  - Feed name
  - Top book preview (cover + title)
  - Match score
  - New recommendations badge
  - Last updated timestamp
  - [View Feed] button
  - Menu (Edit, Delete)
```

---

### 4.2 My Books Components

#### **MyBooks.jsx** (Page)
```jsx
src/pages/MyBooks.jsx

State:
  - activeShelf ('want_to_read' | 'currently_reading' | 'read')
  - activeList (list ID or null)
  - searchQuery
  - filters
  - sortBy
Children:
  - ShelfTabs
  - ListTabs
  - SearchAndFilters
  - BooksCarousel
  - ListsGrid
```

#### **ShelfTabs.jsx**
```jsx
src/components/books/ShelfTabs.jsx

Props: { activeShelf, onShelfChange, counts }
Features:
  - 3 tabs with counts
  - Active tab highlighting
  - Responsive (dropdown on mobile)
```

#### **ListTabs.jsx**
```jsx
src/components/books/ListTabs.jsx

Props: { lists, activeList, onListChange }
Features:
  - Scrollable tab row
  - "All Lists" tab
  - User's lists
  - [+ New List] button
```

#### **BooksCarousel.jsx**
```jsx
src/components/books/BooksCarousel.jsx

Props: { books, shelf, onUpdate }
State:
  - currentPage
  - viewMode ('grid' | 'list')
Children:
  - ShelfBookCard (4-5 desktop, 2-3 tablet, 1 mobile)
  - Pagination
Features:
  - Carousel navigation
  - Grid/List view toggle
  - Search and filters
  - Sort dropdown
```

#### **ShelfBookCard.jsx**
```jsx
src/components/books/ShelfBookCard.jsx

Props: { book, userBook, shelf, onUpdate }
Variants:
  - WantToReadCard (basic info only)
  - CurrentlyReadingCard (with progress)
  - ReadCard (with rating, finish date)
Features:
  - Book cover
  - Title, author
  - Progress bar (currently reading)
  - Rating (read shelf)
  - Quick actions menu
  - Shelf badge
```

#### **ListCard.jsx**
```jsx
src/components/books/ListCard.jsx

Props: { list, onView, onEdit, onDelete }
Features:
  - List name
  - Description (truncated)
  - First 3 book covers preview
  - "+X more" indicator
  - Book count
  - Visibility badge (Public/Private)
  - Last updated
  - Like count (if public)
  - Actions (View, Edit, Delete, Share)
```

#### **ListsGrid.jsx**
```jsx
src/components/books/ListsGrid.jsx

Props: { lists }
Features:
  - Responsive grid (4 desktop, 2 tablet, 1 mobile carousel)
  - Sort dropdown
  - Filter (All, Public, Private)
  - [+ Create List] prominent button
```

---

### 4.3 Discover/Search Components

#### **Discover.jsx** (Page)
```jsx
src/pages/Discover.jsx

State:
  - searchQuery
  - searchMode ('regular' | 'ai')
  - searchResults
  - filters
Children:
  - SearchBar
  - SearchModeToggle
  - TrendingSection
  - NewReleasesSection
  - RecommendedSection
  - GenreBrowser
```

#### **SearchBar.jsx**
```jsx
src/components/discover/SearchBar.jsx

Props: { 
  onSearch, 
  onModeChange, 
  mode: 'regular' | 'ai',
  placeholder 
}
State:
  - query
  - isFocused
Features:
  - Search input
  - Search icon
  - Clear button
  - Mode toggle (Regular / AI)
  - Autocomplete dropdown (optional)
  - Keyboard shortcuts (/ or Ctrl+K)
```

#### **AISearchModal.jsx**
```jsx
src/components/discover/AISearchModal.jsx

Props: { isOpen, onClose, onSearch }
State:
  - description
  - genre
  - era
  - readWhen
Features:
  - Large textarea (500 char max)
  - Character counter
  - Optional filters (Genre, Era, I read it)
  - Tips section (collapsible)
  - Example chips (clickable)
  - [Clear] and [Search with AI] buttons
  - Fullscreen on mobile
```

#### **AISearchResults.jsx**
```jsx
src/components/discover/AISearchResults.jsx

Props: { results, query }
Children:
  - AIResultCard (sorted by confidence)
  - NotFoundHelp section
Features:
  - Query recap display
  - Confidence badges (Best, Strong, Possible)
  - [Refine Search] button
  - [Switch to Regular Search] option
```

#### **AIResultCard.jsx**
```jsx
src/components/discover/AIResultCard.jsx

Props: { book, matchScore, matchReasons }
Features:
  - Confidence badge (95%, 78%, etc.)
  - Book cover
  - Title, author, rating
  - Genre, pages, year
  - "Why this matches" section with checkmarks
  - [+ Add to Shelf] dropdown
  - [View Details] button
  - Border color matches confidence level
```

#### **SearchResults.jsx**
```jsx
src/components/discover/SearchResults.jsx

Props: { results, query, onLoadMore }
State:
  - sortBy
  - genreFilter
  - ratingFilter
Children:
  - SearchResultCard (compact)
  - Pagination
Features:
  - Result count display
  - Sort/Filter bar
  - Compact horizontal cards
  - Load more / Pagination
```

#### **SearchResultCard.jsx**
```jsx
src/components/discover/SearchResultCard.jsx

Props: { book }
Features:
  - Small cover (80×120px)
  - Title, author (inline)
  - Rating stars + count
  - Genre • Pages
  - [+ Shelf] dropdown
  - [Info] icon → quick preview
  - Horizontal compact layout
```

#### **TrendingSection.jsx**
```jsx
src/components/discover/TrendingSection.jsx

Props: { books, limit: 5 }
Features:
  - Section header with "See All →"
  - Rank badges (#1 with flame icon)
  - Trend indicators (↑ up, → stable)
  - Add count display
  - Horizontal carousel
```

#### **GenreBrowser.jsx**
```jsx
src/components/discover/GenreBrowser.jsx

Props: { genres }
Features:
  - Grid layout (4 desktop, 3 tablet, 2 mobile)
  - Genre cards with icons
  - Book count per genre
  - [View All Genres →] link
  - Hover effects
```

#### **GenreCard.jsx**
```jsx
src/components/discover/GenreCard.jsx

Props: { genre, count, icon }
Features:
  - Large icon (64px)
  - Genre name
  - Book count
  - Hover lift effect
  - Link to genre page
```

---

### 4.4 Book Detail Components

#### **BookDetail.jsx** (Page)
```jsx
src/pages/BookDetail.jsx

Props: { bookId }
State:
  - book
  - userBook
  - reviews
  - similarBooks
Children:
  - BookHeader
  - BookActions
  - DescriptionSection
  - ReviewsSection
  - SimilarBooksSection
```

#### **BookHeader.jsx**
```jsx
src/components/book-detail/BookHeader.jsx

Props: { book, userBook }
Layout:
  Desktop: 2-column (cover left, info right)
  Mobile: Stacked
Features:
  - Large cover image (250×375 desktop, 200×300 mobile)
  - Title + series info
  - Author(s)
  - Star rating + count
  - Rating distribution bars
  - Genre tags
  - Page count, publish date
  - Publisher, language
```

#### **BookActions.jsx**
```jsx
src/components/book-detail/BookActions.jsx

Props: { book, userBook, onUpdate }
Features:
  - [Add to Shelf ▼] dropdown
  - [Add to List ▼] dropdown
  - [Share] button
  - Menu (...)
  
  If on shelf:
  - Status badge + dropdown
  - Progress bar (if reading)
  - [Update Progress] button
  - Your rating display + edit
  - [Write Review] button
  - [Join Chat Room] button with online count
```

#### **DescriptionSection.jsx**
```jsx
src/components/book-detail/DescriptionSection.jsx

Props: { description }
State:
  - isExpanded
Features:
  - Truncated at 3-4 paragraphs
  - [Read More ↓] / [Read Less ↑] toggle
  - Smooth expand/collapse animation
```

#### **ReviewsSection.jsx**
```jsx
src/components/book-detail/ReviewsSection.jsx

Props: { bookId, reviews, totalCount }
State:
  - sortBy
  - ratingFilter
Children:
  - ReviewCard (5 desktop, 3 tablet, 2 mobile)
  - [View All Reviews →] button
Features:
  - Section header with count
  - Sort dropdown
  - Filter by rating
  - Pagination / Load more
```

#### **ReviewCard.jsx**
```jsx
src/components/book-detail/ReviewCard.jsx

Props: { review, onLike, onComment }
State:
  - isExpanded
  - showComments
Features:
  - User avatar + username
  - Rating stars + date
  - Review title (if exists)
  - Review text (truncated)
  - [Read More] toggle
  - Spoiler warning (if applicable)
  - Like count + button
  - Comment count + button
  - [Share] menu
  - Edit/Delete (if own review)
```

#### **SimilarBooksSection.jsx**
```jsx
src/components/book-detail/SimilarBooksSection.jsx

Props: { books, limit: 5 }
Features:
  - Section header
  - Horizontal carousel
  - BookCard components
  - [See All →] link
```

---

### 4.5 Chat/Community Components

#### **Chat.jsx** (Page)
```jsx
src/pages/Chat.jsx

State:
  - activeTab ('activity' | 'chats')
  - searchQuery
  - searchScope
Children:
  - GlobalSearchBar
  - TabNavigation
  - MyActivityTab
  - MyChatsTab
```

#### **GlobalSearchBar.jsx**
```jsx
src/components/chat/GlobalSearchBar.jsx

Props: { onSearch, onScopeChange }
State:
  - query
  - scope ('my_chats' | 'my_books' | 'all_books')
Features:
  - Search input
  - Scope selector dropdown
  - Keyboard shortcut (/)
  - Search results overlay
  - Always visible above tabs
```

#### **MyActivityTab.jsx**
```jsx
src/components/chat/MyActivityTab.jsx

Props: { userId }
State:
  - activities
  - filter
  - unreadOnly
Children:
  - ActivityFilterBar
  - ActivityList
Features:
  - Filter dropdown (All, Comments, Replies, Mentions, Likes, Followers)
  - Unread only checkbox
  - Real-time updates
  - Infinite scroll
```

#### **MyChatsTab.jsx**
```jsx
src/components/chat/MyChatsTab.jsx

Props: { userId }
State:
  - chatRooms
  - sortBy
  - filter
Children:
  - ChatListControls
  - ChatRoomCard (list)
  - SmartSuggestions (if < 5 chats)
Features:
  - Sort dropdown
  - Filter (All, Unread, Active, Muted)
  - Search filtered inline
  - Pull to refresh (mobile)
```

#### **ChatRoomCard.jsx**
```jsx
src/components/chat/ChatRoomCard.jsx

Props: { chatRoom, membership }
Features:
  - Book cover thumbnail (80×120px)
  - Book title + author
  - Member count
  - Online indicator + count
  - Last message preview
  - Timestamp
  - Unread badge (count)
  - Muted indicator (if muted)
  - Actions: [Enter Chat] [Leave] [Mute]
  - Swipe actions on mobile
```

#### **ChatRoom.jsx** (Page)
```jsx
src/pages/ChatRoom.jsx

Props: { roomId }
State:
  - messages
  - members
  - isConnected
  - typingUsers
Children:
  - ChatRoomHeader
  - MessagesPanel
  - MembersSidebar (desktop)
  - MessageInput
Features:
  - WebSocket connection
  - Real-time messages
  - Optimistic UI updates
  - Auto-scroll to bottom
  - Load older messages
  - Typing indicators
```

#### **ChatRoomHeader.jsx**
```jsx
src/components/chat/ChatRoomHeader.jsx

Props: { chatRoom, onLeave, onMute }
Features:
  - [← Back] button
  - Book title (clickable → book detail)
  - Author
  - Member count • Online count
  - [Leave] [Mute] buttons
  - Menu (View book, Invite, Report)
  - Mobile: compact layout
```

#### **MessagesPanel.jsx**
```jsx
src/components/chat/MessagesPanel.jsx

Props: { messages, onReply, onReact, onDelete }
State:
  - replyingTo
  - showScrollButton
Children:
  - MessageGroup (grouped by date)
  - DateSeparator
  - TypingIndicator
  - NewMessagesIndicator
Features:
  - Reverse chronological
  - Virtual scrolling (for performance)
  - [Load Older ↑] button at top
  - Auto-scroll to new messages
  - Scroll to bottom button (if scrolled up)
```

#### **ChatMessage.jsx**
```jsx
src/components/chat/ChatMessage.jsx

Props: { message, currentUserId, onReply, onReact, onDelete }
State:
  - showReactions
  - showMenu
Features:
  - Avatar (32px)
  - Username (clickable)
  - Timestamp
  - Message text with @mention highlighting
  - Thread indicator (if reply)
  - "Why this matches" for threaded context
  - Reactions row (👍 5, ❤️ 2)
  - Actions: [Reply] [React] [...]
  - Edit/Delete (if own, within 5 min)
  - Different styling for own messages
  - System messages (joins/leaves)
```

#### **MessageReactions.jsx**
```jsx
src/components/chat/MessageReactions.jsx

Props: { reactions, onReact, userReacted }
Features:
  - Emoji pills with counts
  - Highlighted if user reacted
  - Click to toggle reaction
  - [+] button for reaction picker
  - Tooltip showing who reacted
```

#### **MessageInput.jsx**
```jsx
src/components/chat/MessageInput.jsx

Props: { onSend, replyingTo, onCancelReply }
State:
  - message
  - mentions
Features:
  - Multi-line textarea (auto-resize)
  - @mention autocomplete
  - Character limit (1000)
  - Reply context display (if replying)
  - [Send] button (or Enter key)
  - Attachment button (future)
  - Emoji picker (future)
  - Sticky at bottom
```

#### **MentionAutocomplete.jsx**
```jsx
src/components/chat/MentionAutocomplete.jsx

Props: { query, members, onSelect }
Features:
  - Dropdown list of matching members
  - Avatar + username
  - Keyboard navigation (arrow keys)
  - Auto-position near cursor
  - Dismiss on Esc or click outside
```

#### **MembersSidebar.jsx**
```jsx
src/components/chat/MembersSidebar.jsx

Props: { members, onlineMemberIds }
State:
  - showOnline
  - showOffline
Features:
  - Online section (collapsible)
  - Offline section (collapsible)
  - Green dot indicator for online
  - Avatar + username
  - Click username → view profile
  - [Invite Others] button
  - Desktop: sidebar (30% width)
  - Tablet/Mobile: tab or modal
```

---

### 4.6 Profile Components

#### **Profile.jsx** (Page)
```jsx
src/pages/Profile.jsx

Props: { userId }
State:
  - user
  - profile
  - isOwnProfile
  - activeTab
Children:
  - ProfileHeader
  - ProfileTabs
  - TabContent (Books/Reviews/Lists/Activity/Stats/Settings)
```

#### **ProfileHeader.jsx**
```jsx
src/components/profile/ProfileHeader.jsx

Props: { user, profile, isOwnProfile }
Features:
  Desktop:
  - Avatar (150px, clickable)
  - @username
  - Display name
  - Bio (250 chars, emoji support)
  - Location, website, join date
  - Stats row (5 columns: Books, This Year, Followers, Following, Avg Rating)
  - [Edit Profile] [Settings] buttons (own profile)
  - [Follow] [Message] buttons (other profile)
  
  Mobile:
  - Avatar (100px, centered)
  - Stats (3 columns + 2 below)
  - Stacked layout
```

#### **ProfileStats.jsx**
```jsx
src/components/profile/ProfileStats.jsx

Props: { stats, isOwnProfile, onStatClick }
Features:
  - Clickable stat cards
  - 5 stats: Books, This Year, Followers, Following, Avg Rating
  - Navigate to relevant tab on click
  - Responsive grid
```

#### **ProfileTabs.jsx**
```jsx
src/components/profile/ProfileTabs.jsx

Props: { tabs, activeTab, onChange, isOwnProfile }
Features:
  - Own profile: 6 tabs (Books, Reviews, Lists, Activity, Stats, Settings)
  - Other profile: 4 tabs (Books, Reviews, Lists, Activity)
  - Active tab highlighted
  - Horizontal scroll on mobile
  - Sticky on scroll (optional)
```

#### **BooksTab.jsx**
```jsx
src/components/profile/BooksTab.jsx

Props: { userId, isOwnProfile }
Features:
  - Same as My Books view
  - Three shelf tabs
  - Search and filters
  - No edit capabilities on other profiles
  - Can see their ratings
```

#### **ReviewsTab.jsx**
```jsx
src/components/profile/ReviewsTab.jsx

Props: { userId, isOwnProfile }
State:
  - reviews
  - sortBy
  - ratingFilter
Children:
  - ReviewCard (compact)
Features:
  - Sort dropdown
  - Filter by rating
  - Pagination
  - Edit/Delete on own reviews
  - "View Full Review" links to book detail
```

#### **ListsTab.jsx**
```jsx
src/components/profile/ListsTab.jsx

Props: { userId, isOwnProfile }
State:
  - lists
  - sortBy
  - visibilityFilter (own profile only)
Children:
  - ListCard
Features:
  - Sort dropdown
  - Filter (own: All/Public/Private)
  - Grid layout
  - Create new (own profile)
  - Can like public lists (other profiles)
```

#### **ActivityTab.jsx**
```jsx
src/components/profile/ActivityTab.jsx

Props: { userId }
State:
  - activities
  - typeFilter
  - timeFilter
Children:
  - ActivityFilterBar
  - ActivityCard
Features:
  - Activity type filter
  - Time range filter
  - Infinite scroll
```

#### **StatsTab.jsx** (Own Profile Only)
```jsx
src/components/profile/StatsTab.jsx

Props: { userId, stats }
Children:
  - ReadingGoalCard
  - ReadingBreakdownCard
  - GenreDistributionChart
  - TopAuthorsCard
  - ReadingOverTimeChart
  - AchievementsBadges
Features:
  - All stats in card layout
  - Interactive charts
  - Edit goal button
```

#### **ReadingGoalCard.jsx**
```jsx
src/components/profile/ReadingGoalCard.jsx

Props: { goal, booksRead }
Features:
  - Large progress bar
  - X / Y books (percentage)
  - Status: on track / behind / ahead
  - Next milestone
  - Days remaining
  - [Edit ⚙] button
```

#### **GenreDistributionChart.jsx**
```jsx
src/components/profile/GenreDistributionChart.jsx

Props: { genres }
Features:
  - Horizontal bar chart
  - Sorted by count (descending)
  - Percentage labels
  - Click genre → filter books
```

#### **ReadingOverTimeChart.jsx**
```jsx
src/components/profile/ReadingOverTimeChart.jsx

Props: { data, period: 'year' | 'month' }
Features:
  - Bar chart by month
  - Hover tooltips
  - Toggle year view
  - Responsive
```

#### **AchievementsBadges.jsx**
```jsx
src/components/profile/AchievementsBadges.jsx

Props: { achievements }
Features:
  - Grid of achievement cards
  - Icon + title + description
  - Unlocked state (color)
  - Locked state (grayscale)
  - Progress bar for in-progress
```

#### **SettingsTab.jsx** (Own Profile Only)
```jsx
src/components/profile/SettingsTab.jsx

Props: { userId }
Children:
  - ProfileSettingsCard
  - NotificationSettingsCard
  - AccountSettingsCard
Features:
  - Sections with cards
  - Toggle switches
  - Save buttons per section
  - Confirmation modals for dangerous actions
```

---

<a name="shared-components"></a>
## 5. Shared/Common Components

### 5.1 Book Components

#### **BookCard.jsx**
```jsx
src/components/common/BookCard.jsx

Props: { 
  book, 
  variant: 'default' | 'compact' | 'large',
  showActions: boolean,
  onAction
}
Features:
  - Book cover (responsive sizes)
  - Title (truncated)
  - Author
  - Rating stars + count
  - Genre tags (optional)
  - Quick add to shelf
  - Hover effects
  - Click → book detail
```

#### **BookCover.jsx**
```jsx
src/components/common/BookCover.jsx

Props: { 
  src, 
  alt, 
  size: 'small' | 'medium' | 'large',
  loading: 'lazy' | 'eager'
}
Features:
  - Responsive image
  - Aspect ratio 2:3
  - Placeholder while loading
  - Error fallback
  - Border radius
  - Shadow
```

#### **ProgressBar.jsx**
```jsx
src/components/common/ProgressBar.jsx

Props: { 
  current, 
  total, 
  showPercentage: boolean,
  colorScheme: 'default' | 'success' | 'warning'
}
Features:
  - Animated fill
  - Gradient based on percentage
  - Percentage label
  - Smooth transitions
```

#### **RatingStars.jsx**
```jsx
src/components/common/RatingStars.jsx

Props: { 
  rating, 
  maxStars: 5, 
  size: 'small' | 'medium' | 'large',
  interactive: boolean,
  onChange
}
Features:
  - Filled/empty stars
  - Half-star support
  - Hover effects (if interactive)
  - Click to rate
  - Color: gold
```

#### **RatingDistribution.jsx**
```jsx
src/components/common/RatingDistribution.jsx

Props: { ratings } // { 5: 720000, 4: 300000, ... }
Features:
  - 5 horizontal bars
  - Percentage of total
  - Count display
  - Clickable to filter
```

---

### 5.2 UI Components

#### **Button.jsx**
```jsx
src/components/common/Button.jsx

Props: { 
  variant: 'primary' | 'secondary' | 'text' | 'icon',
  size: 'small' | 'medium' | 'large',
  loading: boolean,
  disabled: boolean,
  leftIcon, rightIcon,
  onClick, children
}
Features:
  - Consistent styling
  - Loading spinner
  - Icon support
  - Disabled state
  - Hover/active states
```

#### **Input.jsx**
```jsx
src/components/common/Input.jsx

Props: { 
  type, 
  placeholder, 
  value, 
  onChange,
  error, 
  helperText,
  leftIcon, rightIcon,
  maxLength
}
Features:
  - Label support
  - Error styling
  - Character counter
  - Icon slots
  - Focus states
```

#### **Textarea.jsx**
```jsx
src/components/common/Textarea.jsx

Props: { 
  placeholder, 
  value, 
  onChange,
  rows: 3,
  maxLength,
  autoResize: boolean
}
Features:
  - Auto-resize
  - Character counter
  - Error states
```

#### **Dropdown.jsx**
```jsx
src/components/common/Dropdown.jsx

Props: { 
  options, 
  value, 
  onChange,
  placeholder,
  searchable: boolean
}
Features:
  - Custom styled select
  - Search (if enabled)
  - Keyboard navigation
  - Portal rendering
```

#### **Checkbox.jsx**
```jsx
src/components/common/Checkbox.jsx

Props: { 
  checked, 
  onChange, 
  label,
  disabled: boolean
}
Features:
  - Custom checkmark
  - Label clickable
  - Indeterminate state
```

#### **RadioGroup.jsx**
```jsx
src/components/common/RadioGroup.jsx

Props: { 
  options, 
  value, 
  onChange,
  name
}
Features:
  - Custom radio buttons
  - Keyboard navigation
  - Label support
```

#### **Toggle.jsx**
```jsx
src/components/common/Toggle.jsx

Props: { 
  checked, 
  onChange, 
  label,
  disabled: boolean
}
Features:
  - Switch animation
  - Label support
  - Accessible
```

#### **Badge.jsx**
```jsx
src/components/common/Badge.jsx

Props: { 
  children, 
  variant: 'default' | 'success' | 'warning' | 'error' | 'info',
  size: 'small' | 'medium'
}
Features:
  - Color variants
  - Pill shape
  - Icon support
```

#### **Tag.jsx**
```jsx
src/components/common/Tag.jsx

Props: { 
  children, 
  onRemove,
  clickable: boolean,
  onClick
}
Features:
  - Rounded rectangle
  - Remove X button (optional)
  - Hover effects
  - Color variants
```

#### **Avatar.jsx**
```jsx
src/components/common/Avatar.jsx

Props: { 
  src, 
  alt, 
  size: 'small' | 'medium' | 'large' | 'xlarge',
  online: boolean
}
Features:
  - Circular image
  - Fallback initials
  - Online indicator (green dot)
  - Sizes: 32px, 40px, 100px, 150px
```

#### **Tooltip.jsx**
```jsx
src/components/common/Tooltip.jsx

Props: { 
  content, 
  children,
  position: 'top' | 'bottom' | 'left' | 'right',
  delay: 500
}
Features:
  - Portal rendering
  - Positioning logic
  - Arrow pointer
  - Delay before show
```

#### **Modal.jsx**
```jsx
src/components/common/Modal.jsx

Props: { 
  isOpen, 
  onClose, 
  title,
  children,
  footer,
  size: 'small' | 'medium' | 'large',
  closeOnOverlay: true
}
Features:
  - Portal rendering
  - Backdrop overlay
  - Close button
  - Escape key handling
  - Body scroll lock
  - Fade animation
  - Responsive (fullscreen on mobile option)
```

#### **Drawer.jsx**
```jsx
src/components/common/Drawer.jsx

Props: { 
  isOpen, 
  onClose, 
  position: 'left' | 'right' | 'bottom',
  children
}
Features:
  - Slide animation
  - Backdrop
  - Escape/click outside to close
  - Body scroll lock
```

#### **Tabs.jsx**
```jsx
src/components/common/Tabs.jsx

Props: { 
  tabs: [{id, label, content}], 
  activeTab, 
  onChange
}
Features:
  - Tab navigation
  - Active indicator
  - Scrollable (mobile)
  - Keyboard navigation
```

#### **Carousel.jsx**
```jsx
src/components/common/Carousel.jsx

Props: { 
  children, 
  itemsPerView: {desktop, tablet, mobile},
  showArrows: boolean,
  showDots: boolean,
  autoplay: boolean
}
Features:
  - Responsive items
  - Arrow navigation
  - Dot indicators
  - Swipe support (touch)
  - Auto-scroll (optional)
  - Smooth transitions
```

#### **InfiniteScroll.jsx**
```jsx
src/components/common/InfiniteScroll.jsx

Props: { 
  onLoadMore, 
  hasMore, 
  loading,
  children,
  threshold: 300
}
Features:
  - Intersection Observer
  - Loading spinner
  - Threshold distance
  - Error handling
```

#### **Skeleton.jsx**
```jsx
src/components/common/Skeleton.jsx

Props: { 
  variant: 'text' | 'circle' | 'rectangle',
  width, height,
  count: 1
}
Features:
  - Shimmer animation
  - Multiple items
  - Custom dimensions
```

#### **EmptyState.jsx**
```jsx
src/components/common/EmptyState.jsx

Props: { 
  icon, 
  title, 
  description,
  action: {label, onClick}
}
Features:
  - Large icon (64px)
  - Title and description
  - Optional CTA button
  - Centered layout
```

#### **LoadingSpinner.jsx**
```jsx
src/components/common/LoadingSpinner.jsx

Props: { 
  size: 'small' | 'medium' | 'large',
  fullscreen: boolean
}
Features:
  - Rotating spinner
  - Sizes: 24px, 40px, 64px
  - Fullscreen overlay option
```

#### **ErrorBoundary.jsx**
```jsx
src/components/common/ErrorBoundary.jsx

Props: { 
  children,
  fallback: ReactNode
}
Features:
  - Catch component errors
  - Display fallback UI
  - Log errors
  - Reset functionality
```

---

### 5.3 Navigation Components

#### **Breadcrumbs.jsx**
```jsx
src/components/common/Breadcrumbs.jsx

Props: { 
  items: [{label, path}],
  separator: '/'
}
Features:
  - Clickable links
  - Current page (no link)
  - Separator customization
  - Responsive (collapse on mobile)
```

#### **Pagination.jsx**
```jsx
src/components/common/Pagination.jsx

Props: { 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisible: 7
}
Features:
  - Page numbers
  - Previous/Next buttons
  - Jump to page input
  - Ellipsis for many pages
  - Mobile friendly
```

---

### 5.4 Feedback Components

#### **Toast.jsx**
```jsx
src/components/common/Toast.jsx

Props: { 
  message, 
  type: 'success' | 'error' | 'info' | 'warning',
  duration: 3000,
  onClose
}
Features:
  - Auto-dismiss timer
  - Close button
  - Icon per type
  - Slide-in animation
  - Stack multiple toasts
  - Position: top-right (desktop), bottom (mobile)
```

#### **Alert.jsx**
```jsx
src/components/common/Alert.jsx

Props: { 
  children, 
  variant: 'info' | 'success' | 'warning' | 'error',
  closable: boolean,
  onClose
}
Features:
  - Colored backgrounds
  - Icon per variant
  - Close button (optional)
  - Full-width
```

#### **ConfirmDialog.jsx**
```jsx
src/components/common/ConfirmDialog.jsx

Props: { 
  isOpen, 
  title, 
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger: boolean
}
Features:
  - Modal wrapper
  - Title + message
  - Confirm/Cancel buttons
  - Danger styling (red confirm)
  - Keyboard support (Enter/Esc)
```

---

<a name="modals-wireframes"></a>
### 5.5 Modal Components

#### **UpdateProgressModal.jsx**
```jsx
src/components/modals/UpdateProgressModal.jsx

Props: { 
  isOpen, 
  onClose, 
  book, 
  userBook,
  onUpdate
}
State:
  - currentPage
  - percentage
  - markAsFinished
Features:
  - Book info header
  - Page number input (syncs with slider)
  - Percentage slider
  - Progress bar visualization
  - Quick action buttons (+10, +50, +100 pages)
  - Reading stats (pace, estimated finish)
  - "Mark as finished" checkbox
  - [Cancel] [Update] buttons
```

#### **WriteReviewModal.jsx**
```jsx
src/components/modals/WriteReviewModal.jsx

Props: { 
  isOpen, 
  onClose, 
  book,
  existingReview,
  onSubmit
}
State:
  - rating (required)
  - title (optional)
  - reviewText (required, min 50 chars)
  - containsSpoilers
Features:
  - Book info header
  - Star rating picker
  - Title input (100 chars)
  - Review textarea (5000 chars)
  - Character counter
  - Spoiler checkbox
  - Writing tips (collapsible)
  - [Save Draft] [Cancel] [Publish] buttons
```

#### **AddToListModal.jsx**
```jsx
src/components/modals/AddToListModal.jsx

Props: { 
  isOpen, 
  onClose, 
  book,
  lists,
  onSave
}
State:
  - selectedLists (array of list IDs)
Features:
  - Book info header
  - Checkbox list of user's lists
  - Already added (checked by default)
  - [+ Create New List] button
  - [Cancel] [Add to Selected Lists] buttons
  - Button shows count (e.g., "Add to 2 Lists")
```

#### **CreateListModal.jsx**
```jsx
src/components/modals/CreateListModal.jsx

Props: { 
  isOpen, 
  onClose, 
  onSubmit,
  initialBooks
}
State:
  - name (required, 100 chars)
  - description (optional, 500 chars)
  - visibility ('public' | 'private')
  - selectedBooks
Features:
  - Name input
  - Description textarea
  - Visibility radio buttons
  - Add books section (search + checkboxes)
  - [Cancel] [Create List] buttons
```

#### **EditProfileModal.jsx**
```jsx
src/components/modals/EditProfileModal.jsx

Props: { 
  isOpen, 
  onClose, 
  profile,
  onSave
}
State:
  - avatarPreview
  - displayName
  - username
  - bio
  - location
  - website
Features:
  - Avatar preview + change/remove buttons
  - Display name input
  - Username input (with "can only change once" warning)
  - Bio textarea (250 chars)
  - Location input
  - Website input (URL validation)
  - [Cancel] [Save Changes] buttons
```

#### **EditGoalModal.jsx**
```jsx
src/components/modals/EditGoalModal.jsx

Props: { 
  isOpen, 
  onClose, 
  currentGoal,
  onSave
}
State:
  - year
  - targetBooks
Features:
  - Year selector
  - Target books input (number)
  - Current progress display (if editing)
  - Suggestions (based on past years)
  - [Cancel] [Save Goal] buttons
```

---

<a name="state-management"></a>
## 6. State Management

### 6.1 Context Providers

#### **AuthContext**
```jsx
src/context/AuthContext.jsx

State:
  - user (User object | null)
  - token (string | null)
  - loading (boolean)
  - isAuthenticated (boolean)

Methods:
  - login(credentials)
  - logout()
  - register(userData)
  - updateProfile(data)
  - refreshToken()

Storage:
  - Tokens in localStorage
  - Axios interceptors for auth headers
  - Auto-refresh token on 401
```

#### **ThemeContext**
```jsx
src/context/ThemeContext.jsx

State:
  - theme ('light' | 'dark')
  - systemPreference (boolean)

Methods:
  - toggleTheme()
  - setTheme(theme)

Features:
  - Persist preference to localStorage
  - Apply theme class to body
  - Detect system preference
```

#### **NotificationContext**
```jsx
src/context/NotificationContext.jsx

State:
  - notifications (array)
  - unreadCount (number)

Methods:
  - addNotification(notification)
  - removeNotification(id)
  - markAsRead(id)
  - markAllAsRead()
  - clearAll()

Features:
  - Toast notifications
  - Real-time updates (WebSocket)
  - Persist to localStorage (optional)
```

---

### 6.2 TanStack Query (React Query)

**Query Keys Convention:**
```javascript
// Books
['books', 'search', query]
['books', bookId]
['books', 'trending', period]

// User Books
['user-books', userId, shelf]
['user-books', userBookId]

// Reviews
['reviews', bookId]
['reviews', reviewId]

// Chat
['chat-rooms', userId]
['chat-rooms', roomId]
['chat-messages', roomId, { page }]

// Profile
['users', userId]
['users', userId, 'stats']
['users', userId, 'reviews']

// Activity
['activity', userId, { filter }]
```

**Custom Hooks:**
```javascript
// src/hooks/useBooks.js
export const useBookSearch = (query) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => booksAPI.search(query),
    enabled: query.length > 2
  });
};

export const useBook = (bookId) => {
  return useQuery({
    queryKey: ['books', bookId],
    queryFn: () => booksAPI.getById(bookId)
  });
};

export const useAddToShelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userBooksAPI.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-books']);
    }
  });
};
```

---

<a name="routing"></a>
## 7. Routing Structure

```jsx
// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'books',
        element: <MyBooks />
      },
      {
        path: 'discover',
        element: <Discover />
      },
      {
        path: 'books/:bookId',
        element: <BookDetail />
      },
      {
        path: 'chat',
        element: <Chat />
      },
      {
        path: 'chat/:roomId',
        element: <ChatRoom />
      },
      {
        path: 'profile/:userId',
        element: <Profile />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
```

---

<a name="hooks"></a>
## 8. Hooks & Utilities

### Custom Hooks

```javascript
// src/hooks/useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
};

// src/hooks/useDebounce.js
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// src/hooks/useInfiniteScroll.js
export const useInfiniteScroll = (callback, options = {}) => {
  const observerRef = useRef();
  const { threshold = 300, enabled = true } = options;
  
  useEffect(() => {
    if (!enabled) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback();
      },
      { rootMargin: `${threshold}px` }
    );
    
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    
    return () => observer.disconnect();
  }, [callback, threshold, enabled]);
  
  return observerRef;
};

// src/hooks/useWebSocket.js
export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  
  // WebSocket connection logic...
  
  return { socket, isConnected, lastMessage, send, close };
};

// src/hooks/useMediaQuery.js
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
};

// src/hooks/useClickOutside.js
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};
```

---

<a name="styling"></a>
## 9. Styling Architecture

### Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#DBEAFE',
          500: '#2563EB',
          700: '#1E40AF',
        },
        // ... more colors from design system
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      spacing: {
        // Custom spacing scale
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: []
};
```

### CSS Variables

```css
/* src/styles/variables.css */
:root {
  /* Colors */
  --primary-blue: #2563EB;
  --primary-dark: #1E40AF;
  --gray-900: #111827;
  
  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;
  
  /* Typography */
  --text-base: 1rem;
  --text-lg: 1.125rem;
  
  /* Transitions */
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

[data-theme="dark"] {
  --bg-primary: #1F2937;
  --text-primary: #F9FAFB;
  /* ... dark mode overrides */
}
```

---

<a name="specifications"></a>
## 10. Component Specifications

### Component Template

```jsx
/**
 * ComponentName
 * 
 * @description Brief description of component purpose
 * @component
 * @param {Object} props - Component props
 * @param {string} props.propName - Prop description
 * @returns {JSX.Element}
 * 
 * @example
 * <ComponentName propName="value" />
 */

import React from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ propName }) => {
  // Component logic
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  propName: PropTypes.string.isRequired,
};

ComponentName.defaultProps = {
  // Default props
};

export default ComponentName;
```

---

## Summary

This React component structure provides:

✅ **100+ Components** organized by feature  
✅ **Consistent patterns** across all views  
✅ **Reusable components** for common UI elements  
✅ **State management** with Context + TanStack Query  
✅ **WebSocket integration** for real-time features  
✅ **Responsive design** support throughout  
✅ **Type safety** with PropTypes  
✅ **Performance optimization** with lazy loading, memoization  
✅ **Accessibility** considerations  

Ready for implementation!

---

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Status:** Complete & Ready for Development
