<p align="center">
<h1 align="center">use-resizable</h1>
</p>

#### Supported Platforms
<img src="https://stefkors.com/api/platform/index.svg?os=web" />

React hook for building resizable panels. Persists width to localStorage, syncs a CSS variable, and handles pointer capture for smooth dragging.

## Install

```bash
bun add @kors/use-resizable
```

## Usage

```tsx
import { useResizable } from "@kors/use-resizable"

function Sidebar() {
  const { width, isResizing, handleMouseDown } = useResizable({
    storageKey: "sidebar-width",
    defaultWidth: 280,
    minWidth: 200,
    maxWidth: 500,
    cssVariableName: "--sidebar-width",
  })

  return (
    <div style={{ width }}>
      <div
        onMouseDown={handleMouseDown}
        style={{ cursor: "col-resize", width: 4 }}
      />
    </div>
  )
}
```

## API

### `useResizable(options): UseResizableReturn`

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `storageKey` | `string` | localStorage key for persisting width |
| `defaultWidth` | `number` | Initial width when no saved value exists |
| `minWidth` | `number` | Minimum allowed width |
| `maxWidth` | `number` | Maximum allowed width |
| `cssVariableName` | `string` | CSS custom property to sync (e.g. `--sidebar-width`) |
| `getOffset` | `() => number` | Optional offset for clientX calculation |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Current panel width |
| `isResizing` | `boolean` | Whether a resize drag is active |
| `handleMouseDown` | `(e: ReactMouseEvent) => void` | Attach to your drag handle element |

## License

MIT
