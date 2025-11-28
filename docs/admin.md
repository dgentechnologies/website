# Admin Dashboard

The admin dashboard provides a premium, professional interface for managing site content.

## Layout & Navigation

- Sidebar options:
  - Dashboard
  - Blog
  - Messages
  - Performance
  - Settings
- Top bar with mobile trigger and brand.
- Content area renders the active view.

```mermaid
flowchart LR
  S[Sidebar] --> D[Dashboard View]
  S --> B[Blog View]
  S --> M[Messages View]
  S --> P[Performance View]
  S --> T[Settings View]
```

## Views

- Dashboard: KPIs for posts, messages, and visits.
- Blog: List, edit, delete posts; AI-powered creation.
- Messages: Contact form submissions with actions.
- Performance: Placeholder for analytics and uptime (extensible).
- Settings: Placeholder for admin preferences and site config.

## Blog Editing UX

```mermaid
sequenceDiagram
  participant A as Admin
  participant UI as Admin UI (Blog)
  participant F as Firestore

  A->>UI: Open Blog view
  UI->>F: List blogPosts (orderBy createdAt)
  F-->>UI: Posts data
  A->>UI: Edit post (slug)
  UI->>F: Update blogPosts/{slug}
  F-->>UI: Success
  A->>UI: Delete post
  UI->>F: delete(blogPosts/{slug})
  F-->>UI: Success
```

> [!NOTE]
> AI creation flow is documented in `docs/architecture.md` under the Admin Dashboard Sequence.

## Authentication

- Routes under `src/app/(admin)` are gated by Firebase Authentication.
- Unauthenticated users are redirected to `/admin/login`.

## File References

- `src/app/(admin)/admin/(dashboard)/layout.tsx` — Admin shell + sidebar.
- `src/app/(admin)/admin/page.tsx` — Root page; handles view switching.
- `src/types/blog.ts` — Blog type definitions.
- `src/firebase/client.ts` — Firebase client initialization.
