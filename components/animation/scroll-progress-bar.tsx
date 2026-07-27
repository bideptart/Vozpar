"use client"

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react"
import { useState } from "react"

/**
 * Fixed progress bar across the very top of the viewport, filling as the
 * visitor scrolls the page. Sits above the sticky site header (z-50 vs the
 * header's z-40).
 *
 * This is a standalone upgrade of the industries-page-only version
 * (components/industries/scroll-progress.tsx) — that one maps scroll
 * progress straight to scaleX with no easing and no visual finish beyond a
 * flat gradient bar. This version:
 *
 *   • Spring-smooths the fill so it doesn't feel like it's rigidly locked to
 *     the scrollbar — a few frames of catch-up reads as "premium", a 1:1
 *     mapping reads as mechanical. Skipped entirely under reduced-motion.
 *   • Adds a small glowing "comet head" at the leading edge of the fill, so
 *     the bar has a focal point rather than just being a flat rectangle.
 *   • Fades the whole bar in only once the visitor has actually scrolled a
 *     few pixels, so it doesn't sit as a dead, empty hairline at the very
 *     top of a fresh page load.
 *   • Motion-only (scaleX transform + opacity) — no layout writes, so this
 *     costs nothing on the main thread beyond the scroll listener Motion
 *     already sets up internally.
 *
 * Reusable — not scoped to any one page. Drop it in near the top of any
 * page's JSX, above the sticky header, the way the industries page does.
 */
export function ScrollProgressBar() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [hasScrolled, setHasScrolled] = useState(false)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!hasScrolled && v > 0.002) setHasScrolled(true)
  })

  const smoothed = useSpring(scrollYProgress, { stiffness: 260, damping: 34, mass: 0.4 })
  const progress = reduced ? scrollYProgress : smoothed
  const scaleX = useTransform(progress, (v) => v)
  // The comet head rides at the same percentage along the track's own
  // width — expressed as a left offset rather than baked into the scaleX
  // transform, since the bar and the dot need independent transform-origins.
  const headLeft = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
      style={{ opacity: hasScrolled ? 1 : 0, transition: "opacity 400ms ease-out" }}
    >
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#046bd2] via-[#2d98f1] to-[#60b8ff]"
      />
      {!reduced && (
        <motion.span
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#60b8ff]"
          style={{ left: headLeft, boxShadow: "0 0 10px 2px rgba(96,184,255,0.85)" }}
        />
      )}
    </div>
  )
}
