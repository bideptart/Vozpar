"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import {
  motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform,
} from "motion/react"
import { Magnetic } from "@/components/animation/magnetic"
import { StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { AnimatedWords } from "@/components/industries/animated-headline"

/**
 * Home's closing CTA, rebuilt to match the Industries page's own closing CTA
 * (components/industries/industry-cta.tsx) — cursor-tilt glass card, a
 * spotlight that follows the pointer, a periodic shimmer sweep, an ambient
 * breathing glow behind the card, and a word-by-word heading reveal
 * (AnimatedWords is generic despite living in the industries/ folder — no
 * industries-specific styling baked into it, safe to reuse here).
 *
 * Every proof point is still a claim already stated elsewhere on this page
 * (Hero's trust chips, the FAQ's stated terms) rather than new marketing
 * filler — that constraint from the previous pass carries over; only the
 * presentation (plain tinted dots, matching Industries' own format) changed.
 */

const PROOF_POINTS = [
  { label: "Live in under an hour", tint: "#2d98f1" },
  { label: "Self-hosted — your own server", tint: "#10b981" },
  { label: "60-day voice credit included", tint: "#60b8ff" },
]

function GlowCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const springCfg = { stiffness: 200, damping: 20, mass: 0.4 }
  const sx = useSpring(nx, springCfg)
  const sy = useSpring(ny, springCfg)
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3, 3])
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, #2d98f1 22%, transparent), transparent 70%)`

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
    nx.set(x / rect.width - 0.5)
    ny.set(y / rect.height - 0.5)
  }

  function handleLeave() {
    nx.set(0)
    ny.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#000000] px-6 py-8 transition-colors duration-300 sm:px-8 sm:py-10 md:px-12 md:py-12"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={{ x: ["-140%", "260%"] }}
        transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "easeInOut" }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export function CTA() {
  const reduced = useReducedMotion()

  return (
    <section id="cta" className="relative overflow-hidden border-t border-white/[0.06] bg-black py-12 md:py-16">
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Ambient breathing glow behind the card. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[70px] sm:h-[320px] sm:w-[320px] sm:blur-[90px] md:h-[420px] md:w-[420px] md:blur-[100px]"
          animate={reduced ? undefined : { opacity: [0.08, 0.2, 0.08], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        <StaggerGroup className="relative" stagger={0.12}>
          <StaggerItem>
            {/* p-px + a rotating conic gradient clipped underneath = a 1px
                border that visibly travels around the card. */}
            <div className="relative overflow-hidden rounded-3xl p-px">
              {!reduced && (
                <span
                  aria-hidden
                  className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, #046bd2 40deg, transparent 100deg, transparent 200deg, #2d98f1 250deg, transparent 310deg)",
                    opacity: 0.85,
                  }}
                />
              )}
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl border border-[#2d98f1]/25" />

              <GlowCard>
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                  <div className="max-w-xl">
                    <span className="ai-pill-blue">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Live demo · no signup
                    </span>

                    <h2 className="mt-4 text-balance font-heading text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
                      <AnimatedWords text="Ready to see what a true AI voice partner feels like?" />
                    </h2>

                    <motion.p
                      initial={reduced ? undefined : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-3 text-[15px] font-light leading-relaxed text-white/50"
                    >
                      Talk to a live Vozpar agent right now, explore pricing, or book a no-pressure
                      20-minute walkthrough with our team.
                    </motion.p>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {PROOF_POINTS.map((point, i) => (
                        <motion.span
                          key={point.label}
                          initial={reduced ? false : { opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.45, delay: 0.45 + i * 0.08 }}
                          className="inline-flex items-center gap-2 text-xs text-white/45"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: point.tint }} />
                          {point.label}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Stacked, full-width buttons below `sm`. */}
                  <motion.div
                    initial={reduced ? undefined : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
                  >
                    <Magnetic strength={0.28} className="w-full sm:w-auto">
                      <div className="group/btn relative w-full overflow-hidden rounded-full sm:w-auto">
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
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          animate={{ x: ["-140%", "340%"] }}
                          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5, ease: "easeInOut" }}
                        />
                      </div>
                    </Magnetic>

                    <Magnetic strength={0.22} className="w-full sm:w-auto">
                      <Link
                        href="/contact"
                        className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08] sm:w-auto"
                      >
                        <Calendar className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden />
                        Book a demo
                      </Link>
                    </Magnetic>
                  </motion.div>
                </div>
              </GlowCard>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  )
}
