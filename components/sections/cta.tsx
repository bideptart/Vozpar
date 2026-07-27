"use client"

import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Magnetic, SpotlightPanel } from "@/components/animation/magnetic"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

const PROOF_POINTS = [
  { label: "No credit card required", tint: "var(--features-blue)" },
  { label: "Connect in under 5 minutes", tint: "var(--features-green)" },
  { label: "Cancel anytime", tint: "var(--features-blue-deep)" },
]

export function CTA() {
  const reduced = useReducedMotion()

  return (
    <section
      id="cta"
      className="features-hero-dark relative overflow-hidden border-t border-border py-12 md:py-16"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl p-px">
            {!reduced && (
              <span
                aria-hidden
                className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, var(--features-blue) 40deg, transparent 100deg, transparent 200deg, var(--features-blue-deep) 250deg, transparent 310deg)",
                  opacity: 0.85,
                }}
              />
            )}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl border"
              style={{ borderColor: "color-mix(in srgb, var(--features-blue) 35%, transparent)" }}
            />

            <SpotlightPanel
              glow="var(--features-blue)"
              size={520}
              className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#000000] px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12"
            >
              {!reduced && (
                <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span
                    className="sheen-sweep absolute inset-y-0 w-1/3"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in srgb, var(--features-blue) 12%, transparent), transparent)",
                    }}
                  />
                </span>
              )}

              <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="max-w-xl">
                  <span className="ai-pill-blue">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    Live demo · no signup
                  </span>

                  <h2 className="mt-4 text-balance font-heading text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
                    Ready to see what a true AI voice partner feels like?
                  </h2>

                  <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">
                    Talk to a live Vozpar agent right now, explore pricing, or book a no-pressure
                    20-minute walkthrough with our team.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {PROOF_POINTS.map((point, i) => (
                      <motion.span
                        key={point.label}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: point.tint }}
                        />
                        {point.label}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <Magnetic strength={0.28} className="w-full sm:w-auto">
                    <Link
                      href="/get-started"
                      className="btn-ai group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[filter,box-shadow] duration-300 sm:w-auto"
                    >
                      Get Started Free
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </Magnetic>

                  <Magnetic strength={0.22} className="w-full sm:w-auto">
                    <Link
                      href="/contact"
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-black/80 px-6 text-sm font-medium text-foreground transition-colors duration-300 hover:border-white/30 hover:bg-black sm:w-auto"
                    >
                      <Calendar className="h-4 w-4" aria-hidden />
                      Book a demo
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </SpotlightPanel>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
