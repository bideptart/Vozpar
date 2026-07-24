"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { headingType, bodyType } from "@/lib/industries-typography"
import { useRef } from "react"

export type RelatedGuideLink = {
  href: string
  title: string
  description: string
}

function GlowCard({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const springCfg = { stiffness: 200, damping: 20, mass: 0.4 }
  const sx = useSpring(nx, springCfg)
  const sy = useSpring(ny, springCfg)
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4])
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--primary) 30%, transparent), transparent 70%)`

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
    nx.set((e.clientX - rect.left) / rect.width - 0.5)
    ny.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleLeave() {
    nx.set(0)
    ny.set(0)
  }

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      href={href}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative flex h-full min-h-[280px] flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-10 transition-colors duration-300 hover:border-primary/50"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--accent)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
      />
      <div className="relative z-10">{children}</div>
    </motion.a>
  )
}

/**
 * Industries-page-only replacement for the shared
 * components/seo/related-links.tsx — that component is rendered on 9 pages
 * (pricing, faq, features, blog, contact, about, both industries pages), so
 * it can't be edited for a richer animation without touching all of them.
 * This carries the same heading/description/links props and content, just
 * with a staggered per-card entrance, hover lift, and hover glow — used only
 * on app/industries/page.tsx.
 */
export function RelatedGuides({
  heading,
  description,
  links,
}: {
  heading: string
  description: string
  links: RelatedGuideLink[]
}) {
  return (
    <section
      aria-labelledby="related-heading"
      className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 pb-24 md:px-6"
    >
      <ScrollReveal className="relative mb-10 text-center">
        <h2 id="related-heading" className={`text-balance text-white ${headingType.h3}`}>
          {heading}
        </h2>
        <p
          className={`mx-auto mt-2.5 max-w-2xl text-pretty text-muted-foreground ${bodyType.paragraph}`}
          style={{ fontSize: "17px" }}
        >
          {description}
        </p>
      </ScrollReveal>

      <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.14}>
        {links.map((l) => (
          <StaggerItem key={l.href} className="h-full">
            <GlowCard href={l.href}>
              <div className="relative">
                <p className={`text-white ${bodyType.labelEmphasis}`} style={{ fontSize: "24px", fontWeight: 700 }}>
                  {l.title}
                </p>
                <p
                  className={`mt-3.5 text-muted-foreground ${bodyType.smallPrint}`}
                  style={{ fontSize: "17px", lineHeight: 1.6 }}
                >
                  {l.description}
                </p>
              </div>
              <span
                className={`relative inline-flex items-center gap-2 text-primary ${bodyType.labelEmphasis}`}
                style={{ fontSize: "18px" }}
              >
                Read more
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </GlowCard>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
