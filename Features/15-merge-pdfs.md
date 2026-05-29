# 15 — Merge PDFs

## Intent
Combine multiple PDFs into one. Reorderable file list before merge.

## Files
- `src/app/merge/page.tsx` — landing + tool
- `src/lib/pdf/merge.ts` — `mergePdfs(sources: Array<{ bytes: Uint8Array; pageRange?: number[] }>) -> Uint8Array`

## Behavior
- Drop multiple PDFs → list with thumbnails.
- Drag to reorder; per-file page-range picker ("1-3,5"); remove file.
- "Merge & Download" → single combined PDF.
- Loads `MergeMyDoc.pdf` (or first filename + "-merged.pdf") as default download name.

## Acceptance
- Merge `a.pdf` (3 pages) + `b.pdf` (2 pages) → output has 5 pages in order.
- Apply page range "1,3" on `a.pdf` + all of `b.pdf` → output has 4 pages.
