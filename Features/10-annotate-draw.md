# 10 — Annotate: Freehand Draw

## Intent
Pen tool — freehand drawing with color and thickness.

## Files
- `src/components/editor/DrawTool.tsx`
- fabric.js `PencilBrush` on the active page's canvas.

## Behavior
- Pick color + thickness (1–12 px).
- Each stroke → one `draw` annotation (SVG path string).
- On export: path is sampled into pdf-lib `drawSvgPath` with the matching stroke.

## Acceptance
- Draw a signature-like squiggle → renders identically on screen and in exported PDF.
