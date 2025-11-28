# API & AI Flows

This project uses Next.js API routes and Genkit flows to power AI features and integrations.

## Next.js API Routes

### `GET /api/unsplash`
Fetches an image from Unsplash using provided `query` hints.

- Query params:
  - `query` (string): Search keywords.
- Response:
  - `imageUrl` (string): Selected image URL.

```json
{
  "imageUrl": "https://images.unsplash.com/..."
}
```

## Genkit Flows

- `src/ai/flows/suggest-blog-topic.ts`
  - Purpose: Suggest trending blog topics based on current content and target audience.
  - Input:
    - `context` (string): Optional description or niche focus.
  - Output:
    - `topics` (string[]): Array of suggested titles.

- `src/ai/flows/generate-blog-post.ts`
  - Purpose: Generate a complete blog post (title, content, tags, image hints).
  - Input:
    - `topic` (string): Desired post topic.
    - `author` (string): Persona or author name.
  - Output:
    - `title` (string)
    - `content` (string)
    - `tags` (string[])
    - `imageHints` (string[])

## Example Usage (Admin UI)

```ts
// Pseudocode example
const { title, content, tags, imageHints } = await generateBlogPost({ topic, author })
const image = await fetch(`/api/unsplash?query=${encodeURIComponent(imageHints.join(', '))}`).then(r => r.json())
await saveToFirestore({ slug, title, content, tags, imageUrl: image.imageUrl })
```
