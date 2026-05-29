import type { Metadata } from "next";
import { TaskLayout } from "@/components/landing/TaskLayout";
import { MergeTool } from "@/components/tools/MergeTool";

export const metadata: Metadata = {
  title: "Merge PDFs Online — Free, No Signup",
  description:
    "Combine multiple PDF files into one. Drag to reorder before merging. 100% in your browser — no uploads.",
};

export default function MergePage() {
  return (
    <TaskLayout
      title="Merge PDFs"
      tagline="Combine any number of PDF files into one. Drag to reorder before downloading."
    >
      <MergeTool />
    </TaskLayout>
  );
}
