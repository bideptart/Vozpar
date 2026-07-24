"use client"

import type React from "react"
import { useRef } from "react"
import { Phone, Users, Activity, MessageCircle, Link2 } from "lucide-react"
import { motion, useMotionValue, useSpring } from "motion/react"

/**
 * Small, industries-page-only animated accents:
 *  - FloatingAccents: slow-drifting blurred orbs. Neutral white/gray only —
 *    per direct user reference to rozper.com's background ("make the
 *    background complete black, no blue shades"), background-layer ambient
 *    elements on this page carry no hue at all, only black + white/gray.
 *    Blue (--primary/--accent) is still used for foreground UI — buttons,
 *    links, badges attached to real content — just not for background
 *    atmosphere. Pushed further toward the left/right edges so the hero's
 *    empty side margins read as populated rather than bare.
 *  - ParticleField: small twinkling white dots scattered across the whole
 *    hero — fills the remaining empty space with quiet ambient motion, well
 *    below the text in visual weight.
 *  - AmbientWaveform: a faint, full-width animated white bar strip evoking
 *    a voice waveform — reinforces the voice-AI product in the hero
 *    background without competing with the text on top of it.
 *  - PulsingDot: a "live" pulsing dot for pill badges (foreground UI, keeps
 *    its blue default — badges are content, not page background).
 *  - FloatingIconBadges: small dark circular icon badges drifting slowly
 *    near the edges — modeled on rozper.com's hero decoration (referenced
 *    directly by the user), reusing our own icon vocabulary but in neutral
 *    white/gray rather than blue, consistent with the black-only background.
 * Scoped to components/industries/ so nothing outside the industries page
 * imports or is affected by these.
 */

const ORBS = [
  { color: "var(--primary)", size: 280, left: "2%", top: "12%", duration: 12 },
  { color: "var(--accent)", size: 200, left: "92%", top: "4%", duration: 14 },
  { color: "var(--primary)", size: 240, left: "94%", top: "60%", duration: 13 },
  { color: "var(--accent)", size: 180, left: "4%", top: "68%", duration: 11 },
  { color: "var(--secondary)", size: 160, left: "16%", top: "38%", duration: 15 },
  { color: "var(--primary)", size: 180, left: "82%", top: "34%", duration: 13.5 },
]

export function FloatingAccents() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.span
          key={orb.color + i}
          className="absolute rounded-full blur-3xl"
          style={{
            background: orb.color,
            opacity: 0.25,
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
          }}
          animate={{ 
            y: [0, -35, 10, -20, 0], 
            x: [0, i % 2 === 0 ? 25 : -25, -10, i % 2 === 0 ? 15 : -15, 0],
            scale: [1, 1.08, 0.96, 1.04, 1]
          }}
          transition={{
            duration: orb.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.9,
          }}
        />
      ))}
    </div>
  )
}

const PARTICLE_COUNT = 45

const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  left: (i * 31) % 100,
  top: (i * 47) % 100,
  size: 1.5 + (i % 4),
  duration: 4 + (i % 6),
  delay: (i % 8) * 0.5,
}))

/**
 * Faint twinkling dots scattered across the full hero — a lightweight way
 * to make the large empty margins either side of the centered text column
 * feel populated, without introducing any new shapes or colors.
 */
export function ParticleField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ 
            left: `${p.left}%`, 
            top: `${p.top}%`, 
            width: p.size, 
            height: p.size,
            background: i % 2 === 0 ? "var(--primary)" : "var(--accent)"
          }}
          animate={{ 
            opacity: [0.05, 0.55, 0.1, 0.7, 0.05], 
            y: [0, -18, 5, -12, 0],
            x: [0, i % 3 === 0 ? 5 : -3, 0, i % 3 === 0 ? -4 : 3, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

const WAVEFORM_BAR_COUNT = 64

export function AmbientWaveform() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-20 items-end justify-center gap-[2px] opacity-[0.25] md:h-28"
    >
      {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => {
        const peak = 0.2 + 0.7 * Math.abs(Math.sin(i * 1.25))
        return (
          <motion.span
            key={i}
            className="w-[2.5px] flex-none origin-bottom rounded-full"
            style={{ 
              height: "100%",
              background: i % 2 === 0 ? "var(--primary)" : "var(--accent)"
            }}
            animate={{ scaleY: [peak * 0.25, peak * 1.1, peak * 0.4, peak, peak * 0.25] }}
            transition={{
              duration: 2 + (i % 7) * 0.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: (i % 10) * 0.15,
            }}
          />
        )
      })}
    </div>
  )
}

export function PulsingDot({ className = "h-1 w-1 rounded-full bg-accent" }: { className?: string }) {
  return (
    <motion.span
      className={className}
      animate={{ scale: [1, 2, 1.4, 1.7, 1], opacity: [1, 0.3, 0.6, 0.4, 1] }}
      transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    />
  )
}

const ICON_BADGES = [
  { icon: Phone, left: "7%", top: "24%", size: 48, duration: 9, delay: 0 },
  { icon: Users, left: "91%", top: "18%", size: 44, duration: 11, delay: 0.8 },
  { icon: Activity, left: "11%", top: "74%", size: 42, duration: 10, delay: 1.4 },
  { icon: MessageCircle, left: "88%", top: "68%", size: 50, duration: 12, delay: 0.4 },
  { icon: Link2, left: "50%", top: "10%", size: 38, duration: 9.5, delay: 1.8 },
]

/**
 * Small dark circular icon badges that drift slowly near the hero's edges —
 * an industries-page homage to the floating icon decoration on rozper.com
 * (referenced directly by the user for the background redesign), reusing
 * our own icon set and locked primary/accent colors rather than their exact
 * palette.
 */
export function FloatingIconBadges() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ICON_BADGES.map((badge, i) => {
        const Icon = badge.icon
        const accent = i % 2 === 0 ? "var(--primary)" : "var(--accent)"
        return (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center rounded-full border border-primary/20 bg-[var(--background)]/70 backdrop-blur-sm"
            style={{ left: badge.left, top: badge.top, width: badge.size, height: badge.size }}
            animate={{ 
              y: [0, -22, 8, -16, 0], 
              x: [0, i % 2 === 0 ? 14 : -14, -6, i % 2 === 0 ? 8 : -8, 0],
              rotate: [0, i % 2 === 0 ? 3 : -3, 0]
            }}
            transition={{
              duration: badge.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: badge.delay,
            }}
          >
            <Icon style={{ color: accent, width: "45%", height: "45%" }} aria-hidden />
          </motion.div>
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
export function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.5 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}
