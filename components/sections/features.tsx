"use client"

import { ShieldCheck, ArrowRight, Gauge, Globe2, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { motion, useInView, animate, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FeatureOrbit } from "@/components/animation/feature-orbit"
import { Button } from "@/components/ui/button"

// Status chips that float around the hero visual — small live-telemetry
// cues that make the orbit read as a running system rather than art.
const HERO_CHIPS = [
  { label: "Call connected", dot: "bg-emerald-400", pos: "-left-2 top-10 md:-left-6", dur: 4, delay: 0 },
  { label: "Booking confirmed", dot: "bg-sky-400", pos: "-right-2 top-1/3 md:-right-6", dur: 5, delay: 0.8 },
  { label: "CRM synced", dot: "bg-indigo-400", pos: "bottom-12 left-2 md:left-0", dur: 4.6, delay: 1.4 },
] as const

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
  const reduced = useReducedMotion()
  return (
    <>
      {/* Hero — copy left, animated orbit visual right (mirrors the
          homepage's product-visual layout so the two pages feel related). */}
      {/* min-height only kicks in from lg up: on phones the stacked copy +
          orbit already fill the screen, and forcing 100svh there just adds
          dead space under the fold. */}
      <section
        id="features-hero"
        className="features-hero-dark relative flex items-center overflow-hidden border-t border-border lg:min-h-[calc(100svh-4rem)]"
        style={{ background: "var(--features-hero-bg)" }}
      >
        {/* Drifting glow orbs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/4 top-0 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full blur-[110px] [will-change:transform]"
          style={{ background: "color-mix(in srgb, var(--features-blue) 42%, transparent)" }}
          animate={reduced ? undefined : { x: [0, 50, -20, 0], y: [0, 40, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-[22rem] w-[22rem] translate-x-1/3 translate-y-1/3 rounded-full blur-[110px] [will-change:transform]"
          style={{ background: "color-mix(in srgb, var(--features-blue-deep) 40%, transparent)" }}
          animate={reduced ? undefined : { x: [0, -40, 20, 0], y: [0, -30, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        {/* Light grid lines for the dark canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(1 0 0 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-0">
          {/* LEFT — copy */}
          <div className="lg:col-span-6">
            <ScrollReveal>
              <span className="ai-pill-blue">
                <span className="h-1 w-1 rounded-full bg-current" />
                Features
              </span>
              {/* H1 — Archivo 500, −1.46px tracking per the brand reference */}
              <h1 className="mt-5 text-balance font-heading text-[2rem] font-medium leading-[1.07] tracking-[-0.035em] text-foreground sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl">
                Everything you need to ship a{" "}
                <span className="text-aurora-blue">real-world voice agent.</span>
              </h1>
              {/* Intro — Inter 300 at 18px */}
              <p className="mt-5 max-w-xl text-pretty text-[15px] font-light leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
                Real-time audio, carrier-grade telephony, live tool calls, and full observability — production-ready,
                all in one platform. No stitching six vendors together.
              </p>

              <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-8">
                <Button
                  asChild
                  size="lg"
                  className="group border-0 text-white hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--features-blue), var(--features-blue-deep))" }}
                >
                  <Link href="/get-started">
                    Start building
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="#features">Browse all 12 features</Link>
                </Button>
              </div>

              <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--features-blue)" }} />
                  No credit card to try
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" style={{ color: "var(--features-blue)" }} />
                  Live in an afternoon
                </span>
              </p>
            </ScrollReveal>
          </div>

          {/* RIGHT — orbit visual + floating status chips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:col-span-6 lg:max-w-none"
          >
            <FeatureOrbit />
            {HERO_CHIPS.map((c) => (
              <motion.div
                key={c.label}
                aria-hidden
                className={`absolute ${c.pos} hidden items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md sm:flex`}
                animate={reduced ? undefined : { y: [0, -9, 0] }}
                transition={{ duration: c.dur, delay: c.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                {c.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
