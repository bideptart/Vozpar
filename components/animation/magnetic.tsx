"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

/**
 * Magnetic
 * Pulls its child toward the cursor while the pointer is inside it, then
 * springs home on leave.
 *
 * Two details that matter:
 *   1. The offset is measured from the element's own centre, not from the
 *      pointer's page position, so it stays correct after scroll or layout
 *      shift without any listeners.
 *   2. `strength` is a fraction of the distance to the edge, not a pixel
 *      value — so a wide button and a small icon pull by proportionally the
 *      same amount instead of the small one flying off its own bounds.
 *
 * Wraps in a span rather than a div: these mostly sit inside flex rows of
 * buttons and links, where a block-level wrapper would break the alignment.
 */
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: React.ReactNode
  className?: string
  /** Fraction of the cursor's offset from centre to follow. 0 disables. */
  strength?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 })

  // Reduced motion gates the handlers, never the element. `useReducedMotion()`
  // is null on the server and a real boolean on the client's first paint, so
  // swapping the rendered node here would hand React a different tree to
  // hydrate — the motion values simply stay at 0 instead.
  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

/**
 * SpotlightPanel
 * Tracks the cursor as two CSS custom properties on the wrapper so children
 * can position a radial highlight without re-rendering React on every mouse
 * move. Writing to style directly (rather than through state) keeps this at
 * zero renders per frame.
 */
export function SpotlightPanel({
  children,
  className,
  style,
  glow = "var(--features-blue)",
  size = 420,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glow?: string
  size?: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={ref}
      className={cn("group/spot relative", className)}
      style={style}
      onPointerMove={(e) => {
        if (reduced) return
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty("--spot-x", `${e.clientX - r.left}px`)
        el.style.setProperty("--spot-y", `${e.clientY - r.top}px`)
      }}
    >
      {/* Rendered unconditionally. Gating this node on `reduced` would drop a
          DOM element between the server tree (where useReducedMotion() is
          null) and the client's, which React treats as a hydration error
          rather than a warning. The handler above is what's gated; without it
          the highlight just sits at its default position.

          Mix dropped from 16% to 6% and the falloff pulled in tighter (55%
          instead of 70%) — at the old strength this read as a wash across
          most of a large panel on hover, not the "small local glow" the
          /features theme is supposed to keep colour to. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in srgb, ${glow} 6%, transparent), transparent 55%)`,
        }}
      />
      {children}
    </div>
  )
}
