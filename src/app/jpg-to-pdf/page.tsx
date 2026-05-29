import type { Metadata } from "next";
import { TaskLayout } from "@/components/landing/TaskLayout";
import { JpgToPdfTool } from "@/components/tools/JpgToPdfTool";

export const metadata: Metadata = {
  title: "Convert JPG / PNG to PDF — Free",
  description:
    "Combine images into a single PDF. Reorder, pick page size, and download.",
};

export default function Page() {
  return (
    <TaskLayout
      title="Images → PDF"
      tagline="Drop JPGs or PNGs to build a single PDF. Reorder before exporting."
    >
      <JpgToPdfTool />
    </TaskLayout>
  );
}
