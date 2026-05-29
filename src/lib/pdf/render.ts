"use client";
import { getPdfjs, type PdfDocumentProxy } from "./pdfjs";

const docCache = new Map<string, Promise<PdfDocumentProxy>>();

export function getPdfjsDocument(
  docId: string,
  bytes: Uint8Array,
): Promise<PdfDocumentProxy> {
  let p = docCache.get(docId);
  if (!p) {
    const copy = new Uint8Array(bytes);
    p = getPdfjs().then((m) => m.getDocument({ data: copy }).promise);
    docCache.set(docId, p);
  }
  return p;
}

export function invalidatePdfjsDocument(docId: string) {
  docCache.delete(docId);
}
