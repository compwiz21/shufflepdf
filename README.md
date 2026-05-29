# ShufflePDF

A free, private, browser-based PDF editor. No signups, no watermarks, no uploads — every page operation runs locally in your browser.

🌐 **Live**: https://shufflepdf.com

## What it does

- **Reorder pages** — drag thumbnails to any order (the namesake feature)
- **Add / delete / duplicate / rotate** pages
- **Annotate** — text, highlight, freehand pen, shapes, signature, image, checkbox
- **Merge** PDFs and **split** by page range or fixed chunk
- **Convert** PDF ↔ JPG/PNG, **extract text** from PDFs
- **Undo/redo**, keyboard shortcuts, multi-select

## Stack

- Next.js 16 (App Router, standalone output) · TypeScript · Tailwind v4
- `pdf-lib` (mutations) + `pdfjs-dist` (rendering)
- `@dnd-kit` (drag-reorder) · `zustand` (state) · `framer-motion` (landing)

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Deploy (this repo's setup)

The app is dockerized and proxied by host nginx, with HTTPS via Let's Encrypt.

```bash
# 1. Build + run the container (host binds 127.0.0.1:3010 -> container :3000)
docker compose build
docker compose up -d

# 2. Install nginx site (HTTP only at first)
sudo cp nginx/shufflepdf.conf /etc/nginx/sites-available/shufflepdf
sudo ln -sf /etc/nginx/sites-available/shufflepdf /etc/nginx/sites-enabled/shufflepdf
sudo nginx -t && sudo systemctl reload nginx

# 3. Get certificates (only after DNS for shufflepdf.com + www points here)
sudo certbot --nginx -d shufflepdf.com -d www.shufflepdf.com \
  --non-interactive --agree-tos -m you@example.com --redirect

# 4. Verify
curl -sI https://shufflepdf.com
```

### Updates

```bash
git pull
docker compose build
docker compose up -d
```

## Architecture

- **`Features/`** — one spec markdown per feature. The build was driven from these. Source of truth for behavior.
- **`src/lib/pdf/`** — pure PDF manipulation primitives. No React, no DOM beyond canvas.
- **`src/store/editorStore.ts`** — Zustand store with built-in undo/redo history stack.
- **`src/components/editor/`** — Editor shell, thumbnail sidebar, viewport, annotation layer, toolbar.
- **`src/components/tools/`** — Standalone tool components (merge / split / convert).
- **`src/app/`** — Next.js pages — landing + editor + 5 task pages + FAQ + sitemap/robots.

## Privacy

The app is 100% client-side. There is no backend. Your PDFs never leave your computer.

## License

MIT
