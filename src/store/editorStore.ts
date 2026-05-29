"use client";
import { create } from "zustand";
import { uid } from "@/lib/utils";
import type {
  Annotation,
  PageId,
  PageRotation,
  PageState,
  SourceDoc,
} from "@/lib/pdf/types";

type StateSnapshot = {
  sources: Record<string, SourceDoc>;
  pages: PageState[];
};

export interface EditorState extends StateSnapshot {
  selectedPageIds: PageId[];
  activeTool:
    | "select"
    | "text"
    | "highlight"
    | "draw"
    | "rect"
    | "ellipse"
    | "line"
    | "image"
    | "signature"
    | "checkbox";

  // history
  past: StateSnapshot[];
  future: StateSnapshot[];

  // actions
  addSources(items: Array<{ source: SourceDoc; pages: PageState[] }>): void;
  clear(): void;
  setActiveTool(tool: EditorState["activeTool"]): void;
  selectPage(id: PageId, mode?: "set" | "toggle" | "range"): void;
  selectAll(): void;
  deselect(): void;
  reorderPages(fromIndex: number, toIndex: number): void;
  deletePages(ids: PageId[]): void;
  rotatePages(ids: PageId[], delta: 90 | -90): void;
  duplicatePages(ids: PageId[]): void;
  addAnnotation(pageId: PageId, ann: Annotation): void;
  updateAnnotation(pageId: PageId, ann: Annotation): void;
  removeAnnotation(pageId: PageId, annId: string): void;
  undo(): void;
  redo(): void;
}

const HISTORY_MAX = 50;

function snapshot(s: EditorState): StateSnapshot {
  // Light clone — sources keep their byte buffers by reference
  return {
    sources: { ...s.sources },
    pages: s.pages.map((p) => ({
      ...p,
      annotations: p.annotations.map((a) => ({ ...a })),
    })),
  };
}

function pushHistory(s: EditorState) {
  s.past.push(snapshot(s));
  if (s.past.length > HISTORY_MAX) s.past.shift();
  s.future.length = 0;
}

export const useEditor = create<EditorState>((set, get) => ({
  sources: {},
  pages: [],
  selectedPageIds: [],
  activeTool: "select",
  past: [],
  future: [],

  addSources(items) {
    set((s) => {
      pushHistory(s);
      const sources = { ...s.sources };
      const pages = [...s.pages];
      for (const item of items) {
        sources[item.source.id] = item.source;
        pages.push(...item.pages);
      }
      return { sources, pages };
    });
  },

  clear() {
    set((s) => {
      pushHistory(s);
      return { sources: {}, pages: [], selectedPageIds: [] };
    });
  },

  setActiveTool(tool) {
    set({ activeTool: tool });
  },

  selectPage(id, mode = "set") {
    set((s) => {
      if (mode === "toggle") {
        const has = s.selectedPageIds.includes(id);
        return {
          selectedPageIds: has
            ? s.selectedPageIds.filter((x) => x !== id)
            : [...s.selectedPageIds, id],
        };
      }
      if (mode === "range" && s.selectedPageIds.length > 0) {
        const last = s.selectedPageIds[s.selectedPageIds.length - 1];
        const idxA = s.pages.findIndex((p) => p.id === last);
        const idxB = s.pages.findIndex((p) => p.id === id);
        if (idxA >= 0 && idxB >= 0) {
          const [lo, hi] = idxA < idxB ? [idxA, idxB] : [idxB, idxA];
          return {
            selectedPageIds: s.pages.slice(lo, hi + 1).map((p) => p.id),
          };
        }
      }
      return { selectedPageIds: [id] };
    });
  },

  selectAll() {
    set((s) => ({ selectedPageIds: s.pages.map((p) => p.id) }));
  },

  deselect() {
    set({ selectedPageIds: [] });
  },

  reorderPages(fromIndex, toIndex) {
    set((s) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= s.pages.length ||
        toIndex >= s.pages.length
      ) {
        return {};
      }
      pushHistory(s);
      const pages = [...s.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return { pages };
    });
  },

  deletePages(ids) {
    set((s) => {
      if (ids.length === 0 || s.pages.length - ids.length < 1) return {};
      pushHistory(s);
      const idSet = new Set(ids);
      return {
        pages: s.pages.filter((p) => !idSet.has(p.id)),
        selectedPageIds: s.selectedPageIds.filter((id) => !idSet.has(id)),
      };
    });
  },

  rotatePages(ids, delta) {
    set((s) => {
      if (ids.length === 0) return {};
      pushHistory(s);
      const idSet = new Set(ids);
      const pages = s.pages.map((p) => {
        if (!idSet.has(p.id)) return p;
        const next = (((p.rotation + delta) % 360) + 360) % 360;
        return { ...p, rotation: next as PageRotation };
      });
      return { pages };
    });
  },

  duplicatePages(ids) {
    set((s) => {
      if (ids.length === 0) return {};
      pushHistory(s);
      const idSet = new Set(ids);
      const pages: PageState[] = [];
      for (const p of s.pages) {
        pages.push(p);
        if (idSet.has(p.id)) {
          pages.push({
            ...p,
            id: uid("page"),
            annotations: p.annotations.map((a) => ({ ...a, id: uid("ann") })),
          });
        }
      }
      return { pages };
    });
  },

  addAnnotation(pageId, ann) {
    set((s) => {
      pushHistory(s);
      return {
        pages: s.pages.map((p) =>
          p.id === pageId
            ? { ...p, annotations: [...p.annotations, ann] }
            : p,
        ),
      };
    });
  },

  updateAnnotation(pageId, ann) {
    set((s) => ({
      pages: s.pages.map((p) =>
        p.id === pageId
          ? {
              ...p,
              annotations: p.annotations.map((a) => (a.id === ann.id ? ann : a)),
            }
          : p,
      ),
    }));
  },

  removeAnnotation(pageId, annId) {
    set((s) => {
      pushHistory(s);
      return {
        pages: s.pages.map((p) =>
          p.id === pageId
            ? { ...p, annotations: p.annotations.filter((a) => a.id !== annId) }
            : p,
        ),
      };
    });
  },

  undo() {
    const s = get();
    const prev = s.past[s.past.length - 1];
    if (!prev) return;
    set({
      past: s.past.slice(0, -1),
      future: [snapshot(s), ...s.future],
      sources: prev.sources,
      pages: prev.pages,
      selectedPageIds: [],
    });
  },

  redo() {
    const s = get();
    const next = s.future[0];
    if (!next) return;
    set({
      past: [...s.past, snapshot(s)],
      future: s.future.slice(1),
      sources: next.sources,
      pages: next.pages,
      selectedPageIds: [],
    });
  },
}));

export function usePageById(id: PageId | null) {
  return useEditor((s) =>
    id ? s.pages.find((p) => p.id === id) ?? null : null,
  );
}
