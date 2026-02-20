import { useEffect, useRef, useState } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"

export interface UseResizableOptions {
  storageKey: string
  defaultWidth: number
  minWidth: number
  maxWidth: number
  cssVariableName: string
  getOffset?: () => number
}

export interface UseResizableReturn {
  width: number
  isResizing: boolean
  handleMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void
}

export function useResizable({
  storageKey,
  defaultWidth,
  minWidth,
  maxWidth,
  cssVariableName,
  getOffset,
}: UseResizableOptions): UseResizableReturn {
  const [width, setWidth] = useState(() => {
    if (typeof window === "undefined") return defaultWidth
    const saved = localStorage.getItem(storageKey)
    if (!saved) return defaultWidth
    const parsed = parseInt(saved, 10)
    return Number.isNaN(parsed) ? defaultWidth : parsed
  })
  const [isResizing, setIsResizing] = useState(false)
  const offsetRef = useRef(0)

  useEffect(() => {
    localStorage.setItem(storageKey, width.toString())
  }, [width, storageKey])

  useEffect(() => {
    document.documentElement.style.setProperty(cssVariableName, `${width}px`)
  }, [width, cssVariableName])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent | PointerEvent) => {
      e.preventDefault()
      const newWidth = e.clientX - offsetRef.current
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(clampedWidth)
    }

    const handleMouseUp = (e: MouseEvent | PointerEvent) => {
      setIsResizing(false)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
      if (e.target instanceof HTMLElement && "releasePointerCapture" in e.target) {
        try {
          const pointerId = "pointerId" in e ? (e as PointerEvent).pointerId : 0
          e.target.releasePointerCapture(pointerId)
        } catch {
          // releasePointerCapture may not be available
        }
      }
    }

    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("pointermove", handleMouseMove)
    document.addEventListener("pointerup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("pointermove", handleMouseMove)
      document.removeEventListener("pointerup", handleMouseUp)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [isResizing, minWidth, maxWidth])

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    offsetRef.current = getOffset?.() ?? 0
    setIsResizing(true)
    const target = e.currentTarget
    if (target instanceof HTMLElement && "setPointerCapture" in target) {
      try {
        const pointerId = (e.nativeEvent as PointerEvent).pointerId ?? 0
        target.setPointerCapture(pointerId)
      } catch {
        // setPointerCapture may not be available in all browsers
      }
    }
  }

  return {
    width,
    isResizing,
    handleMouseDown,
  }
}
