# 12 — Annotate: Signature

## Intent
Add a reusable signature. Draw, type, or upload.

## Files
- `src/components/editor/SignatureDialog.tsx` — modal with 3 tabs
- `src/lib/signatureStore.ts` — `localStorage` persistence of saved signatures

## Behavior
- **Draw tab**: canvas with pencil; stored as transparent-bg PNG dataURL.
- **Type tab**: 6 cursive-style font options (Caveat, Allura, Dancing Script, Great Vibes, Sacramento, Pacifico — via Google Fonts).
- **Upload tab**: accept PNG/JPG; auto-trim white background option.
- After save: signature placed at cursor, resizable; saved to `localStorage` for reuse this session and future visits.

## Edge cases
- Clearing browser storage clears signatures. No server backup.
- Multiple saved signatures listed in a dropdown.

## Acceptance
- Draw a sig → place on page 1 → drag-resize → export → flat image embedded in PDF.
- Refresh page → "Saved signatures" still lists it.
