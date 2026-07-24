"use client"

import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$20",
    rate: "$0.15 / min",
    tagline: "Ideal for piloting your first agent.",
    features: [
      "1 concurrent AI agent",
      "$0.15 per minute",
      "$20 voice credit included",
      "60-day credit validity",
      "Inbound & outbound",
      "Basic analytics",
    ],
    tint: "#2d98f1",
    featured: false,
    cta: "Get started",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$50",
    rate: "$0.12 / min",
    tagline: "For teams running multiple agents.",
    features: [
      "2 concurrent agents",
      "$0.12 per minute",
      "$50 voice credit included",
      "60-day credit validity",
      "Inbound & outbound",
      "Full analytics dashboard",
      "Priority support",
    ],
    tint: "#046bd2",
    featured: true,
    cta: "Start growing",
  },
  {
    id: "scale",
    name: "Scale",
    price: "$100",
    rate: "$0.10 / min",
    tagline: "High-volume operations at the best rate.",
    features: [
      "3 concurrent agents",
      "$0.10 per minute",
      "$100 voice credit included",
      "60-day credit validity",
      "Inbound & outbound",
      "Full analytics dashboard",
      "Priority support",
      "Custom integrations",
    ],
    tint: "#2d98f1",
    featured: false,
    cta: "Scale up",
  },
]

export function PricingFeature() {
  const reduced = useReducedMotion()

  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.07), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">

        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#2d98f1]">Pricing</p>
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Simple, transparent pricing.
            <br />
            <span className="text-white/55">Pay only for what you use.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/40">
            Top up with voice credit. No contracts, no per-seat fees, no surprises.
          </p>
        </ScrollReveal>

        <StaggerGroup className="grid gap-4 md:grid-cols-3">
          {TIERS.map(tier => (
            <StaggerItem key={tier.id}>
              <motion.div
                whileHover={reduced ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative h-full overflow-hidden rounded-2xl border bg-[#08090e]"
                style={{
                  borderColor: tier.featured ? `${tier.tint}40` : "rgba(255,255,255,0.07)",
                  boxShadow: tier.featured ? `0 0 48px ${tier.tint}14` : "none",
                }}
              >
                {/* Top accent */}
                <div className="h-[2px] w-full"
                  style={{
                    background: tier.featured
                      ? `linear-gradient(to right, ${tier.tint}30, ${tier.tint}, ${tier.tint}30)`
                      : `linear-gradient(to right, transparent, ${tier.tint}40, transparent)`,
                  }} />

                {/* Popular badge */}
                {tier.featured && (
                  <div className="absolute inset-x-0 top-0 flex justify-center -translate-y-0">
                    <span className="rounded-b-xl px-4 py-0.5 text-[10px] font-semibold text-white"
                      style={{ background: tier.tint }}>
                      Most popular
                    </span>
                  </div>
                )}

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(55% 45% at 50% 0%, ${tier.tint}09, transparent)` }} />

                <div className="relative p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">{tier.name}</p>

                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="font-heading text-5xl font-medium leading-none tracking-tight"
                      style={{ color: tier.tint }}>
                      {tier.price}
                    </span>
                    <span className="mb-1 text-sm text-white/35">top-up</span>
                  </div>
                  <p className="mt-1 text-sm text-white/35">{tier.rate}</p>
                  <p className="mt-3 text-sm text-white/45">{tier.tagline}</p>

                  <div className="my-6 h-px" style={{ background: `${tier.tint}14` }} />

                  <ul className="space-y-3">
                    {tier.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-white/55">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${tier.tint}16` }}>
                          <Check className="h-2.5 w-2.5" style={{ color: tier.tint }} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/get-started"
                    className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
                    style={
                      tier.featured
                        ? { background: tier.tint, color: "#fff", boxShadow: `0 0 18px ${tier.tint}35` }
                        : { background: `${tier.tint}12`, color: tier.tint, border: `1px solid ${tier.tint}25` }
                    }
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <ScrollReveal className="mt-8 text-center">
          <p className="text-sm text-white/30">
            Phone numbers are billed directly by your existing carrier — not by Vozpar.{" "}
            <Link href="/pricing" className="text-[#2d98f1] underline-offset-2 hover:underline">
              Full pricing details →
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
