"use client"

import type { ElementType } from "react"
import { useEffect, useState } from "react"
import { AudioLines, PhoneCall, Wrench, ShieldCheck, Activity, Languages } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

/**
 * FeatureOrbit
 * The /features hero visual: a glowing voice core with feature icons
 * orbiting it on two counter-rotating rings, plus a live waveform and
 * floating status chips.
 *
 * The icons counter-rotate against their ring (`rotate: -360` on the inner
 * wrapper vs `+360` on the ring) so each badge stays upright while it
 * travels — otherwise the glyphs tumble as they go around.
 */

const INNER = [
  { icon: AudioLines, label: "Realtime audio" },
  { icon: PhoneCall, label: "Telephony" },
  { icon: Languages, label: "Multilingual" },
]

const OUTER = [
  { icon: Wrench, label: "Tools" },
  { icon: Activity, label: "Analytics" },
  { icon: ShieldCheck, label: "Compliance" },
]

/**
 * Places `count` items evenly around a circle, as percentages of the
 * container box.
 *
 * The results are rounded because Math.cos/Math.sin are explicitly
 * implementation-dependent in the ECMAScript spec: Node and the browser can
 * return values that differ in the last bits (50 - 14.499999999999998 vs
 * 50 - 14.5). Those land in an inline `style` string, so the SSR HTML and
 * the client render disagree and React throws a hydration mismatch.
 * Rounding to 3dp collapses both to the same string — visually identical,
 * deterministic across runtimes.
 */
function orbitPositions(count: number, radius: number, offsetTurns = 0) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count + offsetTurns) * Math.PI * 2
    return {
      left: Number((50 + Math.cos(angle) * radius).toFixed(3)),
      top: Number((50 + Math.sin(angle) * radius).toFixed(3)),
    }
  })
}

// Computed once at module load, not per render — same values on server and client.
// The inner ring is offset half a step so its badges sit in the gaps between
// the outer ones instead of lining up radially behind them.
const OUTER_POS = orbitPositions(OUTER.length, 44)
const INNER_POS = orbitPositions(INNER.length, 29, 1 / (INNER.length * 2))

function Ring({
  items,
  positions,
  duration,
  reverse,
  paused,
}: {
  items: readonly { icon: ElementType; label: string }[]
  positions: { left: number; top: number }[]
  duration: number
  reverse?: boolean
  paused: boolean
}) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={paused ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {items.map((item, i) => {
        const { left, top } = positions[i]
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card/85 backdrop-blur-md"
              style={{ color: "var(--features-blue)" }}
              animate={paused ? undefined : { rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </motion.div>
          </div>
        )
      })}
    </motion.div>
  )
}

export function FeatureOrbit() {
  const reduced = useReducedMotion()

  // This was the one animated visual on the site with no mobile gate at
  // all — two counter-rotating rings, three expanding pulse rings, and a
  // 7-bar waveform, all `repeat: Infinity`, running full-tilt on every
  // device including a low-end phone. `paused` (reduced-motion OR mobile)
  // turns off the transform loops there; the rings and core still render,
  // just static, same as every other section touched this session.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])
  const paused = Boolean(reduced) || isMobile

  return (
    <div
      className="pointer-events-none relative mx-auto aspect-square w-full max-w-[420px]"
      aria-hidden="true"
    >
      {/* Ambient glow removed — it was a 45%-strength blurred blue fill
          behind the whole orbit, which is exactly the flat black canvas the
          rest of /features deliberately has none of. The core's own waveform
          bars and the ring borders below still carry the blue accent. */}

      {/* Static ring guides */}
      <div className="absolute inset-[8%] rounded-full border border-dashed border-border" />
      <div className="absolute inset-[26%] rounded-full border border-border" />

      {/* Expanding pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-[30%] rounded-full border"
          style={{ borderColor: "color-mix(in srgb, var(--features-blue) 40%, transparent)" }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={paused ? undefined : { scale: [0.7, 1.9], opacity: [0.6, 0] }}
          transition={{ duration: 3.6, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: i * 1.2 }}
        />
      ))}

      {/* Orbiting feature badges — radii as % of the container */}
      <Ring items={OUTER} positions={OUTER_POS} duration={38} paused={paused} />
      <Ring items={INNER} positions={INNER_POS} duration={26} reverse paused={paused} />

      {/* Core */}
      <div className="absolute inset-[32%] flex items-center justify-center rounded-full border border-border bg-card/85 backdrop-blur-md">
        <div className="flex h-12 items-end gap-[3px]">
          {[0.5, 0.85, 1, 0.65, 0.95, 0.55, 0.8].map((peak, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: "100%",
                transformOrigin: "bottom",
                background: "linear-gradient(to top, var(--features-blue-deep), var(--features-blue))",
              }}
              initial={{ scaleY: 0.25 }}
              animate={paused ? { scaleY: 0.6 } : { scaleY: [0.25, peak, 0.4, peak * 0.75, 0.25] }}
              transition={{
                duration: 1.5 + i * 0.08,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.07,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
