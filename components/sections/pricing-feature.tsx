"use client"

import Link from "next/link"
import { Timer, BadgeCheck, Receipt, ArrowRight } from "lucide-react"
import { motion } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const items = [
  {
    icon: Timer,
    title: "From $0.10 per minute",
    description:
      "Three tiers: $0.15/min on Starter, $0.12/min on Growth, $0.10/min on Scale. The more you talk, the less you pay.",
  },
  {
    icon: BadgeCheck,
    title: "$20, $50 or $100 credit",
    description:
      "Pick your tier and unlock 1, 2, or 3 concurrent AI agents. Voice credit stays valid for 60 days from purchase.",
  },
  {
    icon: Receipt,
    title: "No hidden fees",
    description:
      "No setup, no contracts, no minimums beyond your top-up. Phone numbers stay billed directly by your existing carrier.",
  },
]

export function PricingFeature() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-border/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.577_0.245_27.33/0.05),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="ai-pill-violet">
            <span className="h-1 w-1 rounded-full bg-accent" />
            Pricing
          </span>
          <h2 className="mt-6 text-balance font-heading text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
            Fair pricing.{" "}
            <span className="text-primary">Pay only for what you talk.</span>
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
            Voice from $0.10 per minute. Top up with $20, $50, or $100 of credit, unlock up to 3 concurrent AI agents,
            and scale from a single line to a full call center — no contracts, no surprises.
          </p>
        </ScrollReveal>

        <StaggerGroup className="mt-16 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon
            const isFeatured = i === 1
            return (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="group relative h-full"
                >
                  <div
                    className={`relative h-full rounded-2xl p-7 transition-all ${
                      isFeatured
                        ? "ring-gradient card-glow glow-primary"
                        : "card-glow"
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-[0_4px_20px_-4px_oklch(0.577_0.245_27.33/0.7)]">
                        Most popular
                      </span>
                    )}
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isFeatured
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary ring-1 ring-primary/20"
                      }`}
                    >
                      <Icon
                        className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                        aria-hidden="true"
                      />
                    </span>
                    <h3 className="mt-6 text-lg font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>

        <ScrollReveal className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="group btn-ai h-12 rounded-full px-7 transition-all">
            <Link href="/pricing">
              View full pricing
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-border/70 bg-card/30 px-7 backdrop-blur-md hover:border-primary/50">
            <Link href="/get-started">Get started</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  )
}
