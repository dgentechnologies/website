# Admin Complete Flow Documentation

This document explains the end-to-end operational flow of the admin system for the DGEN Technologies website.

## 1. Entry and Authentication Flow

1. Admin opens /admin/login.
2. Login form validates email and password (minimum 6 chars).
3. Firebase email/password sign-in is attempted.
4. On success, admin is redirected to /admin.
5. On failure, mapped user-friendly errors are shown.

## 2. Route Guard and Access Rules

- Admin pages are wrapped by src/app/(admin)/admin/layout.tsx.
- Unauthenticated users are redirected to /admin/login.
- Authenticated users on /admin/login are redirected to /admin.
- Skeleton loading is shown while auth resolves.
- Mobile devices are blocked from admin UI (desktop-only notice).

## 3. Admin Shell and Navigation Flow

Sidebar views:
- Dashboard
- Blog
- Messages
- Performance
- Careers
- Applications
- Settings
- Sign Out

The selected sidebar item updates activeView and renders the corresponding module in src/app/(admin)/admin/page.tsx.

## 4. Dashboard Flow

Data sources:
- Firestore contactMessages
- Firestore blogPosts
- Authenticated GET /api/analytics/track?range=7|30|365

Flow:
1. Count posts and messages.
2. Fetch analytics using Firebase ID token.
3. Render cards and charts.
4. Date range selector re-fetches analytics.

## 5. Blog Management Flow

### 5.1 Blog List

- Reads blogPosts ordered by createdAt desc.
- Row actions: View, Edit, Delete.
- Delete is protected by confirmation dialog.

### 5.2 Create Blog (2-step)

Step 1: /admin/blog/create
- Select author
- Enter topic or use AI topic suggestions

Step 2: /admin/blog/editor?author=...&topic=...
- Optionally generate full content with AI
- Edit title, description, tags, content HTML, image, image hint
- Publish to blogPosts/{slug}

Save behavior:
- Slug generated from title
- Slug collision check
- createdAt server timestamp

### 5.3 Edit Blog

Route: /admin/blog/edit/[slug]
- Load existing post
- Save updates with updatedAt server timestamp

## 6. Messages Flow

- Reads contactMessages by latest first
- Actions: copy email, delete message
- Delete uses confirmation dialog and removes contactMessages/{id}

## 7. Performance Flow

- Uses authenticated GET /api/analytics/track
- Shows total views, unique visitors, top countries, top pages, daily views, recent visitors
- Date range selector supports 7/30/365

## 8. Careers Flow

Collection: careerListings

- List all career listings
- Create (/admin/careers/create)
- Edit (/admin/careers/edit/[id])
- Delete with confirmation

Create writes createdAt + updatedAt.
Edit writes updatedAt.

## 9. Applications Flow

Collection: jobApplications

- Search and status filters
- Candidate detail panel
- Resume preview (PDF iframe; non-PDF open/download)
- Status updates: pending, reviewed, shortlisted, rejected

## 10. Settings Flow

### 10.1 Add New Admin

- Client calls POST /api/admin/create with Bearer token.
- Server verifies token, creates Firebase Auth user, sets admin claim.

### 10.2 Change Password

- Re-authenticate with current password.
- Update password via Firebase Auth.

## 11. AI Flows

### suggest-blog-topic
- File: src/ai/flows/suggest-blog-topic.ts
- Input: author, existingTitles, suggestionHistory
- Output: 3 topic suggestions

### generate-blog-post
- File: src/ai/flows/generate-blog-post.ts
- Input: author, topic
- Output: full blog payload (title, description, slug, tags, HTML content, image, imageHint)
- Includes Unsplash lookup + fallback image logic

### generate-career-listing
- File: src/ai/flows/generate-career-listing.ts
- Input: brief
- Output: complete career form fields

## 12. Collections Used by Admin

- blogPosts
- contactMessages
- careerListings
- jobApplications
- pageViews
- siteAnalytics
