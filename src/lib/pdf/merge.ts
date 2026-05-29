"use client";
import { PDFDocument } from "pdf-lib";
import { parseRanges } from "./split";

export interface MergeInput {
  bytes: Uint8Array;
  filename: string;
  /** 1-based page range expression. Empty = all pages. */
  rangeSpec?: string;
}

export async function mergePdfs(inputs: MergeInput[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const input of inputs) {
    const src = await PDFDocument.load(input.bytes, { ignoreEncryption: true });
    const total = src.getPageCount();
    const indices = input.rangeSpec
      ? parseRanges(input.rangeSpec, total).flat()
      : Array.from({ length: total }, (_, i) => i);
    const copied = await out.copyPages(src, indices);
    copied.forEach((p) => out.addPage(p));
  }
  return out.save();
}
