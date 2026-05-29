"use client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useEditor } from "@/store/editorStore";
import { PageThumb } from "./PageThumb";

export function PageThumbs() {
  const pages = useEditor((s) => s.pages);
  const selectedPageIds = useEditor((s) => s.selectedPageIds);
  const reorderPages = useEditor((s) => s.reorderPages);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = pages.findIndex((p) => p.id === active.id);
    const to = pages.findIndex((p) => p.id === over.id);
    if (from < 0 || to < 0) return;
    // reorderPages action handles history; do single move
    reorderPages(from, to);
  }

  if (pages.length === 0) {
    return (
      <div className="p-4 text-sm text-muted text-center">
        Drop a PDF to get started
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pages.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 p-3">
          {pages.map((p, i) => (
            <PageThumb
              key={p.id}
              page={p}
              index={i}
              selected={selectedPageIds.includes(p.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// re-export for typing tests
export { arrayMove };
