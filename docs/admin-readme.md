# DGEN Technologies Admin Panel Documentation

## 1. Overview

The admin panel is a desktop-only, Firebase-authenticated CMS for the DGEN Technologies website. It is implemented inside the Next.js App Router under `/admin` and is designed to manage content, users, analytics, and operational workflows from a single dashboard.

Primary objectives:
- Manage blog publishing with AI-assisted authoring
- Manage careers listings and job applications
- Review contact form messages
- Monitor traffic and performance analytics
- Manage admin accounts and security-sensitive settings

---

## 2. Technology Stack

Framework and runtime:
- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- Recharts for analytics visualizations

Firebase and backend:
- Firebase Auth (email/password admin sign-in)
- Firestore (content, analytics, applications, settings)
- Firebase Admin SDK for privileged server operations
- Firestore security rules in `firestore.rules`

AI and automation:
- Genkit 1.20 + Google AI plugin
- Gemini flows for blog topic suggestion, blog generation, and career listing generation

---

## 3. Admin Access and Authentication

Admin entry points:
- `/admin/login` for sign-in
- `/admin` for dashboard and module navigation

Auth flow:
1. Admin signs in with email/password
2. Firebase client auth session is established
3. Route guard in admin layout checks auth state
4. Unauthenticated users are redirected to `/admin/login`
5. Authenticated users hitting login are redirected to `/admin`

Desktop-only enforcement:
- Admin layout blocks mobile devices and shows a device-not-supported message

Security behavior:
- Loading skeleton shown while auth state resolves
- No admin content rendered before auth check completes

---

## 4. Admin Navigation and Layout

The dashboard shell uses a collapsible sidebar with the following sections:
- Dashboard
- Blog
- Messages
- Performance
- Careers
- Applications
- Settings
- Sign Out

Dashboard views are switched in-app using an `activeView` state.

---

## 5. Module Details

### 5.1 Dashboard (Overview)

Purpose: Quick operational snapshot.

Data shown:
- Total blog posts
- Total contact messages
- Page views and unique visitors for selected range

Features:
- Date range selector: 7 / 30 / 365 days
- Trend chart for daily views
- Loading and empty-state handling

Data sources:
- Firestore collections (`blogPosts`, `contactMessages`)
- Authenticated analytics API (`GET /api/analytics/track`)

### 5.2 Blog Management

Purpose: End-to-end blog authoring lifecycle.

Capabilities:
- View all posts in a management table
- Create post via author + topic workflow
- Generate post content with AI
- Edit existing posts
- Delete posts with confirmation

Routes involved:
- `/admin/blog/create`
- `/admin/blog/editor?author=...&topic=...`
- `/admin/blog/edit/[slug]`

Editor features:
- Structured fields: title, description, tags, author, image, image hint
- Rich content area
- AI generation assist
- Publish to Firestore with slug collision handling

### 5.3 Messages (Inbox)

Purpose: Manage inbound contact submissions.

Capabilities:
- List all contact messages ordered by newest
- Copy sender email quickly
- Delete message with confirmation dialog

Collection:
- `contactMessages`

### 5.4 Performance (Analytics)

Purpose: Traffic analysis and audience insights.

Capabilities:
- KPI cards (views, unique visitors, top countries/pages)
- Daily trend visualizations
- Top pages breakdown
- Recent visitors data

Data source:
- Authenticated analytics API backed by `siteAnalytics` and `pageViews`

Important implementation detail:
- Dynamic Firestore map keys are sanitized and unsanitized for pages/countries

### 5.5 Career Listings

Purpose: Create and manage job/internship postings.

Capabilities:
- Create listing manually or with AI-assisted generation
- Edit and toggle active state
- Delete listing
- Structured fields for compensation, work mode, type, duration, requirements

Routes involved:
- `/admin/careers/create`
- `/admin/careers/edit/[id]`

Collection:
- `careerListings`

### 5.6 Job Applications

Purpose: Recruiter workflow for applicant screening.

Capabilities:
- List and filter applications
- Search by candidate details
- Resume preview/download
- Update status: pending, reviewed, shortlisted, rejected

