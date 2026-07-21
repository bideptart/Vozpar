"use client"

import { ShieldCheck, Gauge, Globe2, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { useInView, animate } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FeatureHero } from "@/components/sections/feature-hero"

const STATS = [
  { icon: Gauge, prefix: "<", target: 300, decimals: 0, suffix: "ms", label: "Round-trip voice latency" },
  { icon: Globe2, prefix: "", target: 60, decimals: 0, suffix: "+", label: "Countries with local numbers" },
  // 99.9, not 99.95 — this has to match what /sla actually commits to
  // ("at least 99.9% of the time each calendar month"). Marketing a tighter
  // number than the contract is the kind of thing a procurement review
  // catches, and the credits schedule is written against 99.9.
  { icon: ShieldCheck, prefix: "", target: 99.9, decimals: 1, suffix: "%", label: "Monthly uptime commitment" },
  { icon: Clock, prefix: "", target: 24, decimals: 0, suffix: "/7", label: "Autonomous call handling" },
]

function AnimatedStat({
  icon: Icon,
  prefix,
  target,
  decimals,
  suffix,
  label,
}: {
  icon: ElementType
  prefix: string
  target: number
  decimals: number
  suffix: string
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, target])

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-3 py-6 text-center sm:px-4 sm:py-7">
      <Icon className="h-4 w-4" style={{ color: "var(--features-blue)" }} aria-hidden="true" />
      <span className="font-heading text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl md:text-4xl">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <span className="text-[11px] leading-snug text-muted-foreground sm:text-xs">{label}</span>
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
              className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border [&>*]:border-border max-sm:[&>*:nth-child(-n+2)]:border-b max-sm:[&>*:nth-child(odd)]:border-r sm:grid-cols-4 sm:[&>*:not(:last-child)]:border-r"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--features-blue) 10%, transparent), color-mix(in srgb, var(--features-blue-deep) 10%, transparent))",
              }}
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
