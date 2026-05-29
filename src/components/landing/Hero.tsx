"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { DropZone } from "@/components/editor/DropZone";
import { useEditor } from "@/store/editorStore";
import { loadPdfFile } from "@/lib/pdf/loader";
import { isPdfFile } from "@/lib/utils";
import { ShieldCheck, Zap, Smile, FileText } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const addSources = useEditor((s) => s.addSources);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      const loaded = await Promise.all(pdfs.map((f) => loadPdfFile(f)));
      addSources(loaded);
      router.push("/editor");
    },
    [addSources, router],
  );

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          >
            <Smile className="w-3.5 h-3.5" />
            100% free · no signup · no nonsense
          </motion.div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05]">
            <span className="text-primary">Shuffle</span> your PDFs.
            <br />
            Edit, sign, send.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-xl">
            The free PDF editor that respects your time and your privacy. Drop a
            file in your browser — reorder pages, add text, sign, merge, split.
            Files never leave your computer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" /> Files stay on
                your device
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" /> Works offline
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-500" /> No watermarks
              </li>
            </ul>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DropZone
            onFiles={handleFiles}
            title="Drop your PDF here to start"
            subtitle="or click to pick — your file goes straight to the editor"
          />
        </motion.div>
      </div>
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
    </section>
  );
}
