"use client";
import { useState } from "react";
import { GripVertical, X, Download } from "lucide-react";
import JSZip from "jszip";
import { DropZone } from "@/components/editor/DropZone";
import { mergePdfs, type MergeInput } from "@/lib/pdf/merge";
import { downloadBlob, isPdfFile, uid } from "@/lib/utils";

interface Item {
  id: string;
  file: File;
  rangeSpec: string;
}

export function MergeTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function addFiles(files: File[]) {
    const pdfs = files.filter(isPdfFile);
    setItems((prev) => [
      ...prev,
      ...pdfs.map((f) => ({ id: uid("m"), file: f, rangeSpec: "" })),
    ]);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
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

  async function doMerge() {
    setBusy(true);
    setErr(null);
    try {
      const inputs: MergeInput[] = await Promise.all(
        items.map(async (it) => ({
          bytes: new Uint8Array(await it.file.arrayBuffer()),
          filename: it.file.name,
          rangeSpec: it.rangeSpec || undefined,
        })),
      );
      const out = await mergePdfs(inputs);
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      downloadBlob(blob, "shufflepdf-merged.pdf");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Merge failed.");
    } finally {
      setBusy(false);
    }
  }
  // jszip imported so future bulk-merge-to-zip is ready, suppress unused warn
  void JSZip;

  return (
    <div className="space-y-6">
      <DropZone onFiles={addFiles} title="Drop PDFs to merge" multiple />
      {items.length > 0 && (
        <div className="card p-4 space-y-2">
          {items.map((it, i) => (
            <div
              key={it.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50"
            >
              <div className="flex flex-col text-muted">
                <button className="btn-icon !w-6 !h-6" onClick={() => move(it.id, -1)} disabled={i === 0}>
                  <GripVertical className="w-3 h-3 rotate-90" />
                </button>
                <button className="btn-icon !w-6 !h-6" onClick={() => move(it.id, 1)} disabled={i === items.length - 1}>
                  <GripVertical className="w-3 h-3 -rotate-90" />
                </button>
              </div>
              <span className="w-6 text-center font-semibold text-muted">{i + 1}</span>
              <span className="flex-1 truncate font-medium">{it.file.name}</span>
              <input
                type="text"
                placeholder="All pages"
                value={it.rangeSpec}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((p) =>
                      p.id === it.id ? { ...p, rangeSpec: e.target.value } : p,
                    ),
                  )
                }
                className="w-32 text-sm rounded-lg border border-border px-3 py-1.5"
                title='Page range, e.g. "1-3, 5"'
              />
              <button className="btn-icon hover:!text-danger" onClick={() => remove(it.id)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {err && <p className="text-sm text-danger">{err}</p>}
      <div className="flex justify-end">
        <button
          className="btn-primary inline-flex items-center gap-2"
          onClick={doMerge}
          disabled={items.length < 2 || busy}
        >
          <Download className="w-4 h-4" />
          {busy ? "Merging…" : `Merge ${items.length} PDFs`}
        </button>
      </div>
    </div>
  );
}
