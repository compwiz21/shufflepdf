# 01 — PDF Loader (drop zone, file picker, multi-file)

## Intent
Accept PDF (and image) files via drag-drop, click-to-pick, or paste. Each file becomes a `SourceDoc` and contributes its pages to the working document.

## Files
- `src/components/editor/DropZone.tsx` — UI
- `src/lib/pdf/loader.ts` — `loadPdfBytes(bytes, filename) -> Promise<{ source: SourceDoc; pages: PageState[] }>`
- `src/store/editorStore.ts` — `addSource(file: File)` action

## Behavior
- Accepts `.pdf`, `.jpg`, `.jpeg`, `.png`
- For PDFs: parse with `PDFDocument.load(bytes)` to get page count, then create one `PageState` per page with `rotation = 0` and `annotations = []`.
- For images: defer to `importImages.ts` (Feature 18) — it builds a single-page PDF per image.
- Drop multiple files at once → all appended in drop order.
- Show progress for large PDFs (spinner with page count).
- Reject files > 200 MB with a friendly toast.

## Edge cases
- Encrypted PDF → pdf-lib throws → catch, show "This PDF is password-protected. Decrypt it first." toast.
- Corrupted bytes → catch, show generic load error.
- Pasting (Ctrl+V) on the editor route should trigger the same path if clipboard contains a file.

## Acceptance
- Dropping `sample.pdf` (10 pages) populates the thumbnails sidebar with 10 entries.
- Dropping a second PDF appends its pages.
- File picker (button) does the same.
