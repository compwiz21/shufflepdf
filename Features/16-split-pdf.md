# 16 — Split PDF

## Intent
Extract page ranges from a PDF into one or more new PDFs.

## Files
- `src/app/split/page.tsx`
- `src/lib/pdf/split.ts` — `parseRanges(spec: string, max: number) -> number[][]`, `splitPdf(bytes, ranges) -> Uint8Array[]`

## Behavior
- Load one PDF → show thumbnails with checkboxes.
- Two modes:
  - **Ranges**: text input like `1-3, 5, 7-9` → 3 output PDFs (or one combined output of selected pages).
  - **Every N pages**: split into chunks of N.
- If multiple outputs → zip them with jszip and download `split.zip`.

## Edge cases
- Parser must reject `0`, negatives, and out-of-range; show error inline.
- Whitespace forgiving.

## Acceptance
- 10-page PDF, ranges `1-3, 5, 8-10` → zip contains `pages-1-3.pdf`, `page-5.pdf`, `pages-8-10.pdf`.
- "Every 2" on 10-page PDF → 5 output PDFs.
