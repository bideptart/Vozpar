"use client"

import { Headset, TrendingUp, Languages } from "lucide-react"
import { motion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const items = [
  {
    icon: Headset,
    title: "24/7 virtual front desk",
    description:
      "An always-on receptionist that greets every caller, answers FAQs from your knowledge base, and escalates only when needed.",
    tag: "Inbound",
  },
  {
    icon: TrendingUp,
    title: "Proactive growth",
    description:
      "Automate outbound lead generation, lead revival, and instant speed-to-lead callbacks — from one dashboard.",
    tag: "Outbound",
  },
  {
    icon: Languages,
    title: "Multilingual fluency",
    description:
      "Auto-detects the caller's language and switches mid-conversation for a true local feel — no extra setup required.",
    tag: "Global",
  },
]

export function UseCases() {
  return (
    <section className="relative overflow-hidden border-t border-border/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-cyan">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Inbound & outbound
          </span>
          <h2 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
            Inbound, outbound, and multilingual{" "}
            <span className="text-primary">— covered.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
            From the first hello to the follow-up that closes the deal — 9278.ai handles the entire call lifecycle.
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
                  <div className="card-glow ring-gradient relative h-full rounded-2xl p-8">
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Icon
                          className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-7 text-xs font-mono text-muted-foreground/60">/ 0{i + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h3>
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
