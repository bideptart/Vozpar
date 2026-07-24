"use client"

import { Phone, AudioLines, MessageCircle, Zap, Signal, Sparkles } from "lucide-react"
import { motion } from "motion/react"

/**
 * Homepage-hero-only ambient background accents. Self-contained sibling of
 * hero.tsx — deliberately NOT importing the /industries-scoped
 * components/industries/industries-fx.tsx (that file is documented as
 * scoped to the industries page only). Mirrors the same visual language
 * established there (drifting blurred orbs, twinkling particles, floating
 * icon badges), rebuilt fresh here so each page owns its own background
 * component and neither page's edits can affect the other. Icon-badge count
 * and particle density bumped up on request to fill out the large empty
 * space around the centered hero content.
 */

const ORBS = [
  { color: "var(--primary)", size: 460, left: "-8%", top: "8%", opacity: 0.14, duration: 18 },
  { color: "var(--accent)", size: 420, left: "88%", top: "42%", opacity: 0.1, duration: 22 },
  { color: "#ffffff", size: 200, left: "6%", top: "70%", opacity: 0.06, duration: 14 },
  { color: "#ffffff", size: 160, left: "78%", top: "10%", opacity: 0.08, duration: 12 },
  { color: "var(--primary)", size: 260, left: "40%", top: "85%", opacity: 0.08, duration: 16 },
]

export function HeroOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-[120px] [will-change:transform]"
          style={{
            background: orb.color,
            opacity: orb.opacity,
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
          }}
          animate={{ x: [0, i % 2 === 0 ? 40 : -40, 0], y: [0, i % 2 === 0 ? -30 : 20, 0] }}
          transition={{ duration: orb.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.6 }}
        />
      ))}
    </div>
  )
}

const PARTICLE_COUNT = 40

const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  left: (i * 41) % 100,
  top: (i * 29) % 100,
  size: 2 + (i % 3),
  duration: 3 + (i % 5),
  delay: (i % 7) * 0.35,
}))

export function HeroParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0.06, 0.55, 0.06], y: [0, -10, 0] }}
          transition={{ duration: p.duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  )
}

const ICON_BADGES = [
  { icon: Phone, left: "6%", top: "20%", size: 42, duration: 8, delay: 0 },
  { icon: AudioLines, left: "93%", top: "16%", size: 38, duration: 9.5, delay: 0.4 },
  { icon: MessageCircle, left: "10%", top: "58%", size: 36, duration: 7.5, delay: 1 },
  { icon: Zap, left: "90%", top: "62%", size: 34, duration: 10, delay: 0.7 },
  { icon: Signal, left: "18%", top: "84%", size: 32, duration: 8.5, delay: 1.4 },
  { icon: Sparkles, left: "84%", top: "88%", size: 34, duration: 9, delay: 0.2 },
  { icon: Phone, left: "50%", top: "6%", size: 30, duration: 7, delay: 1.8 },
]

/**
 * Small dark circular icon badges drifting near the hero's edges — same
 * visual language as the industries page's FloatingIconBadges, rebuilt
 * fresh here (icon set swapped to communications/audio icons relevant to
 * the homepage's voice-agent product) to keep the two pages' fx files
 * independent.
 */
export function HeroIconBadges() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ICON_BADGES.map((badge, i) => {
        const Icon = badge.icon
        const accent = i % 2 === 0 ? "rgba(255,255,255,0.8)" : "var(--primary)"
        return (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center rounded-full border border-white/10 bg-black/70 backdrop-blur-sm"
            style={{ left: badge.left, top: badge.top, width: badge.size, height: badge.size }}
            animate={{ y: [0, -14, 0], x: [0, i % 2 === 0 ? 8 : -8, 0] }}
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
 * Diagonal light sweep drifting slowly across the whole hero — a subtle,
 * distinguishing flourish (not used on /industries) to make this hero read
 * as its own thing rather than a re-skin.
 */
export function HeroLightSweep() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -inset-x-1/4 -inset-y-1/4 -rotate-12"
      style={{
        background: "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 10%, transparent) 45%, transparent 60%)",
      }}
      animate={{ x: ["-30%", "30%", "-30%"] }}
      transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    />
  )
}
