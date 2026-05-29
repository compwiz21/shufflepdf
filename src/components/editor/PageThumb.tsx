"use client";
import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCw, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "@/store/editorStore";
import { getPdfjsDocument } from "@/lib/pdf/render";
import type { PageState } from "@/lib/pdf/types";

interface Props {
  page: PageState;
  index: number;
  selected: boolean;
}

export function PageThumb({ page, index, selected }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [aspect, setAspect] = useState(0.77); // letter portrait default
  const sources = useEditor((s) => s.sources);
  const selectPage = useEditor((s) => s.selectPage);
  const deletePages = useEditor((s) => s.deletePages);
  const rotatePages = useEditor((s) => s.rotatePages);
  const duplicatePages = useEditor((s) => s.duplicatePages);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const src = sources[page.sourceDocId];
    if (!src) return;
    let cancelled = false;
    (async () => {
      const doc = await getPdfjsDocument(page.sourceDocId, src.bytes);
      const pdfPage = await doc.getPage(page.sourceIndex + 1);
      const viewport = pdfPage.getViewport({ scale: 1 });
      const w = 140;
      const scale = w / viewport.width;
      const vp = pdfPage.getViewport({ scale });
      setAspect(vp.height / vp.width);
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await pdfPage.render({ canvasContext: ctx, viewport: vp, canvas }).promise;
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, page.sourceDocId, page.sourceIndex, sources]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        containerRef.current = node;
      }}
      style={style}
      className={cn(
        "group relative card p-2 select-none transition-shadow cursor-grab active:cursor-grabbing",
        selected && "ring-2 ring-primary",
        isDragging && "shadow-2xl",
      )}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        const mode = e.metaKey || e.ctrlKey
          ? "toggle"
          : e.shiftKey
            ? "range"
            : "set";
        selectPage(page.id, mode);
      }}
    >
      <div
        className="bg-white rounded-md overflow-hidden mx-auto shadow-sm"
        style={{
          width: 140,
          height: 140 * aspect,
          transform: `rotate(${page.rotation}deg)`,
          transition: "transform 200ms ease",
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs font-medium text-muted">Page {index + 1}</span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            className="btn-icon !w-6 !h-6"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              rotatePages([page.id], 90);
            }}
            title="Rotate"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="btn-icon !w-6 !h-6"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              duplicatePages([page.id]);
            }}
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="btn-icon !w-6 !h-6 hover:!text-danger"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              deletePages([page.id]);
            }}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {page.annotations.length > 0 && (
        <span className="absolute right-2 top-2 text-[10px] bg-accent text-ink px-1.5 py-0.5 rounded-full font-semibold">
          {page.annotations.length}
        </span>
      )}
    </div>
  );
}
