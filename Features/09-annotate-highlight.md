# 09 — Annotate: Highlight

## Intent
Drag across text to highlight it (yellow by default; color-picker).

## Files
- `src/components/editor/HighlightTool.tsx`
- Uses pdfjs text layer to find character bounding rects under the drag.

## Behavior
- When tool active, mouse-drag selects underlying text using pdfjs `textLayer`.
- On mouseup: create one `highlight` annotation per text-line bounding rect (merged), 40% alpha fill.
- Click an existing highlight to delete it.

## Edge cases
- If a page has no text layer (scanned image), fall back to a free-rectangle highlight (drag to draw a rect, no text snapping).

## Acceptance
- Drag across a paragraph → yellow highlight covers it precisely along lines, not a single rect spanning multiple lines.
- Export → highlight is a true PDF annotation rendered in every reader.
