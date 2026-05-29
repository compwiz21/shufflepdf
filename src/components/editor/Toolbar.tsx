"use client";
import { useRef, useState } from "react";
import {
  MousePointer2,
  Type,
  Highlighter,
  Pencil,
  Square,
  Circle,
  Minus,
  ImageIcon,
  Signature as SignatureIcon,
  CheckSquare,
  Undo2,
  Redo2,
  Download,
  Plus,
  Trash2,
  RotateCw,
  RotateCcw,
  Copy,
} from "lucide-react";
import { useEditor, type EditorState } from "@/store/editorStore";
import { exportPdf, suggestedFilename } from "@/lib/pdf/flatten";
import { downloadBlob } from "@/lib/utils";
import { SignatureDialog } from "./SignatureDialog";
import { cn } from "@/lib/utils";

interface ToolBtn {
  tool: EditorState["activeTool"];
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hotkey: string;
}
const tools: ToolBtn[] = [
  { tool: "select", icon: MousePointer2, label: "Select", hotkey: "V" },
  { tool: "text", icon: Type, label: "Text", hotkey: "T" },
  { tool: "highlight", icon: Highlighter, label: "Highlight", hotkey: "H" },
  { tool: "draw", icon: Pencil, label: "Draw", hotkey: "P" },
  { tool: "rect", icon: Square, label: "Rectangle", hotkey: "R" },
  { tool: "ellipse", icon: Circle, label: "Ellipse", hotkey: "E" },
  { tool: "line", icon: Minus, label: "Line", hotkey: "L" },
  { tool: "checkbox", icon: CheckSquare, label: "Checkbox", hotkey: "X" },
];

export function Toolbar() {
  const activeTool = useEditor((s) => s.activeTool);
  const setActiveTool = useEditor((s) => s.setActiveTool);
  const undo = useEditor((s) => s.undo);
  const redo = useEditor((s) => s.redo);
  const past = useEditor((s) => s.past.length);
  const future = useEditor((s) => s.future.length);
  const sources = useEditor((s) => s.sources);
  const pages = useEditor((s) => s.pages);
  const selected = useEditor((s) => s.selectedPageIds);
  const deletePages = useEditor((s) => s.deletePages);
  const rotatePages = useEditor((s) => s.rotatePages);
  const duplicatePages = useEditor((s) => s.duplicatePages);

  const [sigOpen, setSigOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const imgInput = useRef<HTMLInputElement>(null);

  const hasPages = pages.length > 0;
  const hasSelection = selected.length > 0;

  async function handleDownload() {
    if (!hasPages) return;
    setExporting(true);
    try {
      const bytes = await exportPdf({ sources, pages });
      const blob = new Blob([new Uint8Array(bytes)], {
        type: "application/pdf",
      });
      downloadBlob(blob, suggestedFilename(sources));
    } finally {
      setExporting(false);
    }
  }

  function dispatchImage(dataUrl: string, w: number, h: number, kind: "image" | "signature") {
    const target = selected[0] ?? pages[0]?.id;
    if (!target) return;
    window.dispatchEvent(
      new CustomEvent("shufflepdf:add-image", {
        detail: { pageId: target, kind, dataUrl, w, h },
      }),
    );
  }

  async function handleImagePick(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () =>
        dispatchImage(reader.result as string, img.width, img.height, "image");
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="flex items-center gap-1 p-2 border-b border-border bg-white">
        {tools.map((t) => (
          <button
            key={t.tool}
            className="btn-icon"
            data-active={activeTool === t.tool}
            title={`${t.label} (${t.hotkey})`}
            onClick={() => setActiveTool(t.tool)}
          >
            <t.icon className="w-4 h-4" />
          </button>
        ))}
        <button
          className="btn-icon"
          title="Image"
          onClick={() => imgInput.current?.click()}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          className="btn-icon"
          title="Signature"
          onClick={() => setSigOpen(true)}
        >
          <SignatureIcon className="w-4 h-4" />
        </button>
        <input
          ref={imgInput}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImagePick(f);
            e.target.value = "";
          }}
        />
        <div className="w-px h-6 bg-border mx-1" />
        <button
          className="btn-icon"
          title="Rotate left"
          disabled={!hasSelection}
          onClick={() => rotatePages(selected, -90)}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          className="btn-icon"
          title="Rotate right"
          disabled={!hasSelection}
          onClick={() => rotatePages(selected, 90)}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          className="btn-icon"
          title="Duplicate"
          disabled={!hasSelection}
          onClick={() => duplicatePages(selected)}
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          className="btn-icon hover:!text-danger"
          title="Delete"
          disabled={!hasSelection}
          onClick={() => deletePages(selected)}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          className="btn-icon"
          title="Undo (Ctrl+Z)"
          disabled={past === 0}
          onClick={undo}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          className="btn-icon"
          title="Redo (Ctrl+Shift+Z)"
          disabled={future === 0}
          onClick={redo}
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <button
          className={cn("btn-primary !py-2 !px-4 inline-flex items-center gap-2")}
          disabled={!hasPages || exporting}
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
          {exporting ? "Preparing…" : "Download"}
        </button>
      </div>
      <SignatureDialog
        open={sigOpen}
        onClose={() => setSigOpen(false)}
        onSave={(dataUrl, w, h) => dispatchImage(dataUrl, w, h, "signature")}
      />
    </>
  );
}

// Provide Plus icon for thumbnail insertion buttons elsewhere
export { Plus };
