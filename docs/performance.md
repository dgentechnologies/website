# Performance & Observability

Guidance for integrating performance metrics and observability into the admin Performance view.

## Metrics to Track

- Web Vitals: LCP, FID, CLS, INP
- API Latency: Unsplash fetch, Firestore CRUD
- Build Size: Next.js bundle sizes
- Uptime: Hosting/platform status

## Integration Ideas

- Vercel Speed Insights: `@vercel/speed-insights`
- Web Analytics: `@vercel/analytics` or GA4
- Lighthouse CI: Automate audits on PRs

## Example Setup

```ts
// src/app/layout.tsx (snippet)
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Admin Performance View

- Display simple charts (e.g., Recharts) for traffic and latency.
- Show latest Web Vitals if available; else provide helpful placeholders.
- Link to external dashboards (Vercel, GA4).
