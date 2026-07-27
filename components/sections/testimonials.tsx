"use client"

// PLACEHOLDER: Replace all author/company details with real approved testimonials before launch.

import type React from "react"
import Link from "next/link"
import { Star, ArrowRight, PhoneCall, Sparkles, PhoneIncoming, Clock3, TrendingUp } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

const METRICS = [
  { value: "2.4M+", label: "Calls / month",   tint: "#2d98f1", icon: PhoneIncoming },
  { value: "62%",   label: "Ops time saved",  tint: "#10b981", icon: Clock3 },
  { value: "3.1×",  label: "Lead lift",       tint: "#2d98f1", icon: TrendingUp },
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
  {
    quote: "We run three languages across two time zones with one agent config. Callers never notice a handoff.",
    author: "Ops Lead",
    company: "Logistics",
    initial: "O",
    tint: "#f59e0b",
    rating: 4.9,
  },
  {
    quote: "Booking confirmations, reschedules, no-show follow-ups — it does the entire front desk without a script feeling.",
    author: "Practice Manager",
    company: "Dental Clinic",
    initial: "P",
    tint: "#ec4899",
    rating: 5.0,
  },
  {
    quote: "Our closers only get on the phone once a lead is already qualified and hot. Pipeline quality changed overnight.",
    author: "Founder",
    company: "Real Estate Group",
    initial: "F",
    tint: "#14b8a6",
    rating: 4.9,
  },
] as const

type Testimonial = (typeof TESTIMONIALS)[number]

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className="
        group relative flex h-full w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl
        border border-white/[0.08] bg-[#000000] p-5
        transition-[border-color,box-shadow] duration-300 ease-out
        hover:border-[var(--tint-border)]
        hover:shadow-[0_14px_36px_-16px_var(--tint-glow)]
        sm:w-[340px]
      "
      style={{ "--tint-border": `${t.tint}50`, "--tint-glow": `${t.tint}55` } as React.CSSProperties}
    >
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${t.tint}, transparent)` }} />

      <StarRating rating={t.rating} tint={t.tint} />

      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: `${t.tint}18`, color: t.tint, outline: `1px solid ${t.tint}30` }}>
          {t.initial}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.author}</p>
          <p className="text-xs text-white/30">{t.company}</p>
        </div>
      </figcaption>
    </figure>
  )
}

function StarRating({ rating, tint }: { rating: number; tint: string }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5"
            style={i < full ? { fill: "#fbbf24", color: "#fbbf24" } : { fill: "transparent", color: "rgba(255,255,255,0.18)" }}
            aria-hidden
          />
        ))}
      </div>
      <span className="font-mono text-xs font-semibold" style={{ color: tint }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

/**
 * Cards are bigger now (300/340px vs 240/270px) and there are seven instead
 * of four, so a static row would either overflow badly or need most of them
 * hidden. Looping them in place — same left/right split, same column width
 * as before — keeps the section's footprint exactly where it was while
 * still surfacing every testimonial. Reuses the .marquee CSS class already
 * defined for the industries page marquee (globals.css), doubled so the
 * loop seam is invisible, and pauses on hover so a card can be read.
 */
export function Testimonials() {
  const reduced = useReducedMotion()
  const rendered = reduced ? TESTIMONIALS : [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
        style={{ background: "radial-gradient(50% 40% at 50% 0%, rgba(4,107,210,0.07), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-center">

          {/* LEFT — heading, stats, CTAs. */}
          <ScrollReveal className="lg:col-span-5">
            <span className="ai-pill-blue">
              <Sparkles className="h-3 w-3" />
              Customer outcomes
            </span>

            <h2 className="mt-5 font-heading text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.25rem]">
              Loved by teams,{" "}
              <span className="bg-gradient-to-r from-white/85 via-white/55 to-white/85 bg-clip-text text-transparent">
                trusted by results.
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              From dental clinics to logistics ops — answering, qualifying, and closing 24/7.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2.5">
              {METRICS.map(m => {
                const Icon = m.icon
                return (
                  <div
                    key={m.label}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#000000] px-2.5 py-3.5 text-center transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-x-0 top-0 h-px transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: `linear-gradient(to right, transparent, ${m.tint}50, transparent)` }} />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ boxShadow: `inset 0 0 0 1px ${m.tint}45, 0 12px 28px -14px ${m.tint}70` }}
                    />
                    <Icon className="mx-auto h-3.5 w-3.5 opacity-70" style={{ color: m.tint }} aria-hidden />
                    <p className="mt-1.5 font-heading text-xl font-medium tracking-tight sm:text-2xl" style={{ color: m.tint }}>
                      {m.value}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-tight text-white/40">{m.label}</p>
                  </div>
                )
              })}
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

          {/* RIGHT — same column footprint as before, but now a looping
              horizontal row instead of a static one so all 7 testimonials
              surface without the section growing. Bleeds slightly past its
              own column edges (-mx) so the fade mask has room to work
              without visibly clipping the first/last card's border. */}
          <div className="lg:col-span-7">
            <div className="relative -mx-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] sm:-mx-6 lg:mx-0">
              <div className="marquee flex gap-3 px-4 sm:px-6 lg:px-0" style={{ animationDuration: "12s" }}>
                {rendered.map((t, i) => (
                  <TestimonialCard key={`${t.author}-${i}`} t={t} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
