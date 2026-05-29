"use client";
import { useEffect } from "react";
import { useEditor } from "@/store/editorStore";

export function useShortcuts() {
  const undo = useEditor((s) => s.undo);
  const redo = useEditor((s) => s.redo);
  const deletePages = useEditor((s) => s.deletePages);
  const rotatePages = useEditor((s) => s.rotatePages);
  const duplicatePages = useEditor((s) => s.duplicatePages);
  const selectAll = useEditor((s) => s.selectAll);
  const setActiveTool = useEditor((s) => s.setActiveTool);
  const deselect = useEditor((s) => s.deselect);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea/i.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      const mod = e.metaKey || e.ctrlKey;
      const selected = useEditor.getState().selectedPageIds;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAll();
        return;
      }
      if (e.key === "Escape") {
        deselect();
        setActiveTool("select");
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selected.length) {
        e.preventDefault();
        deletePages(selected);
        return;
      }
      if (e.key.toLowerCase() === "r" && selected.length) {
        e.preventDefault();
        rotatePages(selected, e.shiftKey ? -90 : 90);
        return;
      }
      if (e.key.toLowerCase() === "d" && selected.length) {
        e.preventDefault();
        duplicatePages(selected);
        return;
      }
      // tool shortcuts
      const tools: Record<string, ReturnType<typeof useEditor.getState>["activeTool"]> = {
        v: "select",
        t: "text",
        h: "highlight",
        p: "draw",
        x: "checkbox",
        e: "ellipse",
        l: "line",
      };
      const key = e.key.toLowerCase();
      if (tools[key] && !mod) {
        setActiveTool(tools[key]);
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, deletePages, rotatePages, duplicatePages, selectAll, setActiveTool, deselect]);
}
