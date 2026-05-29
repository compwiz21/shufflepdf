"use client";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose(): void;
  onSave(dataUrl: string, naturalW: number, naturalH: number): void;
}

export function SignatureDialog({ open, onClose, onSave }: Props) {
  const [tab, setTab] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  if (!open) return null;

  function clearCanvas() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
  }

  function onPointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * c.width;
    const y = ((e.clientY - rect.top) / rect.height) * c.height;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    if (e.type === "pointerdown") {
      drawing.current = true;
      c.setPointerCapture(e.pointerId);
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (e.type === "pointermove" && drawing.current) {
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#0f172a";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (e.type === "pointerup") {
      drawing.current = false;
    }
  }

  function save() {
    if (tab === "draw") {
      const c = canvasRef.current;
      if (!c) return;
      onSave(c.toDataURL("image/png"), c.width, c.height);
    } else {
      const c = document.createElement("canvas");
      c.width = 600;
      c.height = 160;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "transparent";
      ctx.font = "italic 72px 'Caveat', cursive, serif";
      ctx.fillStyle = "#0f172a";
      ctx.textBaseline = "middle";
      ctx.fillText(typed || "Signature", 16, c.height / 2);
      onSave(c.toDataURL("image/png"), c.width, c.height);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="card w-full max-w-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Add signature</h2>
          <button className="btn-icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          {(["draw", "type"] as const).map((t) => (
            <button
              key={t}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium",
                tab === t
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-muted",
              )}
              onClick={() => setTab(t)}
            >
              {t === "draw" ? "Draw" : "Type"}
            </button>
          ))}
        </div>
        {tab === "draw" ? (
          <div>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full bg-neutral-50 border border-border rounded-xl touch-none"
              onPointerDown={onPointer}
              onPointerMove={onPointer}
              onPointerUp={onPointer}
            />
            <button
              className="btn-ghost mt-2 text-sm"
              onClick={clearCanvas}
            >
              Clear
            </button>
          </div>
        ) : (
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type your name"
            className="w-full rounded-xl border border-border px-4 py-3 text-2xl"
            style={{ fontFamily: "cursive" }}
            autoFocus
          />
        )}
        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={save}>
            Add to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
