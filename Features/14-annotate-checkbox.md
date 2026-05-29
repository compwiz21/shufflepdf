# 14 — Annotate: Checkbox

## Intent
Click to place a checkbox; click again to toggle checked/unchecked. Useful for filling forms that lack interactive widgets.

## Files
- `src/components/editor/CheckboxTool.tsx`

## Behavior
- Click on page → places 16×16 pt checkbox.
- Click an existing checkbox to toggle.
- On export: drawn as a square outline with optional checkmark vector path inside.

## Acceptance
- Place 5 checkboxes, toggle 3 → export → 3 are checked in the PDF.
