# 02 — Page Thumbnails Sidebar

## Intent
Left sidebar shows a vertically scrolling list of page thumbnails. Selecting one focuses it in the main viewport.

## Files
- `src/components/editor/PageThumbs.tsx`
- `src/components/editor/PageThumb.tsx` (single thumb, memoized)
- `src/lib/pdf/render.ts` — `renderPageToCanvas(doc, pageIndex, scale)` (shared with viewport)

## Behavior
- Thumb size: 140×180 px target, scaled to actual page aspect ratio.
- Render via `pdfjs-dist` at low scale (e.g. `scale = 0.25`).
- Lazy-render off-screen thumbs with `IntersectionObserver` (don't render 500 pages at once).
- Show 1-based page number badge bottom-right.
- Active page highlighted with violet ring.
- Multi-select: Cmd/Ctrl-click toggles, Shift-click ranges. Selected pages get an amber ring.

## Edge cases
- Rotation: applies CSS `transform: rotate(...)` for instant feedback (re-render not required just for rotation display).
- Annotations: small overlay dot in corner if page has annotations.

## Acceptance
- Scrolling through 100 pages stays smooth (no jank, no all-at-once renders).
- Clicking thumb #5 scrolls viewport to page 5.
