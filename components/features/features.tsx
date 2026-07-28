"use client"

import { ShieldCheck, Gauge, Globe2, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { useInView, useReducedMotion, animate } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FeatureHero } from "@/components/features/feature-hero"

// Each stat carries its own tint. Four identical blue icons made the band
// read as one repeated cell; giving each a colour lets the eye separate them
// at a glance, matching the tinted-chip system used on the FAQ pills and the
// Industries marquee.
const STATS = [
  { icon: Gauge, prefix: "<", target: 300, decimals: 0, suffix: "ms", label: "Round-trip voice latency", tint: "#2d98f1" },
  { icon: Globe2, prefix: "", target: 60, decimals: 0, suffix: "+", label: "Countries with local numbers", tint: "#10b981" },
  // 99.9, not 99.95 — this has to match what /sla actually commits to
  // ("at least 99.9% of the time each calendar month"). Marketing a tighter
  // number than the contract is the kind of thing a procurement review
  // catches, and the credits schedule is written against 99.9.
  { icon: ShieldCheck, prefix: "", target: 99.9, decimals: 1, suffix: "%", label: "Monthly uptime commitment", tint: "#a855f7" },
  { icon: Clock, prefix: "", target: 24, decimals: 0, suffix: "/7", label: "Autonomous call handling", tint: "#f59e0b" },
]

function AnimatedStat({
  icon: Icon,
  prefix,
  target,
  decimals,
  suffix,
  label,
  tint,
}: {
  icon: ElementType
  prefix: string
  target: number
  decimals: number
  suffix: string
  label: string
  tint: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  // `once: false` — the count-up replays every time the band scrolls back into
  // view, not just the first time. When it leaves the viewport the value is
  // reset to 0 (below) so the next entry starts the run over.
  const inView = useInView(ref, { margin: "-80px" })
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) {
      // Left the viewport — park at 0 so re-entry animates from the start.
      // Reduced-motion users just hold the final value; nothing to reset.
      if (!reduced) setValue(0)
      return
    }
    if (reduced) {
      setValue(target)
      return
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, target, reduced])

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center gap-2.5 px-3 py-7 text-center sm:px-4 sm:py-8"
    >
      {/* Ambient tint wash from the top of the cell, revealed on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(120% 90% at 50% 0%, ${tint}14, transparent 70%)` }}
      />

      {/* Top accent bar — moved from the bottom edge to the top so it aligns
          with the wash above and doesn't collide with the grid's own
          dividing rules. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px scale-x-0 opacity-0 transition-[transform,opacity] duration-300 group-hover:scale-x-100 group-hover:opacity-100 sm:inset-x-6"
        style={{ background: tint }}
      />

      {/* Icon in a tinted badge rather than a bare glyph — gives the cell a
          fixed visual anchor and lets each stat own a colour. */}
      <span
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
        style={{
          borderColor: `${tint}33`,
          background: `linear-gradient(155deg, ${tint}1f, ${tint}08)`,
          color: tint,
          boxShadow: `0 6px 18px -10px ${tint}80`,
        }}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>

      {/* Number gets a subtle vertical gradient so it reads as a display
          figure instead of flat body text. */}
      <span
        className="relative font-heading text-[1.75rem] font-semibold tracking-[-0.03em] transition-transform duration-300 group-hover:scale-[1.04] sm:text-[2rem] md:text-[2.35rem]"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.72) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>

      <span className="relative text-[11px] leading-snug text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80 sm:text-xs">
        {label}
      </span>
    </div>
  )
}

export function Features() {
  return (
    <>
      {/* Hero — copy left, orbiting visual right. Lives in its own file: it
          carries a good deal of parallax and scroll wiring that has nothing to
          do with the stats band below. */}
      <FeatureHero />

      {/* Stats — quick credibility band, counts up into view */}
      <section
        className="features-hero-dark relative border-t border-border"
        style={{ background: "var(--features-hero-bg)" }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 md:py-14">
          <ScrollReveal>
            <div
              // Explicit nth-child borders rather than `divide-*`. Tailwind's
              // divide utilities target `:not(:last-child)`, which on a 2×2
              // grid puts a bottom rule under cell 3 (dangling half way across
              // the second row) and a right rule on cell 2 (doubling the
              // container border). The two rule sets are scoped to opposite
              // sides of `sm` so they never fight over the same property.
              className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-[#050506] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] [&>*]:border-border max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r sm:grid-cols-4 sm:[&>*:not(:last-child)]:border-r"
            >
              {STATS.map((s) => (
                <AnimatedStat key={s.label} {...s} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
