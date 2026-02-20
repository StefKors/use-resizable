import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useResizable } from "../src/index"

const defaultOptions = {
  storageKey: "test-width",
  defaultWidth: 300,
  minWidth: 100,
  maxWidth: 600,
  cssVariableName: "--panel-width",
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.style.removeProperty("--panel-width")
})

describe("useResizable", () => {
  it("returns the default width when no saved value exists", () => {
    const { result } = renderHook(() => useResizable(defaultOptions))
    expect(result.current.width).toBe(300)
  })

  it("restores width from localStorage", () => {
    localStorage.setItem("test-width", "450")
    const { result } = renderHook(() => useResizable(defaultOptions))
    expect(result.current.width).toBe(450)
  })

  it("persists width to localStorage on change", () => {
    renderHook(() => useResizable(defaultOptions))
    expect(localStorage.getItem("test-width")).toBe("300")
  })

  it("sets the CSS variable on the document element", () => {
    renderHook(() => useResizable(defaultOptions))
    expect(document.documentElement.style.getPropertyValue("--panel-width")).toBe("300px")
  })

  it("starts with isResizing as false", () => {
    const { result } = renderHook(() => useResizable(defaultOptions))
    expect(result.current.isResizing).toBe(false)
  })

  it("returns a handleMouseDown function", () => {
    const { result } = renderHook(() => useResizable(defaultOptions))
    expect(typeof result.current.handleMouseDown).toBe("function")
  })

  it("ignores non-numeric values in localStorage", () => {
    localStorage.setItem("test-width", "not-a-number")
    const { result } = renderHook(() => useResizable(defaultOptions))
    expect(result.current.width).toBe(defaultOptions.defaultWidth)
  })

  it("uses different storage keys independently", () => {
    localStorage.setItem("key-a", "200")
    localStorage.setItem("key-b", "400")
    const { result: a } = renderHook(() =>
      useResizable({ ...defaultOptions, storageKey: "key-a" })
    )
    const { result: b } = renderHook(() =>
      useResizable({ ...defaultOptions, storageKey: "key-b" })
    )
    expect(a.current.width).toBe(200)
    expect(b.current.width).toBe(400)
  })
})
