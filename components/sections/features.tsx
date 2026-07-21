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
  { icon: ShieldCheck, prefix: "", target: 99.95, decimals: 2, suffix: "%", label: "Platform uptime SLA" },
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
              className="grid grid-cols-2 divide-y divide-border overflow-hidden rounded-2xl border border-border sm:grid-cols-4 sm:divide-x sm:divide-y-0"
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
