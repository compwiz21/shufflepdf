"use client";
import { getPdfjsDocument } from "./render";
import { uid } from "@/lib/utils";

export type ImageFormat = "image/png" | "image/jpeg";

export interface ExportImagesOptions {
  format: ImageFormat;
  scale: number; // 1, 2, 3 ...
  quality?: number; // jpeg only, 0..1
}

export async function pdfToImages(
  bytes: Uint8Array,
  opts: ExportImagesOptions,
): Promise<Array<{ filename: string; blob: Blob }>> {
  const doc = await getPdfjsDocument(uid("export"), bytes);
  const ext = opts.format === "image/jpeg" ? "jpg" : "png";
  const out: Array<{ filename: string; blob: Blob }> = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: opts.scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        opts.format,
        opts.quality ?? 0.92,
      ),
    );
    out.push({
      filename: `page-${String(i).padStart(3, "0")}.${ext}`,
      blob,
    });
  }
  return out;
}
