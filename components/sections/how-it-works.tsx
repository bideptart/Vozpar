"use client"

import { useEffect, useState } from "react"
import { Wand2, BookOpen, Plug, Rocket, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { motion, useReducedMotion, AnimatePresence } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const STEP_INTERVAL = 3000

const STEPS = [
  {
    n: "01",
    tag: "Customization",
    icon: Wand2,
    tint: "#2d98f1",
    badge: "40+ HD Voices",
    title: "Configure Voice & Persona",
    body: "Pick from 40+ natural human-like voices, customize accents, select emotional tone, and define conversation guardrails in simple text.",
    preview: {
      type: "voice",
      detail: "Selected: AI Sarah (US English · Professional)",
    },
  },
  {
    n: "02",
    tag: "Knowledge Base",
    icon: BookOpen,
    tint: "#6366f1",
    badge: "Instant Data Sync",
    title: "Feed Business Knowledge",
    body: "Upload your FAQs, website URLs, PDF docs, or product catalogs. Your agent learns your business instantly and answers with zero hallucination.",
    preview: {
      type: "knowledge",
      detail: "3 Docs & FAQs Synced (100% Verified)",
    },
  },
  {
    n: "03",
    tag: "Integrations",
    icon: Plug,
    tint: "#0ea5e9",
    badge: "Sub-300ms Actions",
    title: "Connect Phone & Tools",
    body: "Connect your existing carrier or assign a new local/toll-free number. Link Google Calendar, CRM, and SMS tools to take real-time action mid-call.",
    preview: {
      type: "tools",
      detail: "Twilio + Google Calendar + HubSpot Connected",
    },
  },
  {
    n: "04",
    tag: "Deployment",
    icon: Rocket,
    tint: "#10b981",
    badge: "24/7 Live Auto-Scale",
    title: "Go Live & Auto-Scale",
    body: "Turn on live phone call handling. Track real-time call transcripts, sentiment analytics, and lead conversions live on your dashboard.",
    preview: {
      type: "live",
      detail: "Live Agent Ready · 0 Missed Calls",
    },
  },
]

export function HowItWorks() {
  const reduced = useReducedMotion()
  const [activeStep, setActiveStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance through the steps; pauses while a card is hovered.
  useEffect(() => {
    if (reduced || isPaused) return
    const t = setInterval(() => setActiveStep(i => (i + 1) % STEPS.length), STEP_INTERVAL)
    return () => clearInterval(t)
  }, [reduced, isPaused])

  return (
    <section id="how-it-works" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      {/* Background radial atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.12) 0%, rgba(4,107,210,0.02) 60%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] -translate-y-10 translate-x-10 rounded-full blur-[140px]"
        style={{ background: "rgba(99,102,241,0.06)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
        {/* Header */}
        <ScrollReveal className="mx-auto mb-8 max-w-3xl text-center md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2d98f1]">
            <Sparkles className="h-3 w-3 text-[#2d98f1]" />
            Simplified 4-Step Process
          </div>
          <h2 className="font-heading text-[1.75rem] font-medium leading-[1.1] tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
            Launch Your AI Phone Agent
            <br />
            <span className="bg-gradient-to-r from-[#2d98f1] via-[#60b8ff] to-[#6366f1] bg-clip-text text-transparent">
              In 4 Easy Steps
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/45 sm:text-lg md:text-xl">
            From setup to your first live inbound or outbound call in minutes — no coding, no complex setups, no AI expertise required.
          </p>
        </ScrollReveal>

        {/* Interactive Desktop Timeline */}
        <div className="hidden lg:block">
          {/* Progress bar line */}
          <div className="relative mx-12 mb-10 h-1 rounded-full bg-white/[0.08]">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#2d98f1] via-[#6366f1] to-[#10b981]"
              initial={{ width: "25%" }}
              animate={{ width: `${(activeStep + 1) * 25}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Animated step nodes on the bar */}
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[6%]">
              {STEPS.map((s, i) => {
                const isActive = i <= activeStep
                const isCurrent = i === activeStep

                return (
                  <button
                    key={s.n}
                    onClick={() => setActiveStep(i)}
                    onMouseEnter={() => { setActiveStep(i); setIsPaused(true) }}
                    onMouseLeave={() => setIsPaused(false)}
                    className="group relative focus:outline-none"
                    aria-label={`Jump to step ${s.n}: ${s.title}`}
                  >
                    <motion.div
                      className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border text-xs font-mono font-bold transition-all duration-300 ${
                        isCurrent
                          ? "scale-110 border-transparent text-white shadow-lg"
                          : isActive
                          ? "border-[#046bd2]/60 bg-black text-[#2d98f1]"
                          : "border-white/10 bg-[#000000] text-white/30 hover:border-white/30 hover:text-white/60"
                      }`}
                      style={{
                        background: isCurrent ? s.tint : undefined,
                        boxShadow: isCurrent ? `0 0 24px ${s.tint}70` : undefined,
                      }}
                    >
                      {s.n}
                    </motion.div>
                    {/* Ring ping on current */}
                    {isCurrent && !reduced && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-[#2d98f1]"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cards Grid — was an unqualified grid-cols-4, which forced four
              ~70px columns on a phone and crushed/overflowed the card
              content. Steps up 1 → 2 → 4 instead. */}
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isSelected = i === activeStep

              return (
                <StaggerItem key={s.n}>
                  <motion.div
                    onClick={() => setActiveStep(i)}
                    onMouseEnter={() => { setActiveStep(i); setIsPaused(true) }}
                    onMouseLeave={() => setIsPaused(false)}
                    whileHover={reduced ? undefined : { y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#000000] p-5 sm:p-6"
                  >
                    {/* Sliding active highlight — shared layoutId animates smoothly between cards */}
                    {isSelected && (
                      <motion.div
                        layoutId="step-card-highlight"
                        className="pointer-events-none absolute inset-0 rounded-2xl border bg-[#000000]"
                        style={{
                          borderColor: `${s.tint}99`,
                          boxShadow: `0 0 40px -10px ${s.tint}59`,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Top gradient highlight */}
                    <div
                      className="absolute inset-x-0 top-0 h-[2px] transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${s.tint}, transparent)`,
                        opacity: isSelected ? 1 : 0.4,
                      }}
                    />

                    {/* Subtle ambient hover fill */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${s.tint}12 0%, transparent 70%)`,
                      }}
                    />

                    <div className="relative">
                      {/* Step Tag + Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.2em]"
                          style={{ color: s.tint }}
                        >
                          Step {s.n}
                        </span>
                        <span
                          className="rounded-full border px-2 py-0.5 font-mono text-[9px] font-medium"
                          style={{
                            borderColor: `${s.tint}35`,
                            color: s.tint,
                            background: `${s.tint}12`,
                          }}
                        >
                          {s.badge}
                        </span>
                      </div>

                      {/* Icon */}
                      <div
                        className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105"
                        style={{
                          borderColor: `${s.tint}30`,
                          background: `${s.tint}15`,
                          color: s.tint,
                          boxShadow: isSelected ? `0 0 20px ${s.tint}30` : undefined,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-heading text-lg font-semibold tracking-tight text-white">
                        {s.title}
                      </h3>

                      {/* Body */}
                      <p className="mt-2 text-xs leading-relaxed text-white/45 group-hover:text-white/60">
                        {s.body}
                      </p>
                    </div>

                    {/* Preview Box */}
                    <div
                      className="mt-6 rounded-xl border border-white/[0.06] bg-black/40 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: s.tint }}
                        />
                        <p className="truncate font-mono text-[10px] text-white/50">
                          {s.preview.detail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>

        {/* Mobile & Tablet view */}
        <div className="flex flex-col gap-5 lg:hidden">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <ScrollReveal key={s.n} delay={i * 0.08}>
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#000000] p-5 transition-all hover:border-[#046bd2]/40 sm:p-6">
                  <div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${s.tint}, transparent)`,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-bold sm:h-10 sm:w-10"
                        style={{
                          borderColor: `${s.tint}35`,
                          background: `${s.tint}12`,
                          color: s.tint,
                        }}
                      >
                        {s.n}
                      </div>
                      <div>
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.18em]"
                          style={{ color: s.tint }}
                        >
                          {s.tag}
                        </span>
                        <h3 className="font-heading text-base font-semibold text-white">
                          {s.title}
                        </h3>
                      </div>
                    </div>
                    <span
                      className="rounded-full border px-2 py-0.5 font-mono text-[9px]"
                      style={{
                        borderColor: `${s.tint}30`,
                        color: s.tint,
                        background: `${s.tint}10`,
                      }}
                    >
                      {s.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-white/45">
                    {s.body}
                  </p>

                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/40 p-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: s.tint }}
                      />
                      <p className="truncate font-mono text-[10px] text-white/50">
                        {s.preview.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Bottom Callout Banner */}
        <ScrollReveal className="mt-14 md:mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#046bd2]/30 bg-gradient-to-r from-[#046bd2]/10 via-[#046bd2]/[0.04] to-transparent p-6 sm:p-8 md:p-10">
            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#2d98f1]">
                  <Zap className="h-4 w-4" />
                  Ready to deploy in under 15 minutes?
                </div>
                <h3 className="mt-2 font-heading text-xl font-medium tracking-tight text-white sm:text-2xl md:text-3xl">
                  Try Vozpar for free today — no credit card needed.
                </h3>
              </div>
              <a
                href="/get-started"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#046bd2] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(4,107,210,0.45)] transition-all hover:bg-[#0579e8] hover:shadow-[0_0_40px_rgba(4,107,210,0.65)]"
              >
                Build Your Agent Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
