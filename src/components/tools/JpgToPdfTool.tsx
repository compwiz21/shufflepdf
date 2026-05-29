"use client";
import { useState } from "react";
import { Download, X, GripVertical } from "lucide-react";
import { DropZone } from "@/components/editor/DropZone";
import { imagesToPdf, type ImagePageSize } from "@/lib/pdf/importImages";
import { downloadBlob, uid, isImageFile } from "@/lib/utils";

interface Item {
  id: string;
  file: File;
  url: string;
}

export function JpgToPdfTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<ImagePageSize>("fit");
  const [margin, setMargin] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function addFiles(files: File[]) {
    const imgs = files.filter(isImageFile);
    setItems((prev) => [
      ...prev,
      ...imgs.map((f) => ({
        id: uid("img"),
        file: f,
        url: URL.createObjectURL(f),
      })),
    ]);
  }

  function remove(id: string) {
    setItems((prev) => {
      const it = prev.find((i) => i.id === id);
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((i) => i.id !== id);
    });
  }

  function move(id: string, dir: -1 | 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const ni = idx + dir;
      if (ni < 0 || ni >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(ni, 0, item);
      return next;
    });
  }

  async function build() {
    if (!items.length) return;
    setBusy(true);
    setErr(null);
    try {
      const out = await imagesToPdf(
        items.map((i) => i.file),
        { pageSize, margin },
      );
      downloadBlob(
        new Blob([new Uint8Array(out)], { type: "application/pdf" }),
        "shufflepdf-images.pdf",
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <DropZone
        onFiles={addFiles}
        accept="image/png,image/jpeg"
        title="Drop JPG or PNG images"
        subtitle="They'll be combined into a single PDF, one image per page"
      />
      {items.length > 0 && (
        <div className="card p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((it, i) => (
              <div key={it.id} className="relative card p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt="" className="w-full h-32 object-contain bg-neutral-50 rounded" />
                <div className="flex items-center justify-between mt-1 text-xs text-muted">
                  <span className="font-semibold">#{i + 1}</span>
                  <div className="flex">
                    <button className="btn-icon !w-6 !h-6" onClick={() => move(it.id, -1)} disabled={i === 0}>
                      <GripVertical className="w-3 h-3 rotate-90" />
                    </button>
                    <button className="btn-icon !w-6 !h-6" onClick={() => move(it.id, 1)} disabled={i === items.length - 1}>
                      <GripVertical className="w-3 h-3 -rotate-90" />
                    </button>
                    <button className="btn-icon !w-6 !h-6 hover:!text-danger" onClick={() => remove(it.id)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Page size</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as ImagePageSize)}
                className="rounded-lg border border-border px-3 py-1.5"
              >
                <option value="fit">Fit to image</option>
                <option value="Letter">Letter</option>
                <option value="A4">A4</option>
                <option value="Legal">Legal</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Margin (pt)</span>
              <input
                type="number"
                value={margin}
                min={0}
                max={144}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-20 rounded-lg border border-border px-3 py-1.5"
              />
            </label>
          </div>
          {err && <p className="text-sm text-danger">{err}</p>}
          <div className="flex justify-end">
            <button
              className="btn-primary inline-flex items-center gap-2"
              disabled={busy}
              onClick={build}
            >
              <Download className="w-4 h-4" />
              {busy ? "Building…" : `Build PDF (${items.length} pages)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
