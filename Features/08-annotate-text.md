# 08 — Annotate: Text

## Intent
Click anywhere on a page to add an editable text box. Adjust font size, color, weight.

## Files
- `src/components/editor/AnnotationLayer.tsx` — fabric.js canvas overlaid on PDF page
- `src/components/editor/toolbar/TextTool.tsx`
- `src/lib/pdf/annotations.ts` — `serializeFabric(obj) -> Annotation`, `deserializeAnnotation(a) -> fabric.Object`

## Behavior
- Tool active → cursor becomes text caret; click adds `fabric.IText` at cursor with placeholder.
- Double-click to edit inline.
- Floating mini-toolbar on selection: font size (8–96), color picker, bold/italic, alignment.
- Default font: Helvetica (mapped to pdf-lib `StandardFonts.Helvetica` on export).
- Position stored in PDF user space; converted on export.

## Acceptance
- Add 3 text annotations across 2 pages, export → opened PDF shows all 3 in correct positions, sizes, colors.
