# 21 — Undo / Redo

## Intent
Every mutating action is reversible. Standard editor stack semantics.

## Files
- `src/store/editorStore.ts` — wraps actions with history middleware.

## Implementation
- Maintain `past: EditorState[]`, `future: EditorState[]`.
- On every mutating action: push current snapshot onto `past`, clear `future`.
- `undo()`: pop `past` → push current onto `future` → set state.
- `redo()`: inverse.
- Cap history at 50 entries (memory).
- Snapshot uses `structuredClone` of the lightweight state (pages + annotations; bytes are referenced, not cloned).

## Shortcuts
- Cmd/Ctrl + Z — undo
- Cmd/Ctrl + Shift + Z — redo (also Ctrl + Y on non-mac)

## Acceptance
- Reorder pages → undo restores order, redo re-applies.
- Delete page → undo restores.
- Add annotation → undo removes it, redo brings it back.
