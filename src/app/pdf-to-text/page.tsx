import type { Metadata } from "next";
import { TaskLayout } from "@/components/landing/TaskLayout";
import { PdfToTextTool } from "@/components/tools/PdfToTextTool";

export const metadata: Metadata = {
  title: "Extract Text from PDF — Free",
  description:
    "Extract plain text from any PDF. Copy to clipboard or download as a .txt file.",
};

export default function Page() {
  return (
    <TaskLayout
      title="PDF → Text"
      tagline="Pull plain text out of any PDF. Copy to clipboard or save as .txt."
    >
      <PdfToTextTool />
    </TaskLayout>
  );
}
