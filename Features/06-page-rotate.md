# 06 — Rotate Page(s)

## Intent
Rotate selected pages by 90° (left or right). Persists to the exported PDF.

## Files
- `src/store/editorStore.ts` — `rotatePages(ids: PageId[], delta: 90 | -90)`
- `src/lib/pdf/flatten.ts` — applies `page.setRotation(degrees((source + delta) % 360))` on export
- UI: toolbar button + `R` keyboard shortcut (right) / `Shift+R` (left)

## Mechanics
- Display: CSS transform on thumb + viewport canvas.
- State: store `rotation` as 0/90/180/270 (normalized).
- Export: pdf-lib accumulates the page's existing rotation + user delta.

## Acceptance
- Rotate page 2 right twice → it appears upside down.
- Export → opened PDF shows the rotation baked in.
- Undo reverses one rotation step at a time.
