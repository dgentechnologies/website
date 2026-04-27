# Admin Panel UI, Forms, and AI Flows

This document explains admin panel UI structure, all forms, field-level behavior, and AI-assisted workflows.

## 1. UI Structure

- Root guard layout: src/app/(admin)/admin/layout.tsx
- Dashboard shell: src/app/(admin)/admin/(dashboard)/layout.tsx
- Module renderer: src/app/(admin)/admin/page.tsx

Desktop-only behavior:
- Mobile admin access is blocked with a device-not-supported message.

Sidebar modules:
- Dashboard
- Blog
- Messages
- Performance
- Careers
- Applications
- Settings
- Sign Out

## 2. Forms Inventory

## 2.1 Login Form (/admin/login)

Fields:
- email
- password

Validation:
- valid email
- min password length 6

## 2.2 Blog Create Form (/admin/blog/create)

Fields:
- author
- topic

Extras:
- Suggest Topics (AI)
- Suggested topic chips

## 2.3 Blog Editor Form (/admin/blog/editor, /admin/blog/edit/[slug])

Fields:
- author
- date
- featured image URL
- image hint
- tags
- title
- meta description
- content (HTML)

Toolbar actions:
- bold/italic/underline
- heading h1/h2/h3
- paragraph
- align left/center/right
- list/list-ordered
- quote
- link
- image tag insert

Actions:
- Generate with AI (create mode)
- Publish / Save changes

Live preview:
- Split-panel preview on large screens

## 2.4 Career Form (/admin/careers/create, /admin/careers/edit/[id])

Fields:
- position
- category
- topic
- type (job/internship)
- workMode (remote/onsite/hybrid)
- compensation (paid/unpaid/intern-paid)
- amount (conditional)
- amountSpan (conditional)
- duration
- description
- requirements
- isActive toggle

AI helper:
- Generate with AI dialog (brief input)
- Autofills full form

## 2.5 Settings - Add Admin Form

Fields:
- new admin email
- new admin password

Behavior:
- Calls protected POST /api/admin/create with token

## 2.6 Settings - Change Password Form

Fields:
- current password
- new password
- confirm new password

Behavior:
- reauthenticate
- updatePassword

## 2.7 Messages Actions

- Copy email action
- Delete message action with confirmation

## 2.8 Applications Controls

- Search input
- Status filter
- Queue selection
- Status update action

Resume handling:
- PDF preview iframe
- Non-PDF open/download fallback

## 3. AI Flow Mapping

### suggest-blog-topic
- Trigger: Suggest Topics on blog create page
- Output: 3 topics

### generate-blog-post
- Trigger: Generate with AI in blog editor
- Output: title, description, slug, tags, HTML content, image, imageHint
- Includes Unsplash image selection and fallback image logic

### generate-career-listing
- Trigger: Generate with AI in career form
- Output: full listing fields

## 4. Data Sources by Module

- Dashboard: blogPosts, contactMessages, GET /api/analytics/track
- Blog: blogPosts
- Messages: contactMessages
- Performance: GET /api/analytics/track
- Careers: careerListings
- Applications: jobApplications
- Settings: auth context + POST /api/admin/create + Firebase password APIs

## 5. UX Reliability Patterns

- Skeleton loading states
- Confirmation dialogs for destructive actions
- Toast success/error feedback
- Conditional UI for empty/error states
- AI failure handling with safe fallbacks
