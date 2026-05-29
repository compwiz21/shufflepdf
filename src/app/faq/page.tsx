import type { Metadata } from "next";
import { TaskLayout } from "@/components/landing/TaskLayout";
import { FAQ } from "@/components/landing/FAQ";

export const metadata: Metadata = {
  title: "FAQ — Help & How-tos",
  description: "Common questions about ShufflePDF, privacy, browsers, and what you can do with it.",
};

export default function FaqPage() {
  return (
    <TaskLayout
      title="Frequently asked questions"
      tagline="Everything you might want to know — privacy, browsers, file sizes, roadmap."
    >
      <FAQ />
    </TaskLayout>
  );
}
