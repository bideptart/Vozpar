"use client"

import { Mic, Volume2 } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Centerpiece visual for the redesigned homepage hero — replaces the old
 * boxy "dashboard mockup" panel with a circular, orbital voice
 * visualization: a pulsing AI orb ringed by a radial waveform, with a
 * couple of floating transcript/stat chips drifting around it. Built as its
 * own file (sibling of hero.tsx / hero-fx.tsx) so the hero section itself
 * stays readable. Homepage-scoped only — no relation to the /industries
 * components.
 */

const BAR_COUNT = 48
const RADIUS = 132

const STAT_CHIPS = [
  { label: "Latency", value: "<300ms", color: "text-primary", top: "8%", left: "84%" },
  { label: "Sentiment", value: "Positive", color: "text-emerald-400", top: "78%", left: "86%" },
  { label: "Intent", value: "Book showing", color: "text-white", top: "86%", left: "6%" },
]

export function HeroVoiceOrb() {
  const reduced = useReducedMotion()

  return (
    <div className="relative mx-auto flex h-[380px] w-[380px] items-center justify-center md:h-[440px] md:w-[440px]">
      {/* Sonar rings ping outward from the center */}
      {!reduced &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute rounded-full border border-primary/25"
            style={{ width: 160, height: 160 }}
            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
            transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: i * 1.2 }}
          />
        ))}

      {/* Radial waveform ring */}
      <div className="absolute inset-0">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const angle = (360 / BAR_COUNT) * i
          const phase = Math.abs(Math.sin(i * 0.9))
          return (
            <motion.span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-1/2 w-[3px] origin-bottom rounded-full"
              style={{
                height: 18,
                background: "linear-gradient(to top, var(--ai-cyan), var(--ai-violet) 60%, var(--ai-magenta))",
                transform: `rotate(${angle}deg) translateY(-${RADIUS}px)`,
              }}
              animate={reduced ? undefined : { scaleY: [0.4 + phase * 0.3, 1.6, 0.4 + phase * 0.3], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.6 + (i % 5) * 0.15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: (i % BAR_COUNT) * 0.03,
              }}
            />
          )
        })}
      </div>

      {/* Center orb */}
      <motion.div
        className="relative flex h-28 w-28 items-center justify-center rounded-full"
        animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: "conic-gradient(from 0deg, var(--ai-cyan), var(--ai-violet), var(--ai-magenta), var(--ai-cyan))",
            opacity: 0.6,
          }}
        />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black">
          <Mic className="h-7 w-7 text-primary" aria-hidden />
        </span>
        <span className="absolute -bottom-1 flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-400/20">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          On call
        </span>
      </motion.div>

      {/* Floating transcript chips */}
      <motion.div
        className="absolute left-[-14%] top-[10%] hidden max-w-[190px] items-start gap-2 rounded-2xl border border-white/10 bg-[#0a0a0d]/95 p-3 text-left backdrop-blur-md md:flex"
        initial={{ opacity: 0, y: 10 }}
        animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/5 text-muted-foreground ring-1 ring-white/10">
          <Volume2 className="h-3 w-3" />
        </span>
        <p className="text-[11px] leading-snug text-white/85">"Hi, I'm calling about the listing on Maple Street."</p>
      </motion.div>

      <motion.div
        className="absolute bottom-[6%] right-[-16%] hidden max-w-[210px] items-start gap-2 rounded-2xl border border-primary/20 bg-primary/[0.06] p-3 text-left backdrop-blur-md md:flex"
        initial={{ opacity: 0, y: -10 }}
        animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
      >
        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
          <Mic className="h-3 w-3" />
        </span>
        <p className="text-[11px] leading-snug text-white/85">
          "Of course — are you looking to schedule a showing this week?"
        </p>
      </motion.div>

      {/* Orbiting stat chips */}
      {STAT_CHIPS.map((chip, i) => (
        <motion.div
          key={chip.label}
          className="absolute hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl border border-white/10 bg-[#0a0a0d]/90 px-3 py-1.5 text-center backdrop-blur-md lg:flex"
          style={{ top: chip.top, left: chip.left }}
          animate={reduced ? undefined : { y: [0, i % 2 === 0 ? -10 : 10, 0] }}
          transition={{ duration: 4.5 + i * 0.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: i * 0.4 }}
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{chip.label}</p>
          <p className={`text-xs font-semibold ${chip.color}`}>{chip.value}</p>
        </motion.div>
      ))}
    </div>
  )
}
