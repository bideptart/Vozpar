"use client"

import Link from "next/link"
import { ArrowRight, CalendarDays, PhoneCall } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

function VoiceBar({ h, delay, reduced }: { h: number; delay: number; reduced: boolean }) {
  return (
    <motion.span
      className="block w-[3px] rounded-full"
      style={{ background: "linear-gradient(to top, rgba(4,107,210,0.5), #2d98f1)" }}
      animate={reduced ? { height: h } : { height: [h * 0.3, h, h * 0.5, h * 0.85, h * 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
    />
  )
}

export function CTA() {
  const reduced = useReducedMotion()
  const bars = [0.4, 0.7, 0.5, 1, 0.6, 0.85, 0.45, 0.9, 0.55, 0.8, 0.4, 0.75, 0.5]

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06]">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <ScrollReveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-[#046bd2]/18"
            style={{ background: "linear-gradient(145deg, #07090f 0%, #030507 55%, #07090f 100%)" }}
          >
            {/* Top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2d98f1]/45 to-transparent" />

            {/* Animated bg blobs */}
            <motion.div aria-hidden
              className="pointer-events-none absolute -top-28 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-[80px]"
              style={{ background: "#046bd2", opacity: 0.2 }}
              animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div aria-hidden
              className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full blur-[70px]"
              style={{ background: "#046bd2", opacity: 0.1 }}
              animate={reduced ? undefined : { x: [0, 36, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div aria-hidden
              className="pointer-events-none absolute -bottom-16 right-1/4 h-40 w-40 rounded-full blur-[70px]"
              style={{ background: "#2d98f1", opacity: 0.08 }}
              animate={reduced ? undefined : { x: [0, -36, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Subtle grid */}
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />

            {/* Content */}
            <div className="relative px-6 py-18 text-center sm:px-12 md:py-24">

              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#046bd2]/25 bg-[#046bd2]/[0.08] px-5 py-2"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm text-white/55">Live demo available · no signup required</span>
              </motion.div>

              {/* Voice visual */}
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }}
                className="mb-8 flex items-end justify-center gap-[4px]"
                aria-hidden
              >
                {bars.map((h, i) => (
                  <VoiceBar key={i} h={h * 38} delay={i * 0.09} reduced={Boolean(reduced)} />
                ))}
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }}
                className="font-heading text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl"
              >
                Ready to see what a true
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #2d98f1, rgba(255,255,255,0.9), #046bd2)" }}
                >
                  AI voice partner feels like?
                </span>
              </motion.h2>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.22 }}
                className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/40"
              >
                Talk to a live Vozpar agent right now, explore pricing, or book a
                no-pressure 20-minute walkthrough with our team.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.32 }}
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link
                  href="/get-started"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#046bd2] px-8 text-sm font-semibold text-white shadow-[0_0_24px_rgba(4,107,210,0.45)] transition-all duration-200 hover:bg-[#0579e8] hover:shadow-[0_0_40px_rgba(4,107,210,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 text-sm font-medium text-white/65 backdrop-blur-sm transition-all duration-200 hover:border-[#2d98f1]/30 hover:bg-[#046bd2]/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Book a demo
                </Link>
                <Link
                  href="/features"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/[0.07] px-8 text-sm font-medium text-white/40 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d98f1]"
                >
                  <PhoneCall className="h-4 w-4" />
                  Try live demo
                </Link>
              </motion.div>

              {/* Fine print */}
              <motion.p
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.48 }}
                className="mt-8 text-xs text-white/20"
              >
                No credit card required · Connect your number in under 5 minutes
              </motion.p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
