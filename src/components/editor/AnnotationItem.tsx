"use client";
import { useState, useRef, useEffect } from "react";
import { useEditor } from "@/store/editorStore";
import type { Annotation } from "@/lib/pdf/types";

interface Props {
  ann: Annotation;
  pageId: string;
  /** PDF user space -> display pixels multiplier */
  scale: number;
  baseWidth: number;
  baseHeight: number;
}

export function AnnotationItem({ ann, pageId, scale }: Props) {
  const updateAnnotation = useEditor((s) => s.updateAnnotation);
  const removeAnnotation = useEditor((s) => s.removeAnnotation);
  const [dragging, setDragging] = useState<{
    startX: number;
    startY: number;
    annX: number;
    annY: number;
  } | null>(null);
  const ref = useRef<SVGGElement>(null);

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    if ("x" in ann && "y" in ann) {
      setDragging({
        startX: e.clientX,
        startY: e.clientY,
        annX: ann.x,
        annY: ann.y,
      });
    }
    if (ann.kind === "checkbox") {
      updateAnnotation(pageId, { ...ann, checked: !ann.checked });
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const dx = (e.clientX - dragging.startX) * scale;
    const dy = (e.clientY - dragging.startY) * scale;
    if (!("x" in ann)) return;
    const next = { ...ann, x: dragging.annX + dx, y: dragging.annY + dy };
    updateAnnotation(pageId, next as Annotation);
  }

  function onPointerUp(e: React.PointerEvent) {
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    setDragging(null);
  }

  function onDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (ann.kind === "text") {
      const text = prompt("Edit text:", ann.text);
      if (text != null) updateAnnotation(pageId, { ...ann, text });
    }
  }

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    removeAnnotation(pageId, ann.id);
  }

  useEffect(() => {
    // noop — placeholder for future selection state
  }, []);

  const handlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick,
    onContextMenu,
    style: { cursor: "move" as const },
  };

  switch (ann.kind) {
    case "text": {
      return (
        <g ref={ref} {...handlers}>
          <text
            x={ann.x / scale}
            y={ann.y / scale + ann.fontSize / scale}
            fill={ann.color}
            fontSize={ann.fontSize / scale}
            fontFamily="Helvetica, Arial, sans-serif"
          >
            {ann.text}
          </text>
        </g>
      );
    }
    case "highlight": {
      return (
        <g ref={ref} {...handlers}>
          <rect
            x={ann.x / scale}
            y={ann.y / scale}
            width={ann.w / scale}
            height={ann.h / scale}
            fill={ann.color}
            opacity={0.4}
          />
        </g>
      );
    }
    case "draw": {
      const pts = ann.points
        .map(([x, y]) => `${x / scale},${y / scale}`)
        .join(" ");
      return (
        <g ref={ref} {...handlers}>
          <polyline
            points={pts}
            fill="none"
            stroke={ann.stroke}
            strokeWidth={ann.thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    }
    case "rect": {
      return (
        <g ref={ref} {...handlers}>
          <rect
            x={ann.x / scale}
            y={ann.y / scale}
            width={ann.w / scale}
            height={ann.h / scale}
            fill={ann.fill ?? "transparent"}
            stroke={ann.stroke}
            strokeWidth={ann.thickness}
          />
        </g>
      );
    }
    case "ellipse": {
      const cx = (ann.x + ann.w / 2) / scale;
      const cy = (ann.y + ann.h / 2) / scale;
      return (
        <g ref={ref} {...handlers}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={ann.w / 2 / scale}
            ry={ann.h / 2 / scale}
            fill={ann.fill ?? "transparent"}
            stroke={ann.stroke}
            strokeWidth={ann.thickness}
          />
        </g>
      );
    }
    case "line": {
      return (
        <g ref={ref} {...handlers}>
          <line
            x1={ann.x / scale}
            y1={ann.y / scale}
            x2={(ann.x + ann.w) / scale}
            y2={(ann.y + ann.h) / scale}
            stroke={ann.stroke}
            strokeWidth={ann.thickness}
          />
        </g>
      );
    }
    case "image":
    case "signature": {
      return (
        <g ref={ref} {...handlers}>
          <image
            href={ann.dataUrl}
            x={ann.x / scale}
            y={ann.y / scale}
            width={ann.w / scale}
            height={ann.h / scale}
          />
        </g>
      );
    }
    case "checkbox": {
      const s = ann.size / scale;
      return (
        <g ref={ref} {...handlers}>
          <rect
            x={ann.x / scale}
            y={ann.y / scale}
            width={s}
            height={s}
            stroke="#0f172a"
            strokeWidth={1.4}
            fill="white"
          />
          {ann.checked && (
            <path
              d={`M ${ann.x / scale + s * 0.2} ${ann.y / scale + s * 0.5} L ${ann.x / scale + s * 0.45} ${ann.y / scale + s * 0.75} L ${ann.x / scale + s * 0.85} ${ann.y / scale + s * 0.25}`}
              fill="none"
              stroke="#0f172a"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </g>
      );
    }
    default:
      return null;
  }
}
