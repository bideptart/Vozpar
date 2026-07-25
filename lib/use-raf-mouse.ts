"use client"

import { useCallback, useRef } from "react"

/**
 * Coalesces high-frequency pointer events to one update per frame — keeps
 * spotlight/tilt effects smooth without main-thread pile-up.
 */
export function useRafMouse(handler: (clientX: number, clientY: number) => void) {
  const raf = useRef(0)
  const pending = useRef<{ x: number; y: number } | null>(null)

  return useCallback(
    (clientX: number, clientY: number) => {
      pending.current = { x: clientX, y: clientY }
      if (raf.current) return
      raf.current = requestAnimationFrame(() => {
        raf.current = 0
        const p = pending.current
        if (!p) return
        handler(p.x, p.y)
      })
    },
    [handler],
  )
}
