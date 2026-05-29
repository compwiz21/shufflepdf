"use client";
import { useState } from "react";
import JSZip from "jszip";
import { Download } from "lucide-react";
import { DropZone } from "@/components/editor/DropZone";
import { pdfToImages, type ImageFormat } from "@/lib/pdf/exportImages";
import { downloadBlob, isPdfFile } from "@/lib/utils";

export function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [scale, setScale] = useState(2);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function onFiles(files: File[]) {
    const pdf = files.find(isPdfFile);
    if (pdf) setFile(pdf);
  }

  async function go() {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const images = await pdfToImages(bytes, { format, scale });
      if (images.length === 1) {
        downloadBlob(images[0].blob, images[0].filename);
      } else {
        const zip = new JSZip();
        for (const it of images) zip.file(it.filename, it.blob);
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-images.zip");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={onFiles} title="Drop a PDF to convert" multiple={false} />}
      {file && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-medium">{file.name}</span>
            <button className="btn-ghost text-sm" onClick={() => setFile(null)}>
              Choose another
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Format</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ImageFormat)}
                className="rounded-lg border border-border px-3 py-1.5"
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted">Resolution</span>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="rounded-lg border border-border px-3 py-1.5"
              >
                <option value={1}>72 dpi (1×)</option>
                <option value={2}>144 dpi (2×)</option>
                <option value={3}>216 dpi (3×)</option>
              </select>
            </label>
          </div>
          {err && <p className="text-sm text-danger">{err}</p>}
          <div className="flex justify-end">
            <button
              className="btn-primary inline-flex items-center gap-2"
              disabled={busy}
              onClick={go}
            >
              <Download className="w-4 h-4" />
              {busy ? "Converting…" : "Convert & download"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
