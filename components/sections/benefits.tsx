"use client"

import type React from "react"
import { Waves, Hand, Zap, Database, ShieldCheck, Globe } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { BenefitViz, BenefitMotif, type VizKind } from "@/components/sections/benefit-visuals"

/**
 * Home · "Why Vozpar" — six feature cards.
 *
 * Layout: a single uniform 3-column grid (was a 12-col bento + a second grid),
 * so all six cards are exactly equal width with equal gaps and the two rows
 * align perfectly. Vertical rhythm is tuned so the heading and both rows clear
 * a 1920×1080 viewport without scrolling.
 *
 * Motion: the card box never moves — no idle float, no hover lift. Hover is
 * limited to border glow, icon glow, shadow and a 1.2% scale, all via CSS
 * transitions. The looping micro-animation lives strictly inside each card's
 * visualisation (see benefit-visuals.tsx) and is compositor-only.
 */

type Benefit = {
  icon: React.ElementType
  eyebrow: string
  title: string
  body: string
  tint: string
  viz: VizKind
}

// Each card gets its own icon, accent, visualisation and background motif —
// no two cards share a visual identity.
const BENEFITS: Benefit[] = [
  {
    icon: Waves,
    eyebrow: "Native audio",
    title: "Zero-lag conversations",
    body: "A single audio-native model processes voice end-to-end — no speech-to-text pipeline, no TTS relay. Callers hear natural tone, pacing, and warmth.",
    tint: "#2d98f1",
    viz: "waveform",
  },
  {
    icon: Hand,
    eyebrow: "Barge-in",
    title: "Handles interruptions naturally",
    body: "Customers cut in mid-sentence every call. Vozpar pauses, processes the new direction, and responds without losing context.",
    tint: "#60b8ff",
    viz: "signal",
  },
  {
    icon: Zap,
    eyebrow: "Latency",
    title: "Sub-300ms responses",
    body: "End-to-end audio processing under 300ms. No dead air, no awkward pauses — callers feel heard the moment they finish speaking.",
    tint: "#046bd2",
    viz: "meter",
  },
  {
    icon: Database,
    eyebrow: "Grounding",
    title: "Connects to your knowledge base",
    body: "Point the agent at your FAQs, product docs, or CRM. It answers from your source of truth — not generic AI guesswork.",
    tint: "#6366f1",
    viz: "nodes",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Data residency",
    title: "Self-hosted by default",
    body: "Deploy on your own infrastructure. Call data, transcripts, and business knowledge stay inside your environment.",
    tint: "#10b981",
    viz: "shield",
  },
  {
    icon: Globe,
    eyebrow: "Coverage",
    title: "Multilingual, auto-detected",
    body: "Detects the caller's language instantly and switches mid-conversation — no separate models, no manual configuration.",
    tint: "#8b5cf6",
    viz: "iot",
  },
]

function BenefitCard({ icon: Icon, eyebrow, title, body, tint, viz }: Benefit) {
  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden rounded-[18px]
        border border-white/[0.08] p-4 sm:p-5 xl:p-6
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]
        transition-[scale,border-color,box-shadow] duration-300 ease-out
        hover:scale-[1.012]
        hover:border-[var(--tint-border)]
        hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_0_1px_var(--tint-ring),0_18px_50px_-18px_var(--tint-glow)]
      "
      style={
        {
          // Pure-black card surface (was a navy-tinted rgba(8,10,18,...) mix)
          // — this now matches the rest of the Home page's unified black
          // card system rather than introducing its own tint.
          background:
            "linear-gradient(158deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.82) 55%, #000000 100%)",
          // Pre-mixed alpha variants of the card's accent. Declaring them as
          // custom properties lets the hover state live entirely in CSS —
          // no JS style mutation, and each card glows its own colour.
          "--tint": tint,
          "--tint-idle": `${tint}30`,
          "--tint-border": `${tint}55`,
          "--tint-ring": `${tint}22`,
          "--tint-glow": `${tint}66`,
        } as React.CSSProperties
      }
    >
      <BenefitMotif kind={viz} tint={tint} />

      {/* Thin glowing top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${tint}, transparent)` }}
      />

      {/* Accent wash, revealed on hover only */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse 85% 55% at 50% -12%, ${tint}20 0%, transparent 70%)` }}
      />

      <div className="relative flex h-full flex-col">
        {/* Icon + eyebrow */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span
            className="
              flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]
              border border-[var(--tint-idle)]
              transition-[box-shadow,border-color] duration-300
              group-hover:border-[var(--tint-border)]
              group-hover:shadow-[0_0_18px_-4px_var(--tint)]
            "
            style={{ background: `${tint}14`, color: tint }}
          >
            <Icon className="h-[18px] w-[18px] transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_5px_var(--tint))]" />
          </span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 sm:text-[10px]"
            style={{ color: `${tint}b0` }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Visualisation */}
        <div className="mt-3.5 sm:mt-4">
          <BenefitViz kind={viz} tint={tint} />
        </div>

        {/* Copy */}
        <h3 className="mt-3.5 font-heading text-[0.94rem] font-medium leading-snug tracking-tight text-white sm:mt-4 sm:text-[0.98rem] xl:text-[1.05rem]">
          {title}
        </h3>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/40 transition-colors duration-300 group-hover:text-white/55 sm:text-[13px]">
          {body}
        </p>
      </div>
    </article>
  )
}

export function Benefits() {
  const reduced = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      {/* Top radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(58% 68% at 50% 0%, rgba(4,107,210,0.13) 0%, rgba(4,107,210,0.04) 42%, transparent 76%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14 xl:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center sm:mb-7 lg:mb-9">
          <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#2d98f1] sm:mb-3 sm:text-xs">Why Vozpar</p>
          <h2 className="font-heading text-xl font-medium leading-tight tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
            Built for real calls, <span className="text-white/60">not demo videos.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/40 sm:text-base">
            Every design choice optimises for the moment a real caller hears a real response.
          </p>
        </ScrollReveal>

        {/* Uniform 3 × 2 grid — equal widths, equal gaps, aligned rows.
            Entrance is opacity-only so no card ever renders in a position it
            then moves out of. */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5"
        >
          {BENEFITS.map((b) => (
            <motion.div
              key={b.title}
              variants={{
                hidden: { opacity: reduced ? 1 : 0 },
                visible: { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <BenefitCard {...b} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
