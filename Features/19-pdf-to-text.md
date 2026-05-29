# 19 — PDF → Text

## Intent
Extract plain text from a PDF. No OCR (image-only PDFs will produce empty output — communicate this clearly).

## Files
- `src/app/pdf-to-text/page.tsx`
- `src/lib/pdf/extractText.ts` — `extractText(bytes) -> Promise<string>`

## Behavior
- Loop pages, call `page.getTextContent()`, concatenate `items[].str` joined by spaces, pages separated by `\n\n--- Page N ---\n\n`.
- Show extracted text in a textarea preview; copy-to-clipboard button; download `.txt`.

## Edge cases
- Image-only PDF → show notice "No text found — this PDF is image-based. OCR is not yet supported."

## Acceptance
- Text PDF → extracted text matches Adobe Acrobat's text export (order-of-magnitude).
- Image-only PDF → notice shown, no error.
