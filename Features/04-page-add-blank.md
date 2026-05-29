# 04 — Add Blank Page

## Intent
Insert a blank page at any position. Choose size (match-current / Letter / A4 / Legal).

## Files
- `src/lib/pdf/pageOps.ts` — `createBlankPage(size, orientation) -> PageState`
- `src/store/editorStore.ts` — `insertBlank(afterIndex, size, orientation)`
- `src/components/editor/PageThumbs.tsx` — `+` hover-button between thumbs

## Mechanics
- Blank pages live in an in-memory "scratch" `PDFDocument` (one per session) so they have real bytes when exported.
- New `PageState { sourceDocId: 'scratch', sourceIndex: <added page index> }`.

## Sizes (points)
- Letter: 612 × 792
- A4: 595 × 842
- Legal: 612 × 1008
- Match: use current page's mediaBox

## Acceptance
- Click `+` between pages 3 and 4 → modal asks size → blank page appears as new page 4.
- Export → blank page is present and correctly sized.
