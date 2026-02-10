# Book Review App - Comprehensive Wireframe & Layout Document

## Quick Reference
- **Total Views:** 6 (Dashboard, My Books, Discover, Book Detail, Chat, Profile)
- **Breakpoints:** Mobile (<768px), Tablet (768-1023px), Desktop (1024px+)
- **Design System:** Complete color palette, typography scale, spacing system
- **Components:** 50+ reusable components with specifications

---

## Table of Contents

1. [Design System](#design-system)
2. [Global Navigation](#navigation)
3. [Dashboard Wireframes](#dashboard)
4. [My Books Wireframes](#my-books)
5. [Discover/Search Wireframes](#discover)
6. [Book Detail Wireframes](#book-detail)
7. [Chat/Community Wireframes](#chat)
8. [Profile Wireframes](#profile)
9. [Component Library](#components)
10. [Responsive Patterns](#responsive)

---

<a name="design-system"></a>
## 1. Design System

### Color Palette
```
Primary:
--primary-blue: #2563EB
--primary-dark: #1E40AF
--primary-light: #DBEAFE

Secondary:
--secondary-purple: #7C3AED (AI features)
--secondary-green: #10B981 (Success)
--secondary-orange: #F59E0B (Trending)
--secondary-red: #EF4444 (Errors)

Neutrals:
--gray-50 to --gray-900 (9 shades)

Backgrounds:
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--bg-tertiary: #F3F4F6
```

### Typography
```
Font: 'Inter', system fonts
Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px
Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
Line Heights: 1.25 (tight), 1.5 (normal), 1.75 (relaxed)
```

### Spacing Scale
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px
```

### Border Radius
```
Small: 4px
Medium: 8px
Large: 12px
XLarge: 16px
Full: 9999px
```

### Shadows
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Grid System
- 12-column grid
- Desktop gutter: 32px
- Tablet gutter: 24px
- Mobile gutter: 16px
- Max container: 1400px

---

<a name="navigation"></a>
## 2. Global Navigation

### Desktop Navigation (1024px+)
```
┌──────────────────────────────────────────────────────┐
│ [Logo] Dashboard MyBooks Discover Chat Profile [🔔][@]│
└──────────────────────────────────────────────────────┘
```
- Height: 64px
- Fixed position
- Horizontal items
- Active: Blue underline

### Tablet Navigation (768-1023px)
```
┌──────────────────────────────────┐
│ [☰] [Logo]           [🔔] [@]   │
└──────────────────────────────────┘
```
- Height: 56px
- Hamburger menu (slides from left)
- Logo center/left

### Mobile Navigation (<768px)
**Top Bar:**
```
┌──────────────────────────────┐
│ [☰] Logo      [🔔] [@]      │
└──────────────────────────────┘
```

**Bottom Navigation:**
```
┌──────────────────────────────┐
│ 🏠    📚    🔍    💬    👤 │
│ Home Books Disc  Chat  Prof │
└──────────────────────────────┘
```
- Fixed bottom
- 5 items max
- Active highlighted

---

<a name="dashboard"></a>
## 3. Dashboard Wireframes

### Desktop Layout (1024px+)
```
┌────────────────────────────────────────────────┐
│ Dashboard                        [+ Add Book]  │
├──────────────────────┬─────────────────────────┤
│ Main (60%)           │ Sidebar (40%)           │
│                      │                         │
│ 📚 Currently Reading │ 🎯 Reading Goal         │
│ [Book1] [Book2]      │ 23/50 (46%)             │
│                      │ ████████░░░░            │
│ ✨ Recommended       │                         │
│ [5 books carousel]   │ 📊 Quick Stats          │
│                      │ 142 Books               │
│ 📰 Activity Feed     │ 5,234 Pages             │
│ [3-4 activities]     │ 15 Day Streak           │
│                      │ 4.2★ Avg                │
│                      │                         │
│                      │ 🔥 Trending             │
│                      │ [4 books]               │
└──────────────────────┴─────────────────────────┘

🤖 AI Reading Feeds
[Feed1] [Feed2] [Feed3] [+New]
```

**Key Elements:**
- 2-column layout (60/40)
- Currently Reading: 2 books side-by-side with progress
- Recommendations: 5 books horizontal carousel
- Activity Feed: 3-4 recent items
- Sidebar: Goal, stats, trending (stacked)
- AI Feeds: 3 cards + create button

### Tablet Layout (768-1023px)
- Single column
- 2 books in Currently Reading
- 3 books in carousels
- All sections stacked

### Mobile Layout (<768px)
- Fully stacked
- 1 book per screen (swipeable)
- Stats in 2×2 grid
- Bottom navigation

**Responsive Book Card:**
Desktop/Tablet:
```
┌──────────┐
│  Cover   │
│ 150x225  │
└──────────┘
Title
Author
████████░░ 45%
203/450 pages
[Update]
```

Mobile:
```
┌────────────┐
│   Cover    │
│  180x270   │
└────────────┘
Title
████░░ 45%
203/450
[Update] [•••]
```

---

<a name="my-books"></a>
## 4. My Books Wireframes

### Desktop Layout (1024px+)
```
┌────────────────────────────────────────────────┐
│ My Books (142)                  [+ Add Book]   │
├────────────────────────────────────────────────┤
│ 📚 [Want to Read] [Currently] [Read]          │
│ ───────────────────────────────────────────── │
│ 📋 [All Lists] [Summer 24] [Fantasy] [+New]   │
├────────────────────────────────────────────────┤
│ 🔍 Search  [Genre▼] [Author▼] [Sort▼] [Grid] │
├────────────────────────────────────────────────┤
│ Currently Reading (5)          [← Prev] [Next→]│
│                                                │
│ [Book1] [Book2] [Book3] [Book4]               │
│ Showing 4 of 5 • Page 1/2                     │
├────────────────────────────────────────────────┤
│ 📋 My Lists (8)                [+ Create List] │
│                                                │
│ [List1] [List2] [List3] [List4]               │
│ [List5] [List6] [List7] [+New]                │
└────────────────────────────────────────────────┘
```

**Key Elements:**
- Shelf tabs + List row navigation
- 4-5 books per carousel row
- Lists: 3-4 per row grid
- Full filter/search bar
- Pagination arrows

### Tablet Layout
- 2-3 books per row
- 2 lists per row
- Condensed filters

### Mobile Layout
- Dropdown shelf selector
- 1 book/list per screen (carousel)
- Filters in drawer

**List Card Component:**
Desktop:
```
┌──────────────┐
│ Summer 2024  │
│ Reading [•••]│
│ "Books I..." │
│ [B][B][B]    │
│ +12 more     │
│ 15 books     │
│ Public 🌐    │
│ Updated 2d   │
│ [View List]  │
└──────────────┘
```

---

<a name="discover"></a>
## 5. Discover/Search Wireframes

### Desktop Layout (1024px+)
```
┌────────────────────────────────────────────────┐
│ Discover Books                                 │
├────────────────────────────────────────────────┤
│ 🔍 Search books...                       [🔍] │
│ [📚 Regular Search] [✨ AI Search]            │
├────────────────────────────────────────────────┤
│ 🔥 Trending This Week          [See All →]    │
│ [#1][#2][#3][#4][#5]                          │
├────────────────────────────────────────────────┤
│ ✨ New Releases                [See All →]    │
│ [Book][Book][Book][Book][Book]                │
├────────────────────────────────────────────────┤
│ ⭐ Recommended For You         [See All →]    │
│ [Book][Book][Book][Book][Book]                │
│ 95%   92%   88%   85%   82%                   │
├────────────────────────────────────────────────┤
│ Browse by Genre                                │
│ [Fantasy][Sci-Fi][Mystery][Romance]           │
│ [Thriller][Non-Fic][Biography][History]       │
│ [View All Genres →]                           │
└────────────────────────────────────────────────┘
```

**AI Search Modal:**
```
┌────────────────────────────────────┐
│ ✨ AI-Powered Search    [✕ Close] │
├────────────────────────────────────┤
│ Describe the book:                 │
│ ┌────────────────────────────────┐ │
│ │ A detective in Victorian       │ │
│ │ London who...                  │ │
│ └────────────────────────────────┘ │
│ 350/500 characters                 │
│                                    │
│ Genre: [Mystery ▼]                 │
│ Era: [Victorian ▼]                 │
│                                    │
│ 💡 Tips for better results...      │
│                                    │
│ [Clear] [🔍 Search with AI]       │
└────────────────────────────────────┘
```

**AI Search Results:**
```
✨ Best Match (95%)
┌────┐ The Adventures of Sherlock Holmes
│Cvr │ by Arthur Conan Doyle
└────┘ ⭐⭐⭐⭐⭐ 4.3 (89K)
[+ Shelf ▼] [Details]

Why this matches:
✓ Victorian London setting
✓ Detective with logic
✓ Sidekick writer
```

### Regular Search Results
```
┌────────────────────────────────────┐
│ "harry potter" - 127 results       │
│ [Sort▼] [Genre▼] [Rating▼]        │
├────────────────────────────────────┤
│ ┌────┐ Harry Potter & Sorcerer's  │
│ │Cvr │ by J.K. Rowling             │
│ └────┘ ⭐⭐⭐⭐⭐ 4.5 (1.2M)       │
│ Fantasy, YA • 309p • 1998          │
│ [+ Shelf ▼] [Details]              │
├────────────────────────────────────┤
│ [Result 2...]                      │
└────────────────────────────────────┘
[1][2][3]...[7] [Next→]
```

---

<a name="book-detail"></a>
## 6. Book Detail Wireframes

### Desktop Layout (1024px+)
```
┌────────────────────────────────────────────────┐
│ ← Back                                         │
├──────────────┬─────────────────────────────────┤
│ ┌──────────┐ │ The Name of the Wind            │
│ │  Cover   │ │ The Kingkiller Chronicle #1     │
│ │ 250x375  │ │ by Patrick Rothfuss             │
│ └──────────┘ │                                 │
│              │ ⭐⭐⭐⭐⭐ 4.5 (1.2M)           │
│ [Add Shelf▼] │ 5★ ████████████ 60%             │
│ [Add List▼]  │ 4★ ██████░░░░░░ 25%             │
│ [Share]      │ 3★ ██░░░░░░░░░░ 10%             │
│              │                                 │
│              │ Fantasy • 662p • 2007           │
│              │                                 │
│              │ Your Status: Currently Reading  │
│              │ Progress: 45% (203/662)         │
│              │ [Update Progress]               │
│              │                                 │
│              │ Your Rating: ⭐⭐⭐⭐⭐         │
│              │ [Write Review]                  │
│              │                                 │
│              │ [💬 Join Chat Room]            │
│              │ 127 people chatting             │
└──────────────┴─────────────────────────────────┘

Description [▼ Expand]
Told in Kvothe's own voice... [Read More]

Reviews (1,234)              [View All →]
[Review 1] [Review 2] [Review 3] [Review 4] [Review 5]

Similar Books                [See All →]
[Book][Book][Book][Book][Book]
```

**Review Card:**
```
┌────────────────────────────────────┐
│ @alice ⭐⭐⭐⭐⭐ • 2 days ago     │
├────────────────────────────────────┤
│ An absolute masterpiece!           │
│                                    │
│ This book exceeded my expectations │
│ The prose is beautiful... [More]   │
│                                    │
│ 👍 234 helpful • 💬 23 comments    │
│ [Helpful] [Comment] [Share]        │
└────────────────────────────────────┘
```

### Mobile Layout
- Stacked single column
- Cover: Full width or centered 200×300px
- All info vertical
- 2 reviews + "Load More"
- Similar: 1 book carousel

---

<a name="chat"></a>
## 7. Chat/Community Wireframes

### Community Hub Desktop (1024px+)
```
┌────────────────────────────────────────────────┐
│ Community                                      │
├────────────────────────────────────────────────┤
│ 🔍 Search chats...                       [🔍] │
│ Search in: [My Chats ▼]                       │
├────────────────────────────────────────────────┤
│ [My Activity] [My Chats]                       │
├────────────────────────────────────────────────┤
│ My Chat Rooms (5)                              │
│ Sort: [Recent ▼] Show: [All ▼]                │
│                                                │
│ ┌────────────────────────────────────────────┐ │
│ │ 📖 The Name of the Wind  3 new messages   │ │
│ │ ┌────┐ 45 members • 🟢 12 online         │ │
│ │ │Cvr │ Last: 2min ago                     │ │
│ │ └────┘ "@john finished part 2?"           │ │
│ │ [Enter] [Leave] [Mute]                    │ │
│ └────────────────────────────────────────────┘ │
│ [Chat 2...] [Chat 3...]                        │
└────────────────────────────────────────────────┘
```

**My Activity Tab:**
```
┌────────────────────────────────────┐
│ 💬 New Comment on Your Review      │
│ @alice commented on "The Name..."  │
│ "I agree about the magic system!"  │
│ 2h ago • [View] [Reply]            │
└────────────────────────────────────┘
```

### Individual Chat Room Desktop
```
┌────────────────────────────────────────────────┐
│ ← 📖 The Name of the Wind Chat                 │
│ 45 members • 🟢 12 online [Leave][Mute][•••]  │
├──────────────────────┬─────────────────────────┤
│ Messages (70%)       │ Members (30%)           │
│                      │ 🟢 Online (12):         │
│ @alice 10:30 AM      │ @alice @bob @john(You)  │
│ Has anyone finished? │                         │
│ [Reply][👍5]         │ ⚪ Offline (33):        │
│                      │ @eve ...                │
│  ↳@bob 10:32 AM      │                         │
│   Yes! Amazing       │ [Invite Others]         │
│   [Reply][👍3]       │                         │
│                      │                         │
│ [Type message...][→] │                         │
└──────────────────────┴─────────────────────────┘
```

### Mobile Chat Room
```
┌──────────────────────┐
│ ← The Name... [👥][•]│
│ 🟢 12 online         │
├──────────────────────┤
│ @alice 10:30 AM      │
│ Has anyone finished? │
│ [Reply][👍5]         │
│                      │
│  ↳@bob 10:32 AM      │
│   Yes! Amazing       │
│                      │
│ You 11:00 AM         │
│ The magic is complex!│
│ [Edit][Delete]       │
│                      │
├──────────────────────┤
│ [Type message...][→] │
└──────────────────────┘
```

**Members Modal (Mobile):**
Tap 👥 opens bottom sheet with member list

---

<a name="profile"></a>
## 8. Profile Wireframes

### Desktop Layout (Own Profile)
```
┌────────────────────────────────────────────────┐
│ ┌────┐ @john_doe          [Edit Profile] [⚙] │
│ │150 │ John Doe                                │
│ │px  │ "I love epic fantasy! 📚"              │
│ └────┘ 📍 San Marcos • 🔗 site.com           │
│                                                │
│ ┌───────┬───────┬───────┬───────┬───────┐    │
│ │142    │23 This│ 150   │  89   │ 4.2★  │    │
│ │Books  │ Year  │Follow.│Follow.│ Avg   │    │
│ └───────┴───────┴───────┴───────┴───────┘    │
└────────────────────────────────────────────────┘

[Books][Reviews][Lists][Activity][Stats][Settings]

[Tab content...]
```

**Stats Tab:**
```
🎯 2024 Reading Goal             [Edit]
23 / 50 books (46%)
████████████░░░░░░░░░░░░
✓ On track! 2 books ahead

📊 Reading Breakdown
Total: 142 books
This Year: 23 books
Pages: 5,234
Streak: 15 days 🔥
Avg Rating: 4.2★

📚 By Genre
Fantasy      ████████████████ 45 (32%)
Sci-Fi       ████████████ 30 (21%)
Mystery      ████ 12 (8%)

🏆 Top Authors
1. Sanderson    12 books ⭐4.8
2. Jemisin      8 books ⭐4.6

📈 Reading Over Time
[Bar chart by month]

🏅 Achievements
🏆 Century Club - Read 100+ books
🔥 Fire Streak - 15 day streak
```

### Other User's Profile
```
┌────────────────────────────────────────────────┐
│ ┌────┐ @alice_reads                            │
│ │150 │ Alice Johnson                           │
│ │px  │ "Mystery novels ☕"                     │
│ └────┘ 📍 Austin                               │
│                                                │
│ ┌───────┬───────┬───────┬───────┬───────┐    │
│ │89     │12 This│ 234   │ 178   │ 4.5★  │    │
│ │Books  │ Year  │Follow.│Follow.│ Avg   │    │
│ └───────┴───────┴───────┴───────┴───────┘    │
│                                                │
│ [Following ✓] [Message] [•••]                 │
│ You and @bob follow each other                 │
└────────────────────────────────────────────────┘

[Books][Reviews][Lists][Activity]
(No Stats/Settings for other users)
```

### Mobile Profile
```
┌──────────────────────┐
│ Profile       [•••]  │
├──────────────────────┤
│    ┌────┐            │
│    │100 │            │
│    │px  │            │
│    └────┘            │
│                      │
│ @john_doe            │
│ John Doe             │
│ "I love fantasy! 📚"│
│                      │
│ ┌────┬────┬────┐    │
│ │142 │150 │ 89 │    │
│ │Book│Fol.│Fol.│    │
│ └────┴────┴────┘    │
│ 23 Year  4.2★ Avg   │
│                      │
│ [Edit] [Settings]    │
│                      │
│ [Books][Reviews]...  │
│ (scroll horizontal)  │
└──────────────────────┘
```

---

<a name="components"></a>
## 9. Component Library

### Buttons
```
Primary:    [Button Text] - Blue background
Secondary:  [Button Text] - White with border
Text:       Button Text   - No background
Icon:       [🔔]         - Icon only
```

### Inputs
```
Text:     ┌──────────────┐
          │ Placeholder  │
          └──────────────┘

Textarea: ┌──────────────┐
          │ Multi-line   │
          │              │
          └──────────────┘

Dropdown: [Select... ▼]

Checkbox: ☐ Label / ☑ Checked

Radio:    ○ Option / ● Selected
```

### Cards
```
Basic Card:
┌──────────────┐
│ Title  [Act] │
│ ──────────── │
│ Content      │
│ [Button]     │
└──────────────┘

Book Card:
┌────┐
│Cvr │
│150 │
│225 │
└────┘
Title
Author
⭐⭐⭐⭐⭐
[+ Shelf]
```

### Progress
```
Bar:     ████████░░░░ 45%
Spinner: ⟳
Skeleton: ▅▅▅▅ ▅▅▅▅
```

### Badges & Tags
```
Badge: [3 new]
Tag:   [Fantasy]
Status: [Currently Reading]
```

### States
```
Hover:    Darken + Shadow
Focus:    Blue outline
Active:   Pressed effect
Disabled: Gray + not-allowed
Loading:  ⟳ Loading...
Error:    Red border + message
Success:  Green border + checkmark
Empty:    Icon + message + CTA
```

---

<a name="responsive"></a>
## 10. Responsive Patterns

### Layout Changes
```
Desktop  → 2-3 columns, sidebars
Tablet   → 1-2 columns, stacked sidebars
Mobile   → Single column, bottom nav
```

### Content Adaptation
```
Desktop  → 4-5 items per row
Tablet   → 2-3 items per row
Mobile   → 1 item (carousel)
```

### Navigation
```
Desktop  → Horizontal nav bar
Tablet   → Hamburger + icons
Mobile   → Hamburger + bottom nav
```

### Typography
```
Desktop  → H1: 36px, Body: 16px
Tablet   → H1: 30px, Body: 16px
Mobile   → H1: 24px, Body: 16px (min)
```

### Images
```
Book Covers:
Desktop  → 150×225 / 250×375
Tablet   → 130×195 / 180×270
Mobile   → 120×180 / 200×300

Avatars:
Desktop  → 150px / 40px
Tablet   → 120px / 36px
Mobile   → 100px / 32px
```

### Interactions
```
Desktop  → Hover states, tooltips
Tablet   → Touch targets 44px+
Mobile   → Swipe gestures, 48px+ targets
```

---

## Implementation Checklist

- [ ] Set up design tokens (colors, spacing, typography)
- [ ] Create component library
- [ ] Implement responsive grid system
- [ ] Build navigation (desktop, tablet, mobile)
- [ ] Develop Dashboard view
- [ ] Develop My Books view
- [ ] Develop Discover/Search view
- [ ] Develop Book Detail view
- [ ] Develop Chat/Community view
- [ ] Develop Profile view
- [ ] Implement all modals
- [ ] Add interactive states
- [ ] Test responsive breakpoints
- [ ] Accessibility audit
- [ ] Performance optimization

---

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Status:** Complete & Ready for Implementation
