"use client";
import { PDFDocument } from "pdf-lib";

/**
 * Parse a page range expression like "1-3, 5, 8-10" into a list of 0-based
 * index groups (one per comma-separated token).
 *
 * @throws Error with a human-readable message on invalid input
 */
export function parseRanges(spec: string, max: number): number[][] {
  if (!spec.trim()) throw new Error("Page range cannot be empty.");
  const groups: number[][] = [];
  const tokens = spec
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) throw new Error("Page range cannot be empty.");
  for (const tok of tokens) {
    if (/^\d+$/.test(tok)) {
      const n = Number(tok);
      if (n < 1 || n > max) throw new Error(`Page ${n} is out of range (1–${max}).`);
      groups.push([n - 1]);
    } else if (/^\d+\s*-\s*\d+$/.test(tok)) {
      const [aStr, bStr] = tok.split("-");
      const a = Number(aStr);
      const b = Number(bStr);
      if (a < 1 || b < 1 || a > max || b > max) {
        throw new Error(`Range ${tok} is out of bounds (1–${max}).`);
      }
      if (a > b) throw new Error(`Range ${tok} is reversed.`);
      const arr: number[] = [];
      for (let i = a; i <= b; i++) arr.push(i - 1);
      groups.push(arr);
    } else {
      throw new Error(`Could not parse "${tok}".`);
    }
  }
  return groups;
}

export interface SplitOutput {
  filename: string;
  bytes: Uint8Array;
}

export async function splitPdfByRanges(
  bytes: Uint8Array,
  spec: string,
  baseFilename: string,
): Promise<SplitOutput[]> {
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const groups = parseRanges(spec, total);
  const base = baseFilename.replace(/\.pdf$/i, "");
  const out: SplitOutput[] = [];
  for (const group of groups) {
    const dst = await PDFDocument.create();
    const copied = await dst.copyPages(src, group);
    copied.forEach((p) => dst.addPage(p));
    const data = await dst.save();
    const lo = group[0] + 1;
    const hi = group[group.length - 1] + 1;
    const name = lo === hi ? `${base}-p${lo}.pdf` : `${base}-p${lo}-${hi}.pdf`;
    out.push({ filename: name, bytes: data });
  }
  return out;
}

export async function splitPdfEveryN(
  bytes: Uint8Array,
  n: number,
  baseFilename: string,
): Promise<SplitOutput[]> {
  if (n < 1) throw new Error("Pages per file must be at least 1.");
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const total = src.getPageCount();
  const groups: number[][] = [];
  for (let i = 0; i < total; i += n) {
    groups.push(
      Array.from({ length: Math.min(n, total - i) }, (_, k) => i + k),
    );
  }
  const base = baseFilename.replace(/\.pdf$/i, "");
  const out: SplitOutput[] = [];
  let part = 1;
  for (const group of groups) {
    const dst = await PDFDocument.create();
    const copied = await dst.copyPages(src, group);
    copied.forEach((p) => dst.addPage(p));
    const data = await dst.save();
    out.push({ filename: `${base}-part-${part}.pdf`, bytes: data });
    part++;
  }
  return out;
}
