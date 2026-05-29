import type { Metadata } from "next";
import { TaskLayout } from "@/components/landing/TaskLayout";
import { PdfToJpgTool } from "@/components/tools/PdfToJpgTool";

export const metadata: Metadata = {
  title: "Convert PDF to JPG — Free, In Your Browser",
  description:
    "Render every page of your PDF as a JPG or PNG. Multi-page output downloaded as a zip.",
};

export default function Page() {
  return (
    <TaskLayout
      title="PDF → Images"
      tagline="Export every page of your PDF as JPG or PNG. Pick a resolution and download."
    >
      <PdfToJpgTool />
    </TaskLayout>
  );
}
