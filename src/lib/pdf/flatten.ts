"use client";
import {
  PDFDocument,
  StandardFonts,
  degrees,
  rgb,
  type PDFPage,
} from "pdf-lib";
import type {
  Annotation,
  PageState,
  SourceDoc,
} from "./types";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(h, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
  };
}
const c = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return rgb(r, g, b);
};

async function drawAnnotation(
  out: PDFDocument,
  page: PDFPage,
  ann: Annotation,
) {
  const { height } = page.getSize();
  // Coords in our state are PDF user-space with y measured from top — convert
  const toY = (y: number, h = 0) => height - y - h;

  switch (ann.kind) {
    case "text": {
      const font = await out.embedFont(StandardFonts.Helvetica);
      page.drawText(ann.text, {
        x: ann.x,
        y: toY(ann.y, ann.fontSize),
        size: ann.fontSize,
        color: c(ann.color),
        font,
      });
      break;
    }
    case "highlight": {
      page.drawRectangle({
        x: ann.x,
        y: toY(ann.y, ann.h),
        width: ann.w,
        height: ann.h,
        color: c(ann.color),
        opacity: 0.4,
      });
      break;
    }
    case "draw": {
      if (ann.points.length < 2) break;
      const [first, ...rest] = ann.points;
      let d = `M ${first[0]} ${toY(first[1])}`;
      for (const [x, y] of rest) d += ` L ${x} ${toY(y)}`;
      page.drawSvgPath(d, {
        borderColor: c(ann.stroke),
        borderWidth: ann.thickness,
      });
      break;
    }
    case "rect": {
      page.drawRectangle({
        x: ann.x,
        y: toY(ann.y, ann.h),
        width: ann.w,
        height: ann.h,
        borderColor: c(ann.stroke),
        borderWidth: ann.thickness,
        color: ann.fill ? c(ann.fill) : undefined,
        opacity: ann.fill ? 0.5 : undefined,
      });
      break;
    }
    case "ellipse": {
      page.drawEllipse({
        x: ann.x + ann.w / 2,
        y: toY(ann.y + ann.h / 2),
        xScale: ann.w / 2,
        yScale: ann.h / 2,
        borderColor: c(ann.stroke),
        borderWidth: ann.thickness,
        color: ann.fill ? c(ann.fill) : undefined,
        opacity: ann.fill ? 0.5 : undefined,
      });
      break;
    }
    case "line": {
      page.drawLine({
        start: { x: ann.x, y: toY(ann.y) },
        end: { x: ann.x + ann.w, y: toY(ann.y + ann.h) },
        thickness: ann.thickness,
        color: c(ann.stroke),
      });
      break;
    }
    case "image":
    case "signature": {
      const dataUrl = ann.dataUrl;
      const isJpg = dataUrl.startsWith("data:image/jpeg");
      const base64 = dataUrl.split(",")[1];
      const bytes = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));
      const img = isJpg
        ? await out.embedJpg(bytes)
        : await out.embedPng(bytes);
      page.drawImage(img, {
        x: ann.x,
        y: toY(ann.y, ann.h),
        width: ann.w,
        height: ann.h,
      });
      break;
    }
    case "checkbox": {
      page.drawRectangle({
        x: ann.x,
        y: toY(ann.y, ann.size),
        width: ann.size,
        height: ann.size,
        borderColor: c("#0f172a"),
        borderWidth: 1.2,
      });
      if (ann.checked) {
        const y0 = toY(ann.y, ann.size);
        const s = ann.size;
        const d = `M ${ann.x + s * 0.2} ${y0 + s * 0.5} L ${ann.x + s * 0.45} ${y0 + s * 0.25} L ${ann.x + s * 0.85} ${y0 + s * 0.8}`;
        page.drawSvgPath(d, { borderColor: c("#0f172a"), borderWidth: 1.6 });
      }
      break;
    }
  }
}

export async function exportPdf(state: {
  sources: Record<string, SourceDoc>;
  pages: PageState[];
}): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  const loaded = new Map<string, PDFDocument>();

  // Load each unique source doc once
  for (const id in state.sources) {
    const src = state.sources[id];
    loaded.set(id, await PDFDocument.load(src.bytes, { ignoreEncryption: true }));
  }

  for (const pageState of state.pages) {
    const src = loaded.get(pageState.sourceDocId);
    if (!src) continue;
    const [copied] = await out.copyPages(src, [pageState.sourceIndex]);
    if (pageState.rotation !== 0) {
      const existing = copied.getRotation().angle;
      copied.setRotation(degrees((existing + pageState.rotation) % 360));
    }
    out.addPage(copied);
    for (const ann of pageState.annotations) {
      await drawAnnotation(out, copied, ann);
    }
  }

  return await out.save();
}

export function suggestedFilename(sources: Record<string, SourceDoc>): string {
  const names = Object.values(sources).map((s) => s.filename);
  if (names.length === 0) return "shufflepdf.pdf";
  const first = names[0].replace(/\.pdf$/i, "");
  return names.length === 1
    ? `${first} (edited).pdf`
    : `${first}-merged.pdf`;
}
