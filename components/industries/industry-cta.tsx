"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Magnetic, SpotlightPanel } from "@/components/animation/magnetic"

const PROOF_POINTS = [
  { label: "48-hour working prototype", tint: "#3b82f6" },
  { label: "No commitment to start", tint: "#10b981" },
  { label: "Built by voice engineers", tint: "#ff7a00" },
]

export function IndustryCTA() {
  const reduced = useReducedMotion()

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden bg-black px-4 pb-16 pt-4 sm:pb-20 sm:pt-6 md:px-6 md:pb-24 md:pt-8">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl p-px">
          {!reduced && (
            <span
              aria-hidden
              className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #3b82f6 40deg, transparent 100deg, transparent 200deg, #1d4ed8 250deg, transparent 310deg)",
                opacity: 0.85,
              }}
            />
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl border"
            style={{ borderColor: "color-mix(in srgb, #3b82f6 35%, transparent)" }}
          />

          <SpotlightPanel
            glow="#3b82f6"
            size={520}
            className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0b0b0e] px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12"
          >
            {!reduced && (
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <span
                  className="sheen-sweep absolute inset-y-0 w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, color-mix(in srgb, #3b82f6 12%, transparent), transparent)",
                  }}
                />
              </span>
            )}

            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="max-w-xl">
                <span className="ai-pill-blue">
                  <span className="h-1 w-1 rounded-full bg-current" />
                  Custom builds
                </span>

                <h2 className="mt-4 text-balance font-heading text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
                  Don&apos;t see your industry listed?
                </h2>

                <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">
                  We&apos;ve built agents for security, recruiting, property management, insurance, finance, and
                  dozens of workflows beyond these ten. Describe the calls that consume your day, and we&apos;ll
                  deliver a working prototype within 48 hours.
                </p>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                  {PROOF_POINTS.map((b, i) => (
                    <motion.span
                      key={b.label}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                      className="inline-flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.tint }} />
                      {b.label}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Magnetic strength={0.28} className="w-full sm:w-auto">
                  <Link
                    href="/get-started"
                    className="btn-ai inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[filter,box-shadow] duration-300 sm:w-auto"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Magnetic>

                <Magnetic strength={0.22} className="w-full sm:w-auto">
                  <Link
                    href="/pricing"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-black/80 px-6 text-sm font-medium text-foreground border border-white/10 transition-colors duration-300 hover:border-white/30 hover:bg-black sm:w-auto"
                  >
                    View pricing
                  </Link>
                </Magnetic>
              </div>
            </div>
          </SpotlightPanel>
        </div>
      </ScrollReveal>
    </section>
  )
}
