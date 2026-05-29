"use client";
import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { DropZone } from "@/components/editor/DropZone";
import { extractText } from "@/lib/pdf/extractText";
import { downloadBlob, isPdfFile } from "@/lib/utils";

export function PdfToTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFiles(files: File[]) {
    const pdf = files.find(isPdfFile);
    if (!pdf) return;
    setFile(pdf);
    setBusy(true);
    setErr(null);
    setText("");
    try {
      const bytes = new Uint8Array(await pdf.arrayBuffer());
      const { combined } = await extractText(bytes);
      setText(combined.trim() || "(No text was found — this PDF may be image-based. OCR is not supported yet.)");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Extraction failed.");
    } finally {
      setBusy(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function save() {
    if (!file) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + ".txt");
  }

  return (
    <div className="space-y-6">
      {!file && <DropZone onFiles={onFiles} title="Drop a PDF to extract text" multiple={false} />}
      {file && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{file.name}</span>
            <button
              className="btn-ghost text-sm"
              onClick={() => {
                setFile(null);
                setText("");
              }}
            >
              Choose another
            </button>
          </div>
          {busy ? (
            <p className="text-muted text-sm">Extracting…</p>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-80 rounded-lg border border-border p-3 font-mono text-sm"
            />
          )}
          {err && <p className="text-sm text-danger">{err}</p>}
          <div className="flex justify-end gap-2">
            <button className="btn-ghost inline-flex items-center gap-2" onClick={copy} disabled={!text}>
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button className="btn-primary inline-flex items-center gap-2" onClick={save} disabled={!text}>
              <Download className="w-4 h-4" />
              Download .txt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
