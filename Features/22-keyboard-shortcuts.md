# 22 — Keyboard Shortcuts

## Map
| Key | Action |
|---|---|
| Cmd/Ctrl + Z | Undo |
| Cmd/Ctrl + Shift + Z / Ctrl + Y | Redo |
| Delete / Backspace | Delete selected page(s) or annotation |
| R | Rotate selected page(s) +90° |
| Shift + R | Rotate selected page(s) -90° |
| D | Duplicate selected page(s) |
| Cmd/Ctrl + A | Select all pages |
| Esc | Deselect / exit current tool |
| Cmd/Ctrl + S | Download (export) |
| ↑/↓ | Move selection by 1 |
| Page Up/Down | Scroll viewport one page |
| T | Text tool |
| H | Highlight tool |
| P | Pen (draw) tool |
| I | Image tool |
| S | Signature tool |

## Files
- `src/hooks/useShortcuts.ts`

## Acceptance
- Each shortcut works only when editor route is active and no text input is focused.
- Visible in a `?` help modal (Cmd/Ctrl+/).
