"use client";
import { getPdfjsDocument } from "./render";
import { uid } from "@/lib/utils";

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export async function extractText(bytes: Uint8Array): Promise<{
  pages: ExtractedPage[];
  combined: string;
}> {
  const doc = await getPdfjsDocument(uid("extract"), bytes);
  const pages: ExtractedPage[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ pageNumber: i, text });
  }
  const combined = pages
    .map((p) => `--- Page ${p.pageNumber} ---\n${p.text}`)
    .join("\n\n");
  return { pages, combined };
}
