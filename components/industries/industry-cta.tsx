"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import { StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { Magnetic } from "@/components/industries/industries-fx"
import { AnimatedWords } from "@/components/industries/animated-headline"
import { headingType, bodyType, monoStyle } from "@/lib/industries-typography"

/**
 * Closing CTA for the industries listing page ("Don't see your industry
 * listed?"). Pulled out into its own client component (rather than inlining
 * motion.* JSX in app/industries/page.tsx, a Server Component that exports
 * `metadata`) — mirrors the same server/client boundary rule established
 * earlier in this page's build. Self-contained, no props.
 *
 * Redesign pass (2026-07-23): the plain solid card read as flat next to the
 * rest of the page's more considered moments — no eyebrow, no proof points,
 * a single line of copy floating in a lot of empty card. Brought it up to
 * the same bar as /features' closing CTA (components/sections/feature-outro.tsx
 * → FeatureCta): a slow rotating conic-gradient border (`.spin-slow`,
 * globals.css), an eyebrow pill matching this page's own `ai-pill-cyan`
 * convention, and a row of proof points under the heading so the card
 * carries more than one idea. Kept the cursor-tilt/spotlight card and the
 * gradient CTA button with its shimmer sweep — those were already good.
 */

const PROOF_POINTS = [
  { label: "48-hour working prototype", tint: "#3b82f6" },
  { label: "No commitment to start", tint: "#22c55e" },
  { label: "Built by voice engineers", tint: "#f2a71b" },
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
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 22%, transparent), transparent 70%)`

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
      className="group relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0b0b0e] px-5 py-8 transition-colors duration-300 sm:px-8 sm:py-10 md:px-12 md:py-14"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export function IndustryCTA() {
  const reduced = useReducedMotion()

  return (
<<<<<<< HEAD
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden bg-black px-4 pb-24 md:px-6">
      <FloatingAccents />
      <FloatingIconBadges />
=======
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden bg-black px-4 pb-16 pt-4 sm:pb-20 sm:pt-6 md:px-6 md:pb-24 md:pt-8">
      {/* FloatingAccents/FloatingIconBadges removed from this section — the
          card now has its own rotating conic border, cursor spotlight, and
          shimmer, so the drifting background orbs/badges just poked out
          from behind its edges as visible clutter instead of adding
          anything. Still used elsewhere on this page (e.g. the hero) where
          there's no foreground card to peek out from behind. */}
      {/* Ambient glow — sized down on phone. At a flat 420px it was wider
          than the viewport itself below `sm`, which just reads as a hazy
          uniform wash across the whole card instead of a soft accent. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[70px] sm:h-[320px] sm:w-[320px] sm:blur-[90px] md:h-[420px] md:w-[420px] md:blur-[100px]"
        animate={{ opacity: [0.08, 0.2, 0.08], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
>>>>>>> 1381d76d59ff11bc4f695c233c035fb979dd943b

      <StaggerGroup className="relative" stagger={0.12}>
        <StaggerItem>
          {/* p-px + a rotating conic gradient clipped underneath = a 1px
              border that visibly travels around the card, same technique as
              /features' closing CTA. Skipped under reduced motion — a
              flat border takes over via the plain span below instead. */}
          <div className="relative overflow-hidden rounded-3xl p-px">
            {!reduced && (
              <span
                aria-hidden
                className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, var(--primary) 40deg, transparent 100deg, transparent 200deg, var(--accent) 250deg, transparent 310deg)",
                  opacity: 0.7,
                }}
              />
            )}
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10" />

            <GlowCard>
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="max-w-xl">
                  <span className="ai-pill-cyan" style={monoStyle.sectionTag}>
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Custom builds
                  </span>

                  <h3 className={`mt-4 text-balance text-white ${headingType.h3}`}>
                    <AnimatedWords text="Don't see your industry listed?" />
                  </h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className={`mt-3 text-muted-foreground ${bodyType.paragraph}`}
                  >
                    We&apos;ve built agents for security, recruiting, property management, insurance, finance, and
                    dozens of workflows beyond these ten. Describe the calls that consume your day, and we&apos;ll
                    deliver a working prototype within 48 hours.
                  </motion.p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {PROOF_POINTS.map((p, i) => (
                      <motion.span
                        key={p.label}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.tint }} />
                        {p.label}
                      </motion.span>
                    ))}
                  </div>
                </div>
                {/* Stacked, full-width buttons below `sm` — side-by-side at
                    this card's mobile width either wrapped awkwardly or
                    squeezed both labels down; a phone visitor gets two clear
                    full-width taps instead. */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap md:flex-col md:items-stretch"
                >
                  <Magnetic className="w-full sm:w-auto md:w-full">
                    <div className="group/btn relative w-full overflow-hidden rounded-md">
                      <Button
                        asChild
                        size="lg"
                        className={`relative w-full bg-gradient-to-r from-primary to-accent text-white shadow-[0_8px_24px_-8px_var(--primary)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-10px_var(--primary)] ${bodyType.button}`}
                      >
                        <Link href="/get-started">
                          Get started <ArrowRight className="ml-1 size-4" aria-hidden />
                        </Link>
                      </Button>
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                        animate={{ x: ["-140%", "340%"] }}
                        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3.5, ease: "easeInOut" }}
                      />
                    </div>
                  </Magnetic>
                  <Magnetic className="w-full sm:w-auto md:w-full">
                    <Button asChild size="lg" variant="outline" className={`w-full ${bodyType.button}`}>
                      <Link href="/pricing">View pricing</Link>
                    </Button>
                  </Magnetic>
                </motion.div>
              </div>
            </GlowCard>
          </div>
        </StaggerItem>
      </StaggerGroup>
    </section>
  )
}
