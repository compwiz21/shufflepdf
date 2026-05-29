# 13 — Annotate: Image

## Intent
Insert PNG/JPG into the page. Drag, resize, rotate.

## Files
- `src/components/editor/ImageTool.tsx`

## Behavior
- Toolbar button opens file picker; or drag-drop image directly onto the canvas.
- Stored as data URL in annotation; on export, embedded with `pdfDoc.embedPng` / `embedJpg`.
- Preserves aspect ratio by default; Shift+drag to free-resize.

## Acceptance
- Insert a 200×200 PNG, resize to 100×100 → export → image is 100×100 (points) in PDF.
