"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { useEditor } from "@/store/editorStore";
import { uid } from "@/lib/utils";
import type { Annotation, DrawAnnotation } from "@/lib/pdf/types";
import { AnnotationItem } from "./AnnotationItem";

interface Props {
  pageId: string;
  width: number;
  height: number;
  baseWidth: number;
  baseHeight: number;
}

export function AnnotationLayer({
  pageId,
  width,
  height,
  baseWidth,
  baseHeight,
}: Props) {
  const tool = useEditor((s) => s.activeTool);
  const page = useEditor((s) => s.pages.find((p) => p.id === pageId));
  const addAnnotation = useEditor((s) => s.addAnnotation);
  const layerRef = useRef<SVGSVGElement>(null);

  // Display -> PDF user space scale
  const scale = baseWidth / width;
  const toPdf = useCallback(
    (px: number, py: number) => ({ x: px * scale, y: py * scale }),
    [scale],
  );

  const [drawing, setDrawing] = useState<DrawAnnotation | null>(null);

  function localPoint(e: React.PointerEvent): { x: number; y: number } {
    const rect = (e.target as Element)
      .closest("svg")!
      .getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (tool === "select") return;
    e.preventDefault();
    const { x, y } = localPoint(e);
    const pdf = toPdf(x, y);

    if (tool === "text") {
      const text = prompt("Text:");
      if (!text) return;
      const ann: Annotation = {
        kind: "text",
        id: uid("ann"),
        x: pdf.x,
        y: pdf.y,
        w: 200,
        h: 24,
        text,
        fontSize: 16,
        color: "#0f172a",
      };
      addAnnotation(pageId, ann);
      return;
    }
    if (tool === "draw") {
      setDrawing({
        kind: "draw",
        id: uid("ann"),
        points: [[pdf.x, pdf.y]],
        stroke: "#7c3aed",
        thickness: 2,
      });
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      return;
    }
    if (tool === "highlight") {
      const ann: Annotation = {
        kind: "highlight",
        id: uid("ann"),
        x: pdf.x,
        y: pdf.y,
        w: 120 * scale,
        h: 14 * scale,
        color: "#fbbf24",
      };
      addAnnotation(pageId, ann);
      return;
    }
    if (tool === "rect") {
      const ann: Annotation = {
        kind: "rect",
        id: uid("ann"),
        x: pdf.x,
        y: pdf.y,
        w: 100 * scale,
        h: 60 * scale,
        stroke: "#7c3aed",
        thickness: 2,
      };
      addAnnotation(pageId, ann);
      return;
    }
    if (tool === "ellipse") {
      const ann: Annotation = {
        kind: "ellipse",
        id: uid("ann"),
        x: pdf.x,
        y: pdf.y,
        w: 100 * scale,
        h: 60 * scale,
        stroke: "#7c3aed",
        thickness: 2,
      };
      addAnnotation(pageId, ann);
      return;
    }
    if (tool === "checkbox") {
      const ann: Annotation = {
        kind: "checkbox",
        id: uid("ann"),
        x: pdf.x,
        y: pdf.y,
        size: 14,
        checked: false,
      };
      addAnnotation(pageId, ann);
      return;
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drawing) return;
    const { x, y } = localPoint(e);
    const pdf = toPdf(x, y);
    setDrawing({ ...drawing, points: [...drawing.points, [pdf.x, pdf.y]] });
  }

  function onPointerUp() {
    if (drawing && drawing.points.length > 1) {
      addAnnotation(pageId, drawing);
    }
    setDrawing(null);
  }

  // Image / Signature insertion via toolbar dispatches a custom event with dataUrl
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{
        pageId: string;
        kind: "image" | "signature";
        dataUrl: string;
        w: number;
        h: number;
      }>;
      if (ev.detail.pageId !== pageId) return;
      const w = Math.min(ev.detail.w, baseWidth * 0.6);
      const h = (ev.detail.h * w) / ev.detail.w;
      addAnnotation(pageId, {
        kind: ev.detail.kind,
        id: uid("ann"),
        x: baseWidth / 2 - w / 2,
        y: baseHeight / 2 - h / 2,
        w,
        h,
        dataUrl: ev.detail.dataUrl,
      });
    };
    window.addEventListener("shufflepdf:add-image", handler as EventListener);
    return () =>
      window.removeEventListener(
        "shufflepdf:add-image",
        handler as EventListener,
      );
  }, [pageId, baseWidth, baseHeight, addAnnotation]);

  const pointerCursor =
    tool === "select"
      ? "default"
      : tool === "text"
        ? "text"
        : tool === "draw"
          ? "crosshair"
          : "copy";

  return (
    <svg
      ref={layerRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: pointerCursor, pointerEvents: "auto" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {page?.annotations.map((ann) => (
        <AnnotationItem
          key={ann.id}
          ann={ann}
          pageId={pageId}
          scale={1 / scale}
          baseWidth={baseWidth}
          baseHeight={baseHeight}
        />
      ))}
      {drawing && (
        <polyline
          points={drawing.points
            .map(([x, y]) => `${x / scale},${y / scale}`)
            .join(" ")}
          fill="none"
          stroke={drawing.stroke}
          strokeWidth={drawing.thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
