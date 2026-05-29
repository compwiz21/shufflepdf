import type { Metadata } from "next";
import { EditorShell } from "@/components/editor/EditorShell";

export const metadata: Metadata = {
  title: "PDF Editor",
  description:
    "Open any PDF, reorder pages, add text, sign, and download — all in your browser.",
};

export default function EditorPage() {
  return <EditorShell />;
}
