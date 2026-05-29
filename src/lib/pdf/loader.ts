"use client";
import { PDFDocument } from "pdf-lib";
import { uid } from "@/lib/utils";
import type { PageState, SourceDoc } from "./types";

export interface LoadedPdf {
  source: SourceDoc;
  pages: PageState[];
}

export async function loadPdfBytes(
  bytes: Uint8Array,
  filename: string,
): Promise<LoadedPdf> {
  const doc = await PDFDocument.load(bytes, {
    ignoreEncryption: false,
    updateMetadata: false,
  });
  const docId = uid("doc");
  const pages: PageState[] = doc.getPages().map((_p, i) => ({
    id: uid("page"),
    sourceDocId: docId,
    sourceIndex: i,
    rotation: 0,
    annotations: [],
  }));
  const source: SourceDoc = {
    id: docId,
    bytes,
    filename,
  };
  return { source, pages };
}

export async function loadPdfFile(file: File): Promise<LoadedPdf> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return loadPdfBytes(bytes, file.name);
}
