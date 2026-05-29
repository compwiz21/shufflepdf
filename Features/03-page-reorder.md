# 03 — Page Reorder (the "Shuffle" hero feature)

## Intent
Drag a thumbnail to a new position and the document order updates instantly. This is the namesake feature — make it feel great.

## Files
- `src/components/editor/PageThumbs.tsx` — wraps `<DndContext>` + `<SortableContext>`
- `src/components/editor/PageThumb.tsx` — uses `useSortable`
- `src/store/editorStore.ts` — `reorderPages(fromIndex, toIndex)`

## Library
`@dnd-kit/core` + `@dnd-kit/sortable` with `verticalListSortingStrategy`.

## Behavior
- Drag handle = entire thumbnail card.
- Drop indicator: violet horizontal bar between target neighbors.
- Live preview: dragged card follows cursor at 95% opacity, slight scale-up.
- Multi-select drag: if you start dragging a selected page, all selected pages move together (group, in their relative order).
- Update Zustand `pages` array atomically (single action → single undo entry).
- Auto-scroll the sidebar when dragging near top/bottom edge.

## Acceptance
- Drag page 1 to position 5 → array order is `[2,3,4,5,1,6,7,...]`.
- Undo (Cmd/Ctrl+Z) restores prior order.
- Multi-select 3 pages, drag → all 3 land contiguously at the drop point.