Collection:
- `jobApplications`

### 5.7 Settings

Purpose: Administrative account management.

Capabilities:
- Add a new admin user via protected API
- Change current admin password with re-authentication
- Server-side claim assignment for new admins

API used:
- `POST /api/admin/create` (requires bearer token)

---

## 6. API Reference (Admin-Relevant)

### GET `/api/analytics/track?range=7|30|365`
- Auth required: Yes (Firebase ID token)
- Returns dashboard/performance analytics summary

### POST `/api/analytics/track`
- Auth required: No (public tracking endpoint)
- Records page views and updates daily aggregates

### POST `/api/admin/create`
- Auth required: Yes
- Creates a Firebase Auth user and assigns admin claim

### POST `/api/adam/chat`
- Public endpoint for ADAM assistant interactions

### POST `/api/adam/waitlist` and GET `/api/adam/waitlist-count`
- Waitlist management for ADAM product page

---

## 7. Firestore Collections Used by Admin

Core collections:
- `blogPosts`
- `contactMessages`
- `careerListings`
- `jobApplications`
- `pageViews`
- `siteAnalytics`
- `product-settings`
- `adam-waitlist`

Data conventions:
- `createdAt` / `updatedAt` should use `serverTimestamp()`
- Listing and application statuses are enum-constrained in TypeScript

---

## 8. Security Model

Client and route protection:
- Admin route guarded by Firebase auth state
- Login route redirect logic prevents invalid access paths
- Mobile access blocked in admin layout

Server protection:
- Sensitive admin APIs verify bearer token with Firebase Admin Auth
- Analytics read endpoints require authentication
- Admin creation endpoint protected and validates payload

Firestore rules model highlights:
- Public write allowed only where intentional (example: inbound forms/waitlists)
- Admin/privileged write flows use server-side Admin SDK
- Least-privilege pattern applied to protected collections

Secrets handling:
- Client env uses only `NEXT_PUBLIC_*` values
- Server-only credentials: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Private key newline normalization handled in server initialization

---

## 9. AI Integration Details

Flows used in admin workflows:
- `suggest-blog-topic`
- `generate-blog-post`
- `generate-career-listing`

Design principles:
- AI output is validated and parsed safely
- JSON extraction from model output handles fenced responses
- Human admins always review before publishing

---

## 10. Operational Notes

Performance and UX:
- Real-time Firestore hooks in admin views where required
- Skeleton states for load-heavy sections
- Clear empty states and actionable error toasts

Reliability:
- API handlers use try/catch and return user-friendly errors
- UI displays destructive confirmations for irreversible actions

Scalability considerations:
- Analytics uses daily aggregate documents for fast dashboard reads
- Raw event logs (`pageViews`) retained for recent-visitor inspection

---

## 11. Admin File Map (Key Files)

Admin app routes:
- `src/app/(admin)/admin/layout.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin)/admin/login/page.tsx`
- `src/app/(admin)/admin/(dashboard)/layout.tsx`
- `src/app/(admin)/admin/blog/*`
- `src/app/(admin)/admin/careers/*`

Admin feature components:
- `src/components/blog-editor.tsx`
- `src/components/performance-view.tsx`
- `src/components/settings-view.tsx`
- `src/components/job-applications-view.tsx`

Server/API and integration:
- `src/app/api/analytics/track/route.ts`
- `src/app/api/admin/create/route.ts`
- `src/firebase/client.ts`
- `src/firebase/server.ts`
- `src/ai/flows/*`

Type definitions:
- `src/types/blog.ts`
- `src/types/career.ts`
- `src/types/application.ts`
- `src/types/analytics.ts`

---

## 12. Environment Variables

Public client config:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Server-only secrets:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `UNSPLASH_ACCESS_KEY`

---

## 13. Summary

The admin panel is a full operational control center for DGEN Technologies, combining secure Firebase-backed administration, AI-assisted content generation, analytics intelligence, and structured workflow management for blogs, careers, and applications. Its architecture balances speed (real-time hooks), safety (server-validated APIs), and maintainability (typed models + modular route/component design).