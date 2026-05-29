# 24 — Task-Specific Pages

## Routes
- `/merge` — Feature 15
- `/split` — Feature 16
- `/pdf-to-jpg` — Feature 17
- `/jpg-to-pdf` — Feature 18
- `/pdf-to-text` — Feature 19

## Template per page
- H1 with task name + benefit ("Merge PDFs online — free, no signup")
- Drop zone (reuses `<DropZone>` from editor)
- Task UI (per Feature spec)
- 3-card explainer below: "Why use ShufflePDF for X?" (privacy / speed / free)
- Mini-FAQ tailored to the task (3 questions each)
- Cross-link card row at bottom: "Looking for ___? Try our other free tools" with thumbnails of sibling pages.

## SEO
- Unique `<title>`, `<meta description>`, JSON-LD `SoftwareApplication` schema per page.
- Each page rendered at build time (statically) — Next.js `generateMetadata`.

## Acceptance
- View-source on each page shows unique metadata.
- `/merge` works end-to-end without ever visiting `/editor`.
