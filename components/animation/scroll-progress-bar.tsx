"use client"

import {
  motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform,
} from "motion/react"
import { useState } from "react"

/**
 * Fixed progress bar across the very top of the viewport, filling as the
 * visitor scrolls the page. Sits above the sticky site header (z-50 vs the
 * header's z-40). Mounted once in app/layout.tsx so every route gets it.
 *
 *   • Spring-smooths the fill so it doesn't feel rigidly locked to the
 *     scrollbar — skipped entirely under reduced-motion.
 *   • A soft blurred glow rides directly under the fill, so the bar reads as
 *     a beam of light rather than a flat rectangle, plus a shimmer sweep
 *     that travels through the filled portion only.
 *   • The comet head's color travels through the site's own multi-tint
 *     accent family (blue → violet → emerald → amber) as you scroll, with a
 *     three-dot fading spark trail behind it — so the bar itself feels alive
 *     rather than a static gauge.
 *   • A small live percentage readout floats above the head once scrolling
 *     has started.
 *   • Reaching the very bottom of the page triggers a one-off bright flash
 *     across the whole bar — a small "you've reached the end" payoff.
 *   • Fades the whole thing in only once the visitor has actually scrolled a
 *     few pixels, so it doesn't sit as a dead, empty hairline on first paint.
 */
export function ScrollProgressBar() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [percent, setPercent] = useState(0)
  const [justCompleted, setJustCompleted] = useState(false)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!hasScrolled && v > 0.002) setHasScrolled(true)
    const pct = Math.round(v * 100)
    setPercent((prev) => (prev === pct ? prev : pct))
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.997) setJustCompleted(true)
    else if (v < 0.9) setJustCompleted(false)
  })

  const smoothed = useSpring(scrollYProgress, { stiffness: 260, damping: 34, mass: 0.4 })
  const progress = reduced ? scrollYProgress : smoothed
  const scaleX = useTransform(progress, (v) => v)
  // The comet head rides at the same percentage along the track's own
  // width — expressed as a left offset rather than baked into the scaleX
  // transform, since the bar and the dot need independent transform-origins.
  const headLeft = useTransform(progress, (v) => `${v * 100}%`)
  // Travels through the site's established multi-tint accent family as the
  // visitor moves through the page, instead of staying one flat color.
  const liveColor = useTransform(
    progress,
    [0, 0.33, 0.66, 1],
    ["#2d98f1", "#8b5cf6", "#10b981", "#f59e0b"],
  )
  // Three fixed, precomputed transforms for the spark trail — kept out of
  // the render-time .map() below so hook count/order stays constant.
  const trailLeft1 = useTransform(progress, (v) => `calc(${v * 100}% - 10px)`)
  const trailLeft2 = useTransform(progress, (v) => `calc(${v * 100}% - 20px)`)
  const trailLeft3 = useTransform(progress, (v) => `calc(${v * 100}% - 32px)`)
  const trailLefts = [trailLeft1, trailLeft2, trailLeft3]

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
        className="relative h-full w-full origin-left bg-gradient-to-r from-[#046bd2] via-[#2d98f1] to-[#60b8ff]"
      >
        {!reduced && (
          <motion.div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1/4 origin-left bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ transformOrigin: "left" }}
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.4, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {/* One-off bright flash across the whole bar when the visitor reaches
          the very bottom of the page. */}
      <AnimatePresence>
        {justCompleted && !reduced && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      {!reduced && (
        <>
          {/* Fading spark trail — three dots riding a few pixels behind the
              head, each dimmer and further back than the last. */}
          {trailLefts.map((left, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
              style={{
                left,
                background: liveColor,
                width: 5 - i,
                height: 5 - i,
              }}
              animate={{ opacity: [0.5 - i * 0.12, 0.15 - i * 0.03, 0.5 - i * 0.12] }}
              transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}

          <motion.span
            aria-hidden
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: headLeft }}
          >
            {/* Live percentage readout. */}
            <motion.span
              className="absolute -top-[22px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums text-white/70 backdrop-blur-sm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: hasScrolled ? 1 : 0, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {percent}%
            </motion.span>

            {/* Soft outer halo, gently breathing, colored by scroll position. */}
            <motion.span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[6px]"
              style={{ background: liveColor }}
              animate={{ width: [14, 20, 14], height: [14, 20, 14], opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            {/* Bright core dot. */}
            <motion.span
              className="relative block h-[9px] w-[9px] rounded-full bg-white"
              style={{ boxShadow: "0 0 12px 3px rgba(96,184,255,0.9), 0 0 4px 1px rgba(255,255,255,0.85)" }}
              animate={{ scale: justCompleted ? [1, 1.6, 1] : 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.span>
        </>
      )}
    </div>
  )
}
