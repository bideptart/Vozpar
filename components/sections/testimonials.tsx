"use client"

// PLACEHOLDER: Replace all author/company details with real approved testimonials before launch.

import type React from "react"
import Link from "next/link"
import { Star, ArrowRight, PhoneCall } from "lucide-react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const METRICS = [
  { value: "2.4M+", label: "Calls / month", tint: "#2d98f1" },
  { value: "62%",   label: "Ops time saved", tint: "#10b981" },
  { value: "3.1×",  label: "Lead lift",      tint: "#2d98f1" },
]

const TESTIMONIALS = [
  {
    quote: "We replaced our after-hours answering service in under two weeks. Every call is handled and logged before anyone sees it in the morning.",
    author: "VP of Operations",
    company: "Home Services",
    initial: "V",
    tint: "#2d98f1",
    rating: 5.0,
  },
  {
    quote: "The agent handles objections and books demos without sounding scripted. It's become our highest-volume prospecting channel.",
    author: "Head of Sales",
    company: "B2B SaaS",
    initial: "H",
    tint: "#6366f1",
    rating: 4.9,
  },
  {
    quote: "We were quoted six months by an enterprise vendor. We had a working agent in production by day four.",
    author: "CTO",
    company: "Enterprise Software",
    initial: "C",
    tint: "#0ea5e9",
    rating: 5.0,
  },
  {
    quote: "Tier-1 support volume dropped overnight. Routine queries are fully resolved before the team logs in.",
    author: "Director of Support",
    company: "E-commerce",
    initial: "D",
    tint: "#10b981",
    rating: 4.8,
  },
] as const

function StarRating({ rating, tint }: { rating: number; tint: string }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3"
            style={i < full ? { fill: "#fbbf24", color: "#fbbf24" } : { fill: "transparent", color: "rgba(255,255,255,0.18)" }}
            aria-hidden
          />
        ))}
      </div>
      <span className="font-mono text-[10px] font-semibold" style={{ color: tint }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

/**
 * Redesign note (round 3): the spotlight-carousel version read fine but was
 * tall — full-width panel, big padding, a switcher row, then a *separate*
 * closing CTA block stacked below it. On a real desktop viewport that adds
 * up to more vertical space than a testimonials block should cost.
 *
 * This borrows the layout idea from the two-column "stats + CTA on one
 * side, social proof on the other" reference: everything sits in a single
 * row so the section's total height is just whatever the taller column
 * needs — no second CTA block tacked on afterward, no giant scroll-driven
 * stacking effect (that pattern is built to consume viewport height on
 * purpose, which is the opposite of what's needed here).
 */
export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
        style={{ background: "radial-gradient(50% 40% at 50% 0%, rgba(4,107,210,0.07), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">

          {/* LEFT — heading, stats, CTAs. */}
          <ScrollReveal className="lg:col-span-5">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#2d98f1]">Customer outcomes</p>
            <h2 className="font-heading text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.25rem]">
              Loved by teams, <span className="text-white/55">trusted by results.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              From dental clinics to logistics ops — answering, qualifying, and closing 24/7.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {METRICS.map(m => (
                <div key={m.label} className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#000000] px-2.5 py-3.5 text-center">
                  <div className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(to right, transparent, ${m.tint}50, transparent)` }} />
                  <p className="font-heading text-xl font-medium tracking-tight sm:text-2xl" style={{ color: m.tint }}>
                    {m.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-white/40">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/get-started"
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#046bd2] px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(4,107,210,0.4)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_36px_rgba(4,107,210,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
                Start Free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-white/65 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]">
                <PhoneCall className="h-3.5 w-3.5" />
                Talk to Sales
              </Link>
            </div>
          </ScrollReveal>

          {/* RIGHT — compact 2×2 testimonial grid. Card box stays fixed;
              hover is glow/scale-only, matching the Benefits card language. */}
          <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {TESTIMONIALS.map(t => (
              <StaggerItem key={t.author}>
                <figure
                  className="
                    group relative flex h-full flex-col overflow-hidden rounded-2xl
                    border border-white/[0.08] bg-[#000000] p-4
                    transition-[scale,border-color,box-shadow] duration-300 ease-out
                    hover:scale-[1.01] hover:border-[var(--tint-border)]
                    hover:shadow-[0_14px_36px_-16px_var(--tint-glow)]
                  "
                  style={{ "--tint-border": `${t.tint}50`, "--tint-glow": `${t.tint}55` } as React.CSSProperties}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                    style={{ background: `linear-gradient(90deg, transparent, ${t.tint}, transparent)` }} />

                  <StarRating rating={t.rating} tint={t.tint} />

                  <blockquote className="mt-2.5 flex-1 text-[13px] leading-relaxed text-white/65">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-3 flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                      style={{ background: `${t.tint}18`, color: t.tint, outline: `1px solid ${t.tint}30` }}>
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{t.author}</p>
                      <p className="text-[10px] text-white/30">{t.company}</p>
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
