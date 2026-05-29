import type { Metadata } from "next";
import { TaskLayout } from "@/components/landing/TaskLayout";
import { SplitTool } from "@/components/tools/SplitTool";

export const metadata: Metadata = {
  title: "Split PDF Online — Free, No Signup",
  description:
    "Extract page ranges from a PDF or split it into chunks. Works entirely in your browser.",
};

export default function SplitPage() {
  return (
    <TaskLayout
      title="Split a PDF"
      tagline="Extract page ranges like “1-3, 5, 8-10” or split a PDF into evenly-sized chunks."
    >
      <SplitTool />
    </TaskLayout>
  );
}
