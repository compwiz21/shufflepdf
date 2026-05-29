"use client";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "@/store/editorStore";
import { getPdfjsDocument } from "@/lib/pdf/render";
import { AnnotationLayer } from "./AnnotationLayer";

export function CanvasViewport() {
  const pages = useEditor((s) => s.pages);
  const sources = useEditor((s) => s.sources);
  const selectedPageIds = useEditor((s) => s.selectedPageIds);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to first selected page when selection changes
  useEffect(() => {
    if (selectedPageIds.length === 0) return;
    const id = selectedPageIds[0];
    const el = document.getElementById(`viewport-page-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedPageIds]);

  if (pages.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto thin-scroll bg-neutral-100"
    >
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        {pages.map((p, i) => {
          const src = sources[p.sourceDocId];
          if (!src) return null;
          return (
            <ViewportPage
              key={p.id}
              pageId={p.id}
              pageIndex={i}
              sourceDocId={p.sourceDocId}
              sourceIndex={p.sourceIndex}
              rotation={p.rotation}
              sourceBytes={src.bytes}
            />
          );
        })}
      </div>
    </div>
  );
}

function ViewportPage({
  pageId,
  pageIndex,
  sourceDocId,
  sourceIndex,
  rotation,
  sourceBytes,
}: {
  pageId: string;
  pageIndex: number;
  sourceDocId: string;
  sourceIndex: number;
  rotation: number;
  sourceBytes: Uint8Array;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number; baseW: number; baseH: number }>({
    w: 0,
    h: 0,
    baseW: 0,
    baseH: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const doc = await getPdfjsDocument(sourceDocId, sourceBytes);
      const page = await doc.getPage(sourceIndex + 1);
      const baseViewport = page.getViewport({ scale: 1 });
      const targetWidth = Math.min(900, (wrapperRef.current?.clientWidth ?? 900));
      const scale = targetWidth / baseViewport.width;
      const viewport = page.getViewport({ scale, rotation });
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      setDims({
        w: viewport.width,
        h: viewport.height,
        baseW: baseViewport.width,
        baseH: baseViewport.height,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [sourceDocId, sourceIndex, rotation, sourceBytes]);

  return (
    <div
      id={`viewport-page-${pageId}`}
      ref={wrapperRef}
      className="bg-white shadow-md rounded-md relative"
      style={{ width: dims.w || 800, height: dims.h || 1000 }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {dims.w > 0 && (
        <AnnotationLayer
          pageId={pageId}
          width={dims.w}
          height={dims.h}
          baseWidth={dims.baseW}
          baseHeight={dims.baseH}
        />
      )}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-muted">
        Page {pageIndex + 1}
      </span>
    </div>
  );
}
