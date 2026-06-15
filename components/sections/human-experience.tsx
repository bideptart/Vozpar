"use client"

import { Waves, Hand, Infinity as InfinityIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const items = [
  {
    icon: Waves,
    title: "Zero-lag conversations",
    description:
      "Native audio-to-audio modeling delivers natural warmth and real-time fluidity. No robotic dead air, no awkward pauses while a transcription pipeline catches up.",
  },
  {
    icon: Hand,
    title: "Smart interruptions",
    description:
      "Customers can talk over the agent at any moment. It stops, listens, and responds the way a real human would — not the way a chatbot pretends to.",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited capacity",
    description:
      "Scale from one call to thousands simultaneously. No busy signals, no queue time, no per-seat math.",
  },
]

export function HumanExperience() {
  const reduced = useReducedMotion()
  return (
    <section id="experience" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[110px] [will-change:transform]"
        animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-cyan">
            <span className="h-1 w-1 rounded-full bg-primary" />
            The human-kind experience
          </span>
          <h2 className="mt-6 text-balance text-4xl font-serif font-normal leading-[1.1] tracking-tight md:text-5xl">
            Conversations indistinguishable from{" "}
            <span className="text-primary">your best agent.</span>
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            9278.ai skips the brittle speech-to-text and text-to-speech relay and runs on a single audio-native engine — so
            your callers hear pauses, emotion, and timing that feel right.
          </p>
        </ScrollReveal>

        <StaggerGroup className="mt-16 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="group relative h-full"
                >
                  <div className="card-glow ring-gradient relative h-full rounded-2xl p-7">
                    <div className="flex items-center justify-between">
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-xl bg-primary/0 blur-xl transition-all duration-500 group-hover:bg-primary/40"
                        />
                        <Icon
                          className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-xs font-mono text-muted-foreground/60">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
