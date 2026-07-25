"use client"

// PLACEHOLDER: Replace all author/company details with real approved testimonials before launch.

import { Star } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const METRICS = [
  { value: "2.4M+", label: "Calls handled / month", tint: "#2d98f1" },
  { value: "62%",   label: "Average ops time saved", tint: "#10b981" },
  { value: "3.1×",  label: "Qualified lead lift",    tint: "#2d98f1" },
]

const TESTIMONIALS = [
  {
    quote: "We replaced our after-hours answering service in under two weeks. Every inbound call is handled, scheduled, and logged before anyone on the team sees it in the morning.",
    author: "VP of Operations",
    company: "Home Services Provider",
    initial: "V",
    tint: "#2d98f1",
    metric: "Saved 60 hrs/week",
  },
  {
    quote: "The agent handles objection rebuttals and books demos without sounding scripted. It has become our highest-volume prospecting channel inside a single quarter.",
    author: "Head of Sales",
    company: "B2B SaaS Company",
    initial: "H",
    tint: "#046bd2",
    metric: "+38% conversion",
  },
  {
    quote: "We were quoted six months by an enterprise vendor. We had a working voice agent in production by day four — connected to our calendar, CRM, and existing number.",
    author: "CTO",
    company: "Enterprise Software Team",
    initial: "C",
    tint: "#2d98f1",
    metric: "Live in 4 days",
  },
  {
    quote: "Tier-1 support volume dropped overnight. Routine queries that used to eat two hours of every rep's morning are now fully resolved before the team logs in.",
    author: "Director of Support",
    company: "E-commerce Brand",
    initial: "D",
    tint: "#046bd2",
    metric: "99.4% deflection",
  },
]

export function Testimonials() {
  const reduced = useReducedMotion()

  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
        style={{ background: "radial-gradient(50% 40% at 50% 0%, rgba(4,107,210,0.06), transparent 70%)" }} />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">

        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#2d98f1]">Customer outcomes</p>
          <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Loved by teams,{" "}
            <span className="text-white/55">trusted by results.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/40">
            From dental clinics to logistics ops — answering, qualifying, and closing 24/7.
          </p>
        </ScrollReveal>

        {/* Metrics row */}
        <StaggerGroup className="mb-10 grid gap-3 sm:grid-cols-3">
          {METRICS.map(m => (
            <StaggerItem key={m.label}>
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08090e] px-7 py-7 text-center">
                <div className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${m.tint}50, transparent)` }} />
                <p className="font-heading text-4xl font-medium tracking-tight" style={{ color: m.tint }}>
                  {m.value}
                </p>
                <p className="mt-2 text-sm text-white/40">{m.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* Cards */}
        <StaggerGroup className="grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map(t => (
            <StaggerItem key={t.author}>
              <motion.figure
                whileHover={reduced ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#08090e] p-7"
              >
                <div className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(to right, transparent, ${t.tint}45, transparent)` }} />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(50% 35% at 50% 0%, ${t.tint}07, transparent)` }} />

                {/* Stars + metric */}
                <div className="relative mb-5 flex items-center justify-between gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
                    ))}
                  </div>
                  <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium"
                    style={{ color: t.tint, borderColor: `${t.tint}28`, background: `${t.tint}0c` }}>
                    {t.metric}
                  </span>
                </div>

                <blockquote className="relative text-[15px] leading-relaxed text-white/65">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="relative mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    style={{ background: `${t.tint}16`, color: t.tint, outline: `1px solid ${t.tint}25` }}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.author}</p>
                    <p className="text-xs text-white/30">{t.company}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
