"use client"

import type { ReactNode } from "react"
import { Wand2, BookOpen, Rocket, ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

/** 3D "pin" card shell, in the spirit of the Aceternity/21st.dev 3D Pin
 * component: a perspective tilt on hover, a conic-gradient ring that sweeps
 * continuously around the border, and a beam dropping from the card's
 * underside to a glowing dot "landing" on the surface below — like a map
 * pin dropped onto the card. Everything is driven by `accent` so each step
 * keeps its own colour identity instead of one shared blue treatment. */
function PinCard({
  accent,
  reduced,
  children,
}: {
  accent: string
  reduced: boolean
  children: ReactNode
}) {
  return (
    <div className="relative flex h-full flex-col pb-16" style={{ perspective: "1200px" }}>
      <motion.div
        whileHover={reduced ? undefined : { rotateX: 9, rotateY: -7, y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative flex-1 [transform-style:preserve-3d]"
      >
        {/* Ambient glow behind the card, blooms brighter on hover */}
        <div
          aria-hidden
          className="absolute -inset-6 -z-10 rounded-[28px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: accent }}
        />

        {/* Sweeping conic-gradient ring — a bright arc plus a fainter,
            wider "comet tail" trailing behind it — rotating continuously
            behind a 1px-inset dark fill, so only the arcs show through. */}
        <div className="absolute -inset-px overflow-hidden rounded-2xl">
          {!reduced && (
            <motion.div
              className="absolute inset-[-60%] transition-[filter] duration-500 group-hover:brightness-125"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, ${accent} 35%, transparent) 40deg, ${accent} 62deg, transparent 95deg, transparent 360deg)`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}
          <div className="absolute inset-px rounded-[15px] bg-[#07090d]/40" />
        </div>

        {/* Diagonal shine sweep on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-px overflow-hidden rounded-[15px]"
        >
          <span
            className="absolute -inset-y-4 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100"
          />
        </div>

        <div
          className="relative h-full m-px rounded-[15px]"
          style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.035), rgba(7,9,13,0.98) 40%)" }}
        >
          {children}
        </div>
      </motion.div>

      {/* The pin: beam + glowing tip (with a soft radar ping) + a landed
          glow on the ground. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
        <motion.div
          className="w-px origin-top"
          style={{ height: 44, background: `linear-gradient(to bottom, ${accent}, transparent)` }}
          initial={reduced ? undefined : { scaleY: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
        <span className="relative -mt-0.5 flex h-2 w-2 items-center justify-center">
          {!reduced && (
            <motion.span
              className="absolute h-full w-full rounded-full"
              style={{ background: accent }}
              animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
            />
          )}
          <motion.span
            className="relative h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px 2px ${accent}` }}
            animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </span>
        <div
          className="mt-1 h-2 w-16 rounded-full blur-md"
          style={{ background: accent, opacity: 0.35 }}
        />
      </div>
    </div>
  )
}

const steps = [
  {
    icon: Wand2,
    label: "Step 01",
    title: "Design your agent",
    description:
      "Pick a voice, write the prompt, set guardrails. Describe the agent in plain English and ship it.",
    bullets: ["System prompt + personas", "Guardrails and conversation flow", "Plain-English agent definition"],
    pillClass: "ai-pill-cyan",
    accent: "var(--ai-cyan)",
  },
  {
    icon: BookOpen,
    label: "Step 02",
    title: "Connect your knowledge",
    description:
      "Point the agent at your knowledge base, FAQs, or product docs. It answers from your source of truth, not a generic model.",
    bullets: ["RAG over your knowledge base", "Live document sync", "Source citations on every answer"],
    pillClass: "ai-pill-violet",
    accent: "var(--ai-violet)",
  },
  {
    icon: Rocket,
    label: "Step 03",
    title: "Launch & scale",
    description:
      "Plug in your phone number, route inbound or outbound, and go live. Scale from one call to thousands without a queue.",
    bullets: ["Phone number routing (inbound + outbound)", "Real-time latency tracking", "Self-hosted control panel"],
    pillClass: "ai-pill-magenta",
    accent: "var(--ai-magenta)",
  },
]

export function HowItWorks() {
  const reduced = useReducedMotion()
  return (
    <section id="how-it-works" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px] [will-change:transform]"
        style={{ background: "var(--ai-violet)", opacity: 0.04 }}
        animate={reduced ? undefined : { x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px] [will-change:transform]"
        style={{ background: "var(--ai-magenta)", opacity: 0.035 }}
        animate={reduced ? undefined : { x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-cyan">
            <span className="h-1 w-1 rounded-full bg-primary" />
            How it works
          </span>
          <h2 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
            From idea to live agent in{" "}
            <span className="text-primary">three steps.</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            No infra to spin up, no models to host. Design, connect, and launch — your first agent is taking calls before lunch.
          </p>
        </ScrollReveal>

        {/* Connector line behind cards */}
        <div className="relative mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--ai-cyan) 20%, var(--ai-violet) 50%, var(--ai-magenta) 80%, transparent 100%)",
              opacity: 0.35,
            }}
          />

          <StaggerGroup className="grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <StaggerItem key={step.title}>
                  <div className="group relative h-full">
                    <PinCard accent={step.accent} reduced={Boolean(reduced)}>
                      <div
                        className="relative flex h-full flex-col overflow-hidden rounded-[15px] p-7 transition-shadow duration-500"
                        style={{
                          boxShadow: `0 24px 60px -30px color-mix(in oklch, ${step.accent} 55%, transparent)`,
                        }}
                      >
                        {/* Accent wash across the top of the card */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-70"
                          style={{
                            background: `radial-gradient(60% 100% at 20% 0%, color-mix(in oklch, ${step.accent} 22%, transparent), transparent 70%)`,
                          }}
                        />

                        <div className="relative flex items-center justify-between">
                          <span className="relative flex h-12 w-12 items-center justify-center rounded-xl">
                            <span
                              aria-hidden
                              className="absolute inset-0 rounded-xl opacity-25 transition-opacity duration-500 group-hover:opacity-50"
                              style={{ background: step.accent, filter: "blur(14px)" }}
                            />
                            <span
                              className="relative flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                              style={{
                                background: `color-mix(in oklch, ${step.accent} 16%, transparent)`,
                                borderColor: `color-mix(in oklch, ${step.accent} 40%, transparent)`,
                                color: step.accent,
                              }}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          </span>
                          <span className={step.pillClass}>{step.label}</span>
                        </div>

                        <div
                          aria-hidden
                          className="relative mt-5 h-px w-10 rounded-full"
                          style={{ background: step.accent }}
                        />

                        <h3 className="relative mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
                        <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>

                        <ul className="relative mt-6 space-y-2.5">
                          {step.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-2.5 text-sm text-foreground/80">
                              <span
                                aria-hidden
                                className="h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ background: step.accent, boxShadow: `0 0 8px color-mix(in oklch, ${step.accent} 70%, transparent)` }}
                              />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PinCard>

                    {i < steps.length - 1 && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-4 top-[calc(50%-2rem)] z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-card/80 backdrop-blur-md md:flex"
                      >
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </span>
                    )}
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
