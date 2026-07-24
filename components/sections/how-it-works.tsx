"use client"

import { Wand2, BookOpen, Plug, Rocket } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const STEPS = [
  {
    n: "01", icon: Wand2, tint: "#2d98f1",
    title: "Define your agent",
    body: "Choose a voice persona, write your system prompt in plain English, and set conversation guardrails. No code, no ML expertise needed.",
  },
  {
    n: "02", icon: BookOpen, tint: "#046bd2",
    title: "Connect your knowledge",
    body: "Upload FAQs, product docs, or pricing sheets. The agent answers directly from your source of truth — not hallucinated guesses.",
  },
  {
    n: "03", icon: Plug, tint: "#2d98f1",
    title: "Add tools and numbers",
    body: "Connect your calendar, CRM, and existing carrier number. The agent checks availability, books, and updates records in real time — mid-call.",
  },
  {
    n: "04", icon: Rocket, tint: "#046bd2",
    title: "Launch and improve",
    body: "Go live in minutes. Monitor every call, review outcomes, and refine the agent from a single control panel — no redeployment needed.",
  },
]

export function HowItWorks() {
  const reduced = useReducedMotion()

  return (
    <section id="how-it-works" className="relative overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{ background: "radial-gradient(40% 50% at 20% 0%, rgba(4,107,210,0.07), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">

        {/* Header */}
        <ScrollReveal className="mx-auto mb-20 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#2d98f1]">How it works</p>
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Getting Started is Simpler
            <br className="hidden sm:block" />{" "}
            <span className="text-white/55">Than You Think</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/40">
            From setup to your first live call in under a day. No infrastructure to provision.
          </p>
        </ScrollReveal>

        {/* Desktop: timeline */}
        <div className="hidden lg:block">
          {/* Progress line */}
          <div className="relative mx-8 mb-10 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#046bd2]/40 to-transparent" />
            {/* Nodes */}
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[10%]">
              {STEPS.map((s, i) => (
                <motion.div key={s.n}
                  initial={reduced ? undefined : { scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#046bd2]/40 bg-black"
                  style={{ boxShadow: `0 0 20px ${s.tint}20` }}
                >
                  {!reduced && (
                    <motion.div className="absolute h-full w-full rounded-full border border-[#046bd2]/20"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    />
                  )}
                  <span className="font-mono text-xs font-bold" style={{ color: s.tint }}>{s.n}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <StaggerGroup className="grid grid-cols-4 gap-4">
            {STEPS.map(s => {
              const Icon = s.icon
              return (
                <StaggerItem key={s.n}>
                  <motion.div
                    whileHover={reduced ? undefined : { y: -4 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08090e] p-6 hover:border-[#046bd2]/30 transition-colors duration-300"
                  >
                    <div className="absolute inset-x-0 top-0 h-px"
                      style={{ background: `linear-gradient(to right, transparent, ${s.tint}55, transparent)` }} />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(55% 50% at 50% 0%, ${s.tint}07, transparent)` }} />

                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                      style={{ borderColor: `${s.tint}22`, background: `${s.tint}10`, color: s.tint }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base font-medium tracking-tight text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/40">{s.body}</p>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>

        {/* Mobile: stacked */}
        <div className="flex flex-col gap-4 lg:hidden">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <ScrollReveal key={s.n} delay={i * 0.07}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#046bd2]/40 bg-black font-mono text-xs font-bold"
                      style={{ color: s.tint }}>
                      {s.n}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-gradient-to-b from-[#046bd2]/30 to-transparent" />
                    )}
                  </div>
                  <div className="mb-3 flex-1 rounded-2xl border border-white/[0.07] bg-[#08090e] p-5">
                    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border"
                      style={{ borderColor: `${s.tint}22`, background: `${s.tint}10`, color: s.tint }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-heading text-base font-medium text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/40">{s.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
