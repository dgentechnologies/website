# Architecture

## System Overview

```mermaid
C4Context
title DGEN Website - System Context

Person(admin, "Admin User")
Person(visitor, "Site Visitor")
System(webapp, "Next.js WebApp", "Public website and admin dashboard")
SystemDb(firestore, "Firebase Firestore", "Blog posts, contact messages")
System(genkit, "Genkit Flows", "AI content generation")
System(unsplash, "Unsplash API", "Dynamic images")
System(gemini, "Google Gemini", "LLM provider")

Rel(visitor, webapp, "Browse pages, read blog")
Rel(admin, webapp, "Manage content via admin dashboard")
Rel(webapp, firestore, "CRUD blogPosts, contactMessages")
Rel(webapp, unsplash, "Fetch images by hints")
Rel(webapp, genkit, "Invoke flows for topic/post generation")
Rel(genkit, gemini, "LLM inference")
```

## Admin Dashboard Sequence

```mermaid
sequenceDiagram
  participant A as Admin
  participant W as Admin UI (Next.js)
  participant F as Firestore
  participant G as Genkit Flows
  participant L as Gemini
  participant U as Unsplash

  A->>W: Create Blog (AI)
  W->>G: generate-blog-post(topic, author)
  G->>L: Prompt + constraints
  L-->>G: Generated content
  G-->>W: Title, content, tags, imageHints
  W->>U: Fetch image by hints
  U-->>W: Image URL
  W->>F: Save BlogPost (slug)
  F-->>W: Success
```

## Data Model (ERD)

```mermaid
erDiagram
  BLOGPOSTS {
    string slug PK
    string title
    string content
    string author
    string[] tags
    string imageUrl
    date createdAt
    date updatedAt
  }
  CONTACTMESSAGES {
    string id PK
    string name
    string email
    string message
    date createdAt
  }
```

## Code Layout

- `src/app` — Public pages and app router
- `src/app/(admin)` — Admin dashboard routes and layout
- `src/components/ui` — ShadCN-based UI components
- `src/ai/flows` — Genkit flows for AI operations
- `firebase/` — Client/server Firebase setups
