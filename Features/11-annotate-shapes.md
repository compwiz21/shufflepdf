# 11 — Annotate: Shapes (rect, ellipse, line, arrow)

## Intent
Drag to draw geometric shapes. Editable stroke/fill/thickness.

## Files
- `src/components/editor/ShapeTool.tsx`

## Behavior
- Sub-toolbar: rectangle, ellipse, line, arrow.
- Hold Shift for square / circle / horizontal-vertical-snap line.
- Stored as annotation `kind: 'rect' | 'ellipse' | 'line'` (arrow = line + endpoint flag — keep simple).
- Resize handles after drawn.

## Acceptance
- Draw a red rect, blue ellipse, black line → all three render identically in exported PDF.
