"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

/** Smooth deceleration — numbers settle gently instead of snapping at the end. */
function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5)
}

/**
 * Shared scroll-triggered count-up number, used by the hero stat strip
 * (stat-strip.tsx). Industries-page-only.
 */
export function CountUp({ value, duration = 1.75 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setDisplay(value)
      return
    }
    let start: number | null = null
    let raf = 0
    function tick(ts: number) {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / (duration * 1000), 1)
      const eased = easeOutQuint(progress)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduced])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}
