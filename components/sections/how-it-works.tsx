"use client"

import { Wand2, BookOpen, Rocket, ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

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

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-cyan">
            <span className="h-1 w-1 rounded-full bg-primary" />
            How it works
          </span>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            From idea to live agent in{" "}
            <span className="text-aurora">three steps.</span>
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
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="group relative h-full"
                  >
                    <div className="card-glow ring-gradient relative h-full rounded-2xl p-7">
                      <span className="scan-line" aria-hidden />
                      <div className="relative flex items-center justify-between">
                        <span className="relative flex h-12 w-12 items-center justify-center rounded-xl">
                          <span
                            aria-hidden
                            className="absolute inset-0 rounded-xl opacity-15 transition-opacity duration-500 group-hover:opacity-40"
                            style={{ background: step.accent, filter: "blur(14px)" }}
                          />
                          <span
                            className="relative flex h-12 w-12 items-center justify-center rounded-xl ring-1"
                            style={{
                              background: `color-mix(in oklch, ${step.accent} 12%, transparent)`,
                              borderColor: `color-mix(in oklch, ${step.accent} 30%, transparent)`,
                              color: step.accent,
                            }}
                          >
                            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                          </span>
                        </span>
                        <span className={step.pillClass}>{step.label}</span>
                      </div>

                      <h3 className="relative mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
                      <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>

                      <ul className="relative mt-6 space-y-2">
                        {step.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-sm text-foreground/80">
                            <span
                              aria-hidden
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: step.accent }}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>

                      {i < steps.length - 1 && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-card/80 backdrop-blur-md md:flex"
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
