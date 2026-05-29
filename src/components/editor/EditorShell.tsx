"use client";
import { useCallback } from "react";
import Link from "next/link";
import { useEditor } from "@/store/editorStore";
import { loadPdfFile } from "@/lib/pdf/loader";
import { isPdfFile } from "@/lib/utils";
import { useShortcuts } from "@/hooks/useShortcuts";
import { DropZone } from "./DropZone";
import { Toolbar } from "./Toolbar";
import { PageThumbs } from "./PageThumbs";
import { CanvasViewport } from "./CanvasViewport";
import { Logo } from "@/components/landing/Logo";

export function EditorShell() {
  const hasPages = useEditor((s) => s.pages.length > 0);
  const addSources = useEditor((s) => s.addSources);
  useShortcuts();

  const handleFiles = useCallback(
    async (files: File[]) => {
      const pdfs = files.filter(isPdfFile);
      if (!pdfs.length) return;
      const loaded = await Promise.all(pdfs.map((f) => loadPdfFile(f)));
      addSources(loaded);
    },
    [addSources],
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-4 px-4 py-3 border-b border-border bg-white">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display font-bold text-lg">ShufflePDF</span>
        </Link>
        <span className="hidden md:inline text-xs text-muted">
          Free PDF editor — files never leave your computer
        </span>
      </header>
      {!hasPages ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <DropZone
            onFiles={handleFiles}
            className="w-full max-w-2xl"
            title="Drop a PDF to start editing"
            subtitle="Drag in one or several PDFs — or click to pick from your computer"
          />
        </div>
      ) : (
        <>
          <Toolbar />
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-48 border-r border-border bg-white overflow-y-auto thin-scroll">
              <PageThumbs />
              <div className="p-3">
                <DropZone
                  compact
                  onFiles={handleFiles}
                  title="Add more"
                  subtitle="Drop PDFs to append"
                />
              </div>
            </aside>
            <CanvasViewport />
          </div>
        </>
      )}
    </div>
  );
}
