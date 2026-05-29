# 05 — Delete Page(s)

## Intent
Remove one or more pages from the working document.

## Files
- `src/store/editorStore.ts` — `deletePages(ids: PageId[])`
- Triggered from thumbnail context menu, Delete key, or toolbar trash button.

## Behavior
- Confirms with a small inline undo toast ("Deleted 3 pages. Undo") instead of a modal — undo via toast button OR Cmd/Ctrl+Z.
- If all pages would be deleted, refuse and show toast "Can't delete the last page".

## Acceptance
- Select pages 2 and 4, press Delete → pages array goes from 5 to 3 with original 1, 3, 5 preserved in order.
- Cmd/Ctrl+Z restores.
