"use client";
import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn, isPdfFile } from "@/lib/utils";

export interface DropZoneProps {
  onFiles(files: File[]): void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function DropZone({
  onFiles,
  accept = "application/pdf",
  multiple = true,
  className,
  title = "Drop your PDF here",
  subtitle = "or click to choose a file from your computer",
  compact = false,
}: DropZoneProps) {
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const files = Array.from(list);
      if (!files.length) return;
      onFiles(files);
    },
    [onFiles],
  );

  return (
    <label
      className={cn(
        "card flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 border-dashed",
        compact ? "p-6 gap-2" : "p-12 gap-4",
        hover
          ? "border-primary bg-primary-100/40 scale-[1.01]"
          : "border-border hover:border-primary/60",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handle(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handle(e.target.files)}
      />
      <div
        className={cn(
          "rounded-2xl bg-primary text-white flex items-center justify-center",
          compact ? "w-10 h-10" : "w-14 h-14",
        )}
      >
        <Upload className={compact ? "w-5 h-5" : "w-6 h-6"} />
      </div>
      <div>
        <p
          className={cn(
            "font-display font-semibold",
            compact ? "text-base" : "text-xl",
          )}
        >
          {title}
        </p>
        <p
          className={cn("text-muted", compact ? "text-xs" : "text-sm mt-1")}
        >
          {subtitle}
        </p>
      </div>
      {!compact && (
        <button
          type="button"
          className="btn-primary mt-2"
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
        >
          Choose file
        </button>
      )}
    </label>
  );
}

export function filterPdfFiles(files: File[]): File[] {
  return files.filter(isPdfFile);
}
