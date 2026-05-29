"use client";
import { PDFDocument, PageSizes } from "pdf-lib";

export type ImagePageSize = "fit" | "Letter" | "A4" | "Legal";

export interface ImagesToPdfOptions {
  pageSize: ImagePageSize;
  margin: number; // in points
}

export async function imagesToPdf(
  files: File[],
  opts: ImagesToPdfOptions,
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isJpg = /\.(jpe?g)$/i.test(file.name) || file.type === "image/jpeg";
    const img = isJpg ? await out.embedJpg(bytes) : await out.embedPng(bytes);

    let pageW: number, pageH: number;
    if (opts.pageSize === "fit") {
      pageW = img.width + opts.margin * 2;
      pageH = img.height + opts.margin * 2;
    } else {
      const [w, h] = PageSizes[opts.pageSize as keyof typeof PageSizes];
      pageW = w;
      pageH = h;
    }
    const page = out.addPage([pageW, pageH]);

    const availW = pageW - opts.margin * 2;
    const availH = pageH - opts.margin * 2;
    const scale = Math.min(availW / img.width, availH / img.height, 1);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    page.drawImage(img, {
      x: (pageW - drawW) / 2,
      y: (pageH - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  }
  return out.save();
}
