# 07 — Duplicate Page(s)

## Intent
Clone selected pages, inserting copies directly after the originals.

## Files
- `src/store/editorStore.ts` — `duplicatePages(ids: PageId[])`

## Mechanics
- Each duplicate is a new `PageState` referencing the SAME `sourceDocId` + `sourceIndex` but with a fresh `id`.
- Annotations are deep-cloned (each with a new annotation id).
- Inserted immediately after the source page in document order.

## Acceptance
- Duplicate page 3 → page count grows by 1; page 4 is now a copy of original page 3.
- Annotations on the source are also on the duplicate but editing one does not affect the other.
