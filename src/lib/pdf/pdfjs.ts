"use client";
import type * as PdfjsNs from "pdfjs-dist";

type PdfjsModule = typeof PdfjsNs;
let modPromise: Promise<PdfjsModule> | null = null;

export function getPdfjs(): Promise<PdfjsModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("pdfjs is only available in the browser"));
  }
  if (!modPromise) {
    modPromise = import("pdfjs-dist").then((m) => {
      if (!m.GlobalWorkerOptions.workerSrc) {
        m.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }
      return m;
    });
  }
  return modPromise;
}

export type PdfDocumentProxy = PdfjsNs.PDFDocumentProxy;
export type PdfPageProxy = PdfjsNs.PDFPageProxy;
