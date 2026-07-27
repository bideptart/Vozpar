"use client"

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValueEvent } from "motion/react"
import { useState } from "react"

/**
 * Fixed progress bar across the very top of the viewport, filling as the
 * visitor scrolls the page. Sits above the sticky site header (z-50 vs the
 * header's z-40). Mounted once in app/layout.tsx so every route gets it.
 *
 * Pared back after feedback that it felt laggy on laptop trackpads and had
 * a stray "line running ahead" of the actual fill:
 *
 *   • The previous spring (stiffness 260 / damping 34) was overdamped for
 *     mass 0.4 — on a fast trackpad fling the bar visibly fell behind the
 *     real scroll position before catching up, which read as lag rather
 *     than smoothness. Retuned to stiffness 400 / damping 40 / mass 0.3, a
 *     much closer to critically-damped ratio, so it tracks fast scrolling
 *     immediately with just enough easing to not feel mechanical.
 *   • Dropped the live percentage readout — it forced a React re-render on
 *     every scroll-frame update (setState in a useMotionValueEvent
 *     callback), which is exactly the kind of main-thread cost that causes
 *     visible jank on weaker laptops. Everything below is driven purely by
 *     motion values / CSS, so scrolling never triggers a React re-render.
 *   • Dropped the shimmer sweep and the fading spark trail — at low scroll
 *     percentages their bright highlight could visibly slide past the edge
 *     of the small filled sliver, reading as "a line running ahead" of
 *     where the actual scroll position was.
 *
 * What's left: a faint always-on rail, a soft glow riding under the fill,
 * and a small comet head with a gentle breathing halo — motion-only
 * (scaleX/opacity transforms), so it costs nothing beyond the scroll
 * listener Motion already sets up internally.
 */
export function ScrollProgressBar() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [hasScrolled, setHasScrolled] = useState(false)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!hasScrolled && v > 0.002) setHasScrolled(true)
  })

  const smoothed = useSpring(scrollYProgress, { stiffness: 400, damping: 40, mass: 0.3 })
  const progress = reduced ? scrollYProgress : smoothed
  const scaleX = useTransform(progress, (v) => v)
  // The comet head rides at the same percentage along the track's own
  // width — expressed as a left offset rather than baked into the scaleX
  // transform, since the bar and the dot need independent transform-origins.
  const headLeft = useTransform(progress, (v) => `${v * 100}%`)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      style={{ opacity: hasScrolled ? 1 : 0, transition: "opacity 500ms ease-out" }}
    >
      {/* Faint always-on rail so the fill has a visible track to travel along. */}
      <div className="absolute inset-0 bg-white/[0.05]" />

      {/* Blurred glow riding directly beneath the fill — same scaleX, just
          soft-focus, so the bar reads as a beam rather than a flat rect. */}
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-[#046bd2] via-[#2d98f1] to-[#60b8ff] opacity-70 blur-[6px]"
      />

      {/* Crisp fill. */}
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#046bd2] via-[#2d98f1] to-[#60b8ff]"
      />

      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: headLeft }}
        >
          {/* Soft outer halo, gently breathing. */}
          <motion.span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#60b8ff]/40 blur-[6px]"
            animate={{ width: [14, 20, 14], height: [14, 20, 14], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          {/* Bright core dot. */}
          <span
            className="relative block h-[9px] w-[9px] rounded-full bg-white"
            style={{ boxShadow: "0 0 12px 3px rgba(96,184,255,0.9), 0 0 4px 1px rgba(255,255,255,0.8)" }}
          />
        </motion.span>
      )}
    </div>
  )
}
