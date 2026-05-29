# 26 — SEO & Metadata

## Files
- `src/app/layout.tsx` — global metadata + OG defaults
- `public/robots.txt`, `public/sitemap.xml` (or `app/sitemap.ts` for dynamic)
- `app/opengraph-image.tsx` (Next.js auto-OG)

## Global metadata
- title template: `%s — ShufflePDF`
- default title: `ShufflePDF — Free PDF Editor in Your Browser`
- description: `Edit, reorder, merge, split, and sign PDFs online. 100% free, no signup, files never leave your computer.`
- OG image: 1200×630 bold-branded
- Twitter card: `summary_large_image`
- Favicon: violet "S" icon, multi-size

## Sitemap routes
`/`, `/editor`, `/merge`, `/split`, `/pdf-to-jpg`, `/jpg-to-pdf`, `/pdf-to-text`, `/faq`

## robots.txt
```
User-agent: *
Allow: /
Sitemap: https://shufflepdf.com/sitemap.xml
```

## JSON-LD
- Landing: `WebApplication`
- Each task page: `SoftwareApplication`
- FAQ: `FAQPage`

## Acceptance
- `curl https://shufflepdf.com/sitemap.xml` returns all 8 URLs.
- Google Rich Results Test passes for `/`, `/merge`, `/faq`.
