# 20 — Download & Flatten

## Intent
The ONE export pipeline. Takes current editor state (`pages[]` + their annotations + rotations) and produces a single downloadable PDF with everything baked in.

## Files
- `src/lib/pdf/flatten.ts` — `exportPdf(state: EditorState) -> Promise<Uint8Array>`
- `src/components/editor/DownloadButton.tsx`

## Algorithm
```
const out = await PDFDocument.create();
const sourceDocs = new Map<docId, PDFDocument>();
for each pageState in state.pages:
  const src = sourceDocs.get(pageState.sourceDocId) || await load(...);
  const [copied] = await out.copyPages(src, [pageState.sourceIndex]);
  copied.setRotation(degrees((copied.getRotation().angle + pageState.rotation) % 360));
  out.addPage(copied);
  for each annotation:
    drawAnnotation(copied, annotation);   // text via drawText, image via drawImage, etc.
return await out.save();
```

## Annotation rendering (per type)
- `text` → `page.drawText(text, { x, y: page.height - y - h, size, color, font })`
- `highlight` → `page.drawRectangle({ x, y, width, height, color: rgb(...), opacity: 0.4 })`
- `draw` → `page.drawSvgPath(path, { borderColor, borderWidth })`
- `rect / ellipse / line` → corresponding pdf-lib draw methods
- `image / signature` → embed PNG/JPG, `page.drawImage(...)`
- `checkbox` → `drawRectangle` outline + `drawSvgPath` checkmark if checked

## Acceptance
- Round-trip: load → annotate → download → reopen the downloaded file → all annotations and page changes baked in, opens in Adobe / Preview / Chrome.
