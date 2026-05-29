"use client";
import { useState } from "react";
import JSZip from "jszip";
import { Download } from "lucide-react";
import { DropZone } from "@/components/editor/DropZone";
import { splitPdfByRanges, splitPdfEveryN } from "@/lib/pdf/split";
import { downloadBlob, isPdfFile } from "@/lib/utils";

export function SplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"ranges" | "everyN">("ranges");
  const [spec, setSpec] = useState("");
  const [n, setN] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function onFiles(files: File[]) {
    const pdf = files.find(isPdfFile);
    if (pdf) {
      setFile(pdf);
      setErr(null);
    }
  }

  async function doSplit() {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const outs =
        mode === "ranges"
          ? await splitPdfByRanges(bytes, spec, file.name)
          : await splitPdfEveryN(bytes, n, file.name);
      if (outs.length === 1) {
        downloadBlob(
          new Blob([new Uint8Array(outs[0].bytes)], {
            type: "application/pdf",
          }),
          outs[0].filename,
        );
      } else {
        const zip = new JSZip();
        for (const o of outs) zip.file(o.filename, o.bytes);
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-split.zip");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Split failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={onFiles} title="Drop a PDF to split" multiple={false} />}
      {file && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-medium">{file.name}</span>
            <button className="btn-ghost text-sm" onClick={() => setFile(null)}>
              Choose another
            </button>
          </div>
          <div className="flex gap-2">
            {(["ranges", "everyN"] as const).map((m) => (
              <button
                key={m}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  mode === m ? "bg-primary text-white" : "bg-neutral-100 text-muted"
                }`}
                onClick={() => setMode(m)}
              >
                {m === "ranges" ? "By page range" : "Every N pages"}
              </button>
            ))}
          </div>
          {mode === "ranges" ? (
            <input
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="e.g. 1-3, 5, 8-10"
              className="w-full rounded-xl border border-border px-4 py-3"
            />
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">Pages per file</span>
              <input
                type="number"
                min={1}
                value={n}
                onChange={(e) => setN(Math.max(1, Number(e.target.value)))}
                className="w-24 rounded-xl border border-border px-3 py-2"
              />
            </div>
          )}
          {err && <p className="text-sm text-danger">{err}</p>}
          <div className="flex justify-end">
            <button
              className="btn-primary inline-flex items-center gap-2"
              disabled={busy || (mode === "ranges" && !spec.trim())}
              onClick={doSplit}
            >
              <Download className="w-4 h-4" />
              {busy ? "Splitting…" : "Split & download"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
