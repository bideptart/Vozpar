"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { Button } from "@/components/ui/button"
import { StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { FloatingAccents, FloatingIconBadges, Magnetic } from "@/components/industries/industries-fx"
import { AnimatedWords } from "@/components/industries/animated-headline"
import { headingType, bodyType } from "@/lib/industries-typography"

/**
 * Closing CTA for the industries listing page ("Don't see your industry
 * listed?"). Pulled out into its own client component (rather than inlining
 * motion.* JSX in app/industries/page.tsx, a Server Component that exports
 * `metadata`) — mirrors the same server/client boundary rule established
 * earlier in this page's build. Self-contained, no props.
 *
 * Final-touchup pass: the card previously used the shared MouseGlowCard,
 * whose glassy bg-card/60 backdrop-blur background and hardcoded red-ish
 * spotlight didn't match this page's solid-card, blue-accent language (every
 * other card on the page is now solid black with a primary-tinted hover
 * glow). Replaced with a hand-rolled tilt+spotlight card matching that
 * language, and gave the primary button the same gradient + shimmer sweep
 * as the footer's "Customer dashboard" button for a consistent look at both
 * of the page's conversion moments.
 */
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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e] px-6 py-12 transition-colors duration-300 hover:border-primary/40 md:px-12 md:py-14"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      {/* periodic shimmer sweep across the card */}
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

export function IndustryCTA() {
  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden bg-black px-4 pb-24 md:px-6">
      <FloatingAccents />
      <FloatingIconBadges />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[100px]"
        animate={{ opacity: [0.08, 0.2, 0.08], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <StaggerGroup className="relative" stagger={0.12}>
        <StaggerItem>
          <GlowCard>
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h3 className={`text-balance text-white ${headingType.h3}`}>
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
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-3"
              >
                <Magnetic>
                  <div className="group/btn relative overflow-hidden rounded-md">
                    <Button
                      asChild
                      size="lg"
                      className={`relative bg-gradient-to-r from-primary to-accent text-white shadow-[0_8px_24px_-8px_var(--primary)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-10px_var(--primary)] ${bodyType.button}`}
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
                <Magnetic>
                  <Button asChild size="lg" variant="outline" className={bodyType.button}>
                    <Link href="/pricing">View pricing</Link>
                  </Button>
                </Magnetic>
              </motion.div>
            </div>
          </GlowCard>
        </StaggerItem>
      </StaggerGroup>
    </section>
  )
}
