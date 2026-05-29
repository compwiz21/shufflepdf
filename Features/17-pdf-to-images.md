# 17 — PDF → Images

## Intent
Convert each PDF page to a JPG or PNG. Single page → direct download; multi-page → zip.

## Files
- `src/app/pdf-to-jpg/page.tsx`
- `src/lib/pdf/exportImages.ts` — `pdfToImages(bytes, { format, scale }) -> Promise<Blob[]>`

## Behavior
- Render each page via pdfjs to an offscreen canvas at chosen scale (1x / 2x / 3x = ~72/144/216 DPI).
- `canvas.toBlob('image/jpeg' | 'image/png')`.
- Multi-page → jszip → `{filename}.zip`.

## Acceptance
- 3-page PDF at 2x → zip with 3 JPGs around 1700×2200 px (Letter at 2x).
