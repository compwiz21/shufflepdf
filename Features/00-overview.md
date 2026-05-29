# 00 — Overview & Conventions

ShufflePDF is a 100% client-side PDF editor. No uploads. No accounts. No watermarks.

## Stack
- **Next.js 15** (App Router, `output: 'standalone'`) + **TypeScript** + **Tailwind v4**
- **pdf-lib** — mutate PDFs (pages, embed images, flatten annotations)
- **pdfjs-dist** + **react-pdf** — render PDF pages to canvas
- **@dnd-kit/sortable** — drag-reorder thumbnails
- **fabric** v7 — annotation overlay (text/draw/shapes/image/signature)
- **zustand** — editor state + history stack
- **jszip** / **file-saver** — multi-file downloads
- **framer-motion** — landing micro-interactions
- **lucide-react** — icons

## Design tokens (bold playful)
- Primary: `#7C3AED` (vibrant violet)
- Accent: `#FBBF24` (sunshine amber)
- Success: `#10B981` (emerald)
- Background: `#FAFAF9` (warm white)
- Ink: `#0F172A`
- Rounded: `2xl` on cards/buttons, big drop-shadows, generous whitespace
- Fonts: Inter (UI), Space Grotesk for display headings
- Vibe: confetti accents, slight rotations on cards, big emoji-free SVG illustrations

## Folder layout (`src/`)
```
app/
  layout.tsx, page.tsx (landing)
  editor/page.tsx
  merge/page.tsx, split/page.tsx
  pdf-to-jpg/page.tsx, jpg-to-pdf/page.tsx, pdf-to-text/page.tsx
  faq/page.tsx
components/
  editor/   (Toolbar, PageThumbs, CanvasViewport, AnnotationLayer, DropZone)
  landing/  (Hero, FeatureGrid, FAQ, Footer)
  ui/       (Button, Card, Dialog primitives)
lib/
  pdf/      (loader, pageOps, merge, split, exportImages, importImages, extractText, flatten)
  utils.ts  (cn helper)
store/
  editorStore.ts
```

## Shared types (`src/lib/pdf/types.ts`)
```ts
export type PageId = string; // stable uuid, survives reorder
export type PageRotation = 0 | 90 | 180 | 270;
export interface PageState {
  id: PageId;
  sourceDocId: string;       // which loaded PDFDocument it came from
  sourceIndex: number;       // original 0-based index in source
  rotation: PageRotation;    // user-applied rotation delta
  annotations: Annotation[]; // fabric JSON objects keyed to this page
}
export interface SourceDoc {
  id: string;
  bytes: Uint8Array;         // original file bytes (kept for export)
  filename: string;
}
export type Annotation =
  | { kind: 'text'; id: string; x: number; y: number; w: number; h: number; text: string; fontSize: number; color: string }
  | { kind: 'highlight'; id: string; x: number; y: number; w: number; h: number; color: string }
  | { kind: 'draw'; id: string; path: string; stroke: string; thickness: number }
  | { kind: 'rect' | 'ellipse' | 'line'; id: string; x: number; y: number; w: number; h: number; stroke: string; fill?: string; thickness: number }
  | { kind: 'image'; id: string; x: number; y: number; w: number; h: number; dataUrl: string }
  | { kind: 'signature'; id: string; x: number; y: number; w: number; h: number; dataUrl: string }
  | { kind: 'checkbox'; id: string; x: number; y: number; size: number; checked: boolean };
```

## Coordinate system
All annotation coordinates are stored in **PDF user space** (origin bottom-left, points = 1/72 inch).
Display layers convert to/from screen pixels using `pdfPageProxy.getViewport({ scale })`.

## Acceptance contract (applies to every feature)
1. Operation does not mutate `SourceDoc.bytes`.
2. State changes go through Zustand actions so they participate in undo/redo.
3. Export pipeline (`flatten.ts`) is the only thing that produces a downloadable PDF — never reach into pdf-lib from a UI component.
4. No network calls. ESLint rule forbids `fetch`/`axios` in `src/lib/pdf/*`.
