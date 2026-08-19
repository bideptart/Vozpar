"use client"

import { motion, useScroll, useSpring } from "@/lib/motion"

/**
 * Thin fixed bar across the very top of the viewport that fills as the
 * visitor scrolls the industries page. Sits above the sticky site header
 * (z-50 vs the header's z-40). Industries-page-only.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]"
    />
  )
}
