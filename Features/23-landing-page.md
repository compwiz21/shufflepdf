# 23 — Landing Page (bold playful)

## Intent
Memorable, lively home page that immediately invites the user to drop a PDF.

## Files
- `src/app/page.tsx`
- `src/components/landing/Hero.tsx`, `FeatureGrid.tsx`, `Demo.tsx`, `FAQ.tsx`, `Footer.tsx`

## Sections
1. **Hero**
   - Headline: "**Shuffle your PDFs.** Edit, reorder, sign — free, no signup, no nonsense."
   - Sub: "100% browser-based. Your files never leave your computer."
   - Giant drop zone right in the hero (not below the fold). Drag a PDF → routes to `/editor` with file loaded.
   - Confetti-burst micro-interaction on hover.
2. **Feature grid** — 6 cards, slight rotation alternating: Reorder, Edit text, Sign, Merge, Split, Convert.
3. **Demo strip** — animated showcase of dragging-reordering 4 page thumbnails on loop (CSS or small Lottie).
4. **Trust strip** — "🔒 Files never leave your device · 🆓 No signup · 🚫 No watermark · ⚡ Works offline after first load"  (use SVG icons, not emoji)
5. **FAQ accordion** — 6 questions (privacy, signup, file size, browsers, mobile, source code).
6. **Footer** — links to /merge, /split, /pdf-to-jpg, /jpg-to-pdf, /pdf-to-text, /faq + copyright + GitHub link.

## Design
- Background: warm white with subtle dot-grid pattern.
- Hero has a big tilted PDF-card SVG illustration.
- Buttons: violet, big, rounded-2xl, hover-lift + shadow.
- Headings: Space Grotesk, body: Inter.
- All sections fade-up on scroll (framer-motion `whileInView`).

## Acceptance
- Lighthouse mobile performance ≥ 85.
- Hero visible without scroll on a 1366×768 laptop.
