# 18 — Images → PDF

## Intent
Combine JPG/PNG files into a single PDF (one image per page).

## Files
- `src/app/jpg-to-pdf/page.tsx`
- `src/lib/pdf/importImages.ts` — `imagesToPdf(files: File[], opts) -> Uint8Array`

## Behavior
- Drop images → reorderable list with previews.
- Options: page size (Fit-to-image / A4 / Letter), orientation, margin (0/10/25 px).
- Embed each with `pdfDoc.embedPng` or `embedJpg` and scale-fit to page.

## Acceptance
- Drop 5 photos → reorder → download → PDF has 5 pages, images visible at intended dimensions.
