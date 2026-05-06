"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

type MouseGlowCardProps = {
  children: React.ReactNode
  className?: string
  /** Strength of the 3D tilt in degrees */
  tiltStrength?: number
  /** Spotlight radius in pixels */
  glowSize?: number
}

/**
 * MouseGlowCard
 * - Tracks the cursor over the element
 * - Tilts subtly in 3D toward the cursor
 * - Renders a soft cyan spotlight that follows the pointer
 * - Lifts on hover
 */
export function MouseGlowCard({ children, className, tiltStrength = 6, glowSize = 320 }: MouseGlowCardProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  // Normalized -0.5..0.5 for tilt math
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)

  const springCfg = { stiffness: 180, damping: 18, mass: 0.4 }
  const sx = useSpring(nx, springCfg)
  const sy = useSpring(ny, springCfg)

  const rotateX = useTransform(sy, [-0.5, 0.5], [tiltStrength, -tiltStrength])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-tiltStrength, tiltStrength])

  const background = useMotionTemplate`radial-gradient(${glowSize}px circle at ${mouseX}px ${mouseY}px, oklch(0.78 0.16 195 / 0.18), transparent 70%)`

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
    nx.set(x / rect.width - 0.5)
    ny.set(y / rect.height - 0.5)
  }

  function handleLeave() {
    nx.set(0)
    ny.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "group relative rounded-xl border border-border bg-card/60 backdrop-blur",
        "transition-colors duration-300 hover:border-primary/40",
        "[transform-style:preserve-3d]",
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
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-1 ring-inset ring-primary/20 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  )
}
