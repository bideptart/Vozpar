"use client"

import type React from "react"
import { useRef } from "react"
import { Phone, Users, Activity, MessageCircle, Link2 } from "lucide-react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

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
 *  - AmbientWaveform: a full-width animated bar strip evoking a voice
 *    waveform, reinforcing the voice-AI product in the hero background.
 *    Colored (blue → accent gradient per bar) per explicit user request —
 *    the one background element on this page that's allowed brand hue,
 *    since it's literally the product's own waveform motif rather than
 *    generic atmosphere.
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
  { color: "#ffffff", size: 240, left: "2%", top: "12%", duration: 9 },
  { color: "#c8c8c8", size: 170, left: "92%", top: "4%", duration: 11 },
  { color: "#ffffff", size: 200, left: "94%", top: "60%", duration: 10 },
  { color: "#c8c8c8", size: 150, left: "4%", top: "68%", duration: 8 },
  { color: "#c8c8c8", size: 130, left: "16%", top: "38%", duration: 12.5 },
  { color: "#ffffff", size: 150, left: "82%", top: "34%", duration: 10.5 },
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
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            willChange: "opacity",
          }}
          animate={{ opacity: [0.11, 0.19, 0.11] }}
          transition={{
            duration: orb.duration + 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  )
}

const PARTICLE_COUNT = 16

const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  left: (i * 57) % 100,
  top: (i * 43) % 100,
  size: 1.5 + (i % 2),
  duration: 4 + (i % 4),
  delay: (i % 5) * 0.5,
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
          className="absolute rounded-full bg-white"
          style={{ 
            left: `${p.left}%`, 
            top: `${p.top}%`, 
            width: p.size, 
            height: p.size,
            willChange: "opacity"
          }}
          animate={{ opacity: [0.06, 0.55, 0.06] }}
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

const WAVEFORM_BAR_COUNT = 40

/**
 * Mirrored spectrum, not a bottom-anchored bar row. Plain bars pulsing up
 * from the floor is the generic "waveform" everyone reaches for first — this
 * splits each column at a glowing baseline: a tall main bar above it, and a
 * short, dim, blurred mirror of the same bar below it, the way an audio
 * visualizer's reflection reads against a glass floor. The baseline itself
 * is a single bright hairline with its own glow.
 *
 * Performance optimization: Switched from Framer Motion to GPU-accelerated CSS Keyframes
 * to prevent layout thrashing and JS animation loop lag.
 */
export function AmbientWaveform() {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-28">
      <style>{`
        @keyframes pulse-waveform-bar {
          0%, 100% {
            transform: scaleY(calc(var(--peak) * 0.35));
          }
          50% {
            transform: scaleY(var(--peak));
          }
        }
        .waveform-bar-animate {
          animation-name: pulse-waveform-bar;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
      <div className="relative flex h-full items-stretch justify-center gap-[4px] opacity-70">
        {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => {
          const peak = 0.25 + 0.65 * Math.abs(Math.sin(i * 1.37))
          const mix = 40 + peak * 40
          const gradient = `linear-gradient(180deg, color-mix(in srgb, var(--accent) ${mix}%, var(--primary)), var(--primary))`
          const duration = 1.6 + (i % 6) * 0.18
          const delay = (i % 8) * 0.12
          
          return (
            <div key={i} className="flex w-[4px] flex-none flex-col">
              {/* Main bar — the 72% of the column above the baseline. */}
              <div className="flex flex-[0.72] items-end justify-center">
                <span
                  className="w-full origin-bottom rounded-full waveform-bar-animate"
                  style={{
                    height: "100%",
                    background: gradient,
                    boxShadow: "0 0 8px -1px color-mix(in srgb, var(--accent) 60%, transparent)",
                    transformOrigin: "bottom",
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    "--peak": peak,
                  } as React.CSSProperties}
                />
              </div>
              {/* Reflection — same motion, same bar, just shorter/dimmer/
                  blurred and growing downward instead of up. */}
              <div className="flex flex-[0.28] items-start justify-center overflow-hidden opacity-30 blur-[0.5px]">
                <span
                  className="w-full origin-top rounded-full waveform-bar-animate"
                  style={{
                    height: "100%",
                    background: gradient,
                    transformOrigin: "top",
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                    "--peak": peak,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          )
        })}

        {/* Glowing baseline — sits exactly at the 72/28 split above. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0"
          style={{
            bottom: "28%",
            height: 1,
            background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 70%, white), transparent)",
            boxShadow: "0 0 12px 1px color-mix(in srgb, var(--accent) 50%, transparent)",
          }}
        />

        {/* Scanning light — a bright beam that sweeps the whole strip left
            to right on a loop, `mix-blend-mode: screen` so it genuinely
            brightens whatever it's over rather than sitting on top as a flat
            tint. Tinted with the accent instead of plain white so it reads
            as the strip's own light, not a generic sheen. */}
        {!reduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-24"
            style={{
              background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 85%, white), transparent)",
              mixBlendMode: "screen",
              opacity: 0.6,
            }}
            animate={{ left: ["-10%", "110%"] }}
            transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", repeatDelay: 1.5 }}
          />
        )}
      </div>
    </div>
  )
}

export function PulsingDot({ className = "h-1 w-1 rounded-full bg-accent" }: { className?: string }) {
  return (
    <motion.span
      className={className}
      animate={{ scale: [1, 1.7, 1], opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    />
  )
}

const ICON_BADGES = [
  { icon: Phone, left: "7%", top: "24%", size: 44, duration: 7, delay: 0, driftX: 10, driftY: -16 },
  { icon: Users, left: "91%", top: "18%", size: 40, duration: 9, delay: 0.6, driftX: -10, driftY: -16 },
  { icon: Activity, left: "11%", top: "74%", size: 38, duration: 8.5, delay: 1.1, driftX: 10, driftY: -16 },
  { icon: MessageCircle, left: "88%", top: "68%", size: 46, duration: 10, delay: 0.3, driftX: -10, driftY: -16 },
  { icon: Link2, left: "50%", top: "10%", size: 34, duration: 7.5, delay: 1.5, driftX: 8, driftY: -14 },
]

/**
 * Small dark circular icon badges that drift slowly near the hero's edges —
 * an industries-page homage to the floating icon decoration on rozper.com
 * (referenced directly by the user for the background redesign), reusing
 * our own icon set and locked primary/accent colors rather than their exact
 * palette.
 *
 * Performance optimization: Switched from Framer Motion to CSS translate3d keyframes.
 */
export function FloatingIconBadges() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes float-badge {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(var(--drift-x), var(--drift-y), 0);
          }
        }
        .floating-badge {
          animation-name: float-badge;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
      {ICON_BADGES.map((badge, i) => {
        const Icon = badge.icon
        const accent = i % 2 === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)"
        return (
          <div
            key={i}
            className="absolute flex items-center justify-center rounded-full border border-white/10 bg-black/70 backdrop-blur-sm floating-badge"
            style={{ 
              left: badge.left, 
              top: badge.top, 
              width: badge.size, 
              height: badge.size,
              animationDuration: `${badge.duration}s`,
              animationDelay: `${badge.delay}s`,
              "--drift-x": `${badge.driftX}px`,
              "--drift-y": `${badge.driftY}px`,
            } as React.CSSProperties}
          >
            <Icon style={{ color: accent, width: "45%", height: "45%" }} aria-hidden />
          </div>
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
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 })

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
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  )
}
