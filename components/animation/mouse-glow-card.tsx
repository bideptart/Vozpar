"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "@/lib/motion"
import { cn } from "@/lib/utils"

type MouseGlowCardProps = {
  children: React.ReactNode
  className?: string
  /** Spotlight radius in pixels */
  glowSize?: number
  /** Any valid CSS color (hex, oklch, color-mix, var()...) for the spotlight + hover ring */
  glowColor?: string
  /** If set, renders a thin gradient bar flush against the card's true left edge */
  accentColor?: string
}

/**
 * MouseGlowCard
 * - Tracks the cursor over the element
 * - Renders a soft spotlight (glowColor) that eases toward the pointer
 * - Lifts on hover
 *
 * Note: an earlier version also tilted the card in 3D toward the cursor
 * (rotateX/rotateY + translateZ). Removed — combining that with
 * `overflow-hidden` (needed to clip the spotlight/accent bar to the
 * rounded corners) fights browsers' 3D rendering and, with no `perspective`
 * set anywhere, never looked like real depth anyway. The spotlight + lift
 * alone is the reliable part of the effect.
 */
export function MouseGlowCard({
  children,
  className,
  glowSize = 320,
  glowColor = "oklch(0.637 0.237 25.33 / 0.18)",
  accentColor,
}: MouseGlowCardProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 200, damping: 22, mass: 0.4 }
  const sx = useSpring(mouseX, springCfg)
  const sy = useSpring(mouseY, springCfg)

  const background = useMotionTemplate`radial-gradient(${glowSize}px circle at ${sx}px ${sy}px, ${glowColor}, transparent 70%)`

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "group relative rounded-xl border border-border bg-card/60 backdrop-blur",
        "transition-colors duration-300 hover:border-primary/40",
        className,
      )}
    >
      {/* Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{ background }}
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Subtle border-light on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${glowColor}` }}
      />
      {/* Left accent bar — lives here (not in children) so it stays flush
          with the card's true edge regardless of the caller's padding */}
      {accentColor && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-50 transition-transform duration-500 group-hover:scale-y-100"
          style={{ background: `linear-gradient(180deg, transparent, ${accentColor}, transparent)` }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  )
}
