"use client"

import type React from "react"
import { useRef } from "react"
import { Phone, Users, Activity, MessageCircle, Link2 } from "lucide-react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { cn } from "@/lib/utils"
import { useRafMouse } from "@/lib/use-raf-mouse"

/**
 * Small, industries-page-only animated accents — mostly CSS-driven so the
 * hero stays on the compositor thread without dozens of JS animation loops.
 */

const ORBS = [
  { color: "#38bdf8", size: 220, left: "1%", top: "18%", opacity: 0.12, duration: 11, driftX: 8, delay: 0 },
  { color: "#046bd2", size: 200, left: "93%", top: "30%", opacity: 0.1, duration: 13, driftX: -8, delay: 0.9 },
  { color: "#38bdf8", size: 180, left: "91%", top: "65%", opacity: 0.08, duration: 12, driftX: -6, delay: 1.8 },
  { color: "#046bd2", size: 170, left: "2%", top: "68%", opacity: 0.09, duration: 10, driftX: 6, delay: 2.7 },
]

export function FloatingAccents() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <span
          key={orb.color + i}
          className="industries-orb-drift absolute rounded-full blur-[90px]"
          style={
            {
              background: orb.color,
              opacity: orb.opacity,
              width: orb.size,
              height: orb.size,
              left: orb.left,
              top: orb.top,
              "--ind-drift-x": `${orb.driftX}px`,
              "--ind-drift-y": "-14px",
              "--ind-drift-duration": `${orb.duration}s`,
              "--ind-drift-delay": `${orb.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

const PARTICLE_COUNT = 12

const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 1.5 + (i % 2),
  duration: 4.5 + (i % 4),
  delay: (i % 7) * 0.4,
}))

export function ParticleField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="industries-particle absolute rounded-full bg-[#38bdf8]"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              "--ind-particle-duration": `${p.duration}s`,
              "--ind-particle-delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

const WAVEFORM_BAR_COUNT = 28

export function AmbientWaveform() {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-28">
      <div className="relative flex h-full items-stretch justify-center gap-[4px] opacity-70">
        {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => {
          const peak = 0.25 + 0.65 * Math.abs(Math.sin(i * 1.37))
          const mix = 40 + peak * 40
          const gradient = `linear-gradient(180deg, color-mix(in srgb, var(--accent) ${mix}%, var(--primary)), var(--primary))`
          return (
            <div key={i} className="flex w-[3px] flex-none flex-col">
              <div className="flex flex-[0.72] items-end justify-center">
                <span
                  className={cn("industries-wave-bar h-full w-full rounded-full", reduced && "scale-y-[0.55]")}
                  style={
                    {
                      background: gradient,
                      "--bar-min": peak * 0.4,
                      "--bar-peak": peak,
                      "--bar-duration": `${2.4 + (i % 6) * 0.25}s`,
                      "--bar-delay": `${(i % 8) * 0.12}s`,
                    } as React.CSSProperties
                  }
                />
              </div>
              <div className="flex flex-[0.28] items-start justify-center overflow-hidden opacity-25">
                <span
                  className="h-full w-full origin-top scale-y-[0.45] rounded-full"
                  style={{ background: gradient }}
                />
              </div>
            </div>
          )
        })}

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0"
          style={{
            bottom: "28%",
            height: 1,
            background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 70%, white), transparent)",
          }}
        />

        {!reduced && (
          <span
            aria-hidden
            className="industries-scan-x pointer-events-none absolute inset-y-0 w-28 opacity-[0.42] mix-blend-screen blur-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 75%, white), transparent)",
            }}
          />
        )}
      </div>
    </div>
  )
}

export function PulsingDot({ className = "h-1 w-1 rounded-full bg-accent" }: { className?: string }) {
  return <span className={cn("industries-pulse-dot inline-block", className)} aria-hidden />
}

export const ICON_BADGES = [
  { icon: Phone, left: "7%", top: "24%", size: 44, duration: 9, delay: 0, driftX: 8 },
  { icon: Users, left: "91%", top: "18%", size: 40, duration: 11, delay: 0.6, driftX: -8 },
  { icon: Activity, left: "11%", top: "74%", size: 38, duration: 10.5, delay: 1.1, driftX: 8 },
  { icon: MessageCircle, left: "88%", top: "68%", size: 46, duration: 12, delay: 0.3, driftX: -8 },
  { icon: Link2, left: "50%", top: "10%", size: 34, duration: 9.5, delay: 1.5, driftX: 0 },
]

export const FEATURE_ICON_BADGES = [
  { icon: Phone, left: "2%", top: "6%", size: 40, duration: 9, delay: 0, driftX: 6 },
  { icon: Users, left: "95%", top: "10%", size: 40, duration: 11, delay: 0.6, driftX: -6 },
  { icon: Activity, left: "2%", top: "88%", size: 36, duration: 10.5, delay: 1.1, driftX: 6 },
  { icon: MessageCircle, left: "94%", top: "84%", size: 44, duration: 12, delay: 0.3, driftX: -6 },
  { icon: Link2, left: "48%", top: "2%", size: 34, duration: 9.5, delay: 1.5, driftX: 0 },
]

export function FloatingIconBadges({
  badges = ICON_BADGES,
  className = "hidden lg:block",
}: {
  badges?: typeof ICON_BADGES
  className?: string
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {badges.map((badge, i) => {
        const Icon = badge.icon
        const accent = i % 2 === 0 ? "#2d98f1" : "#046bd2"
        return (
          <span
            key={i}
            className="industries-orb-drift absolute flex items-center justify-center rounded-full border border-[#046bd2]/30 bg-black/90"
            style={
              {
                left: badge.left,
                top: badge.top,
                width: badge.size,
                height: badge.size,
                "--ind-drift-x": `${badge.driftX}px`,
                "--ind-drift-y": "-12px",
                "--ind-drift-duration": `${badge.duration}s`,
                "--ind-drift-delay": `${badge.delay}s`,
              } as React.CSSProperties
            }
          >
            <Icon style={{ color: accent, width: "45%", height: "45%" }} aria-hidden />
          </span>
        )
      })}
    </div>
  )
}

/**
 * Wraps its child (typically a button) in a subtle magnetic hover effect —
 * the element drifts a few px toward the cursor while hovered, and springs
 * back on mouse-leave.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.35 })

  const onPointer = useRafMouse((clientX, clientY) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((clientX - (rect.left + rect.width / 2)) * strength)
    y.set((clientY - (rect.top + rect.height / 2)) * strength)
  })

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => onPointer(e.clientX, e.clientY)}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  )
}
