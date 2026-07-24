"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { cn } from "@/lib/utils"
import { ScrollReveal, StaggerGroup } from "@/components/animation/scroll-reveal"
import { INDUSTRIES } from "@/lib/industries"
import { headingType, bodyType, monoStyle } from "@/lib/industries-typography"

/**
 * Hover-to-expand industry filmstrip — all 10 industries sit in one row as
 * solid cards; the active one flex-grows open (icon, name, description, Know
 * more link) while the rest collapse to an icon + vertical rotated label.
 * Width change is a plain CSS `flex` transition (not Framer Motion — flex-grow
 * interpolates natively and reliably; see the "flex" Tailwind arbitrary
 * transition-property class below). Replaces the CardStack fan carousel
 * tried previously, per a reference image showing this exact expanding-strip
 * layout. See industries-playbooks-section-layout memory for this section's
 * design history. Per-card accent colors (ACCENT_BY_SLUG below) were later
 * added at the user's explicit request, reusing the same hex values as the
 * feature grid in components/sections/industries.tsx — the black+blue-only
 * lock no longer applies to either of these two sections, only to the rest
 * of the page.
 */

type ShowcaseItem = {
  slug: string
  name: string
  short: string
  icon: LucideIcon
  href: string
  accent: string
}

/**
 * Per-card accent colors — same explicit, user-requested exception to the
 * page's black+blue lock as components/sections/industries.tsx (same hex
 * values reused for the 6 shared industries so the two sections agree), now
 * extended to this filmstrip. Only the active/expanded card shows its accent;
 * collapsed strips stay neutral gray, keeping the existing hover behavior.
 */
const ACCENT_BY_SLUG: Record<string, string> = {
  "real-estate": "#3b82f6",
  dental: "#2dd4bf",
  healthcare: "#ef4444",
  "home-services": "#f2a71b",
  restaurants: "#22c55e",
  automotive: "#8b5cf6",
  legal: "#6366f1",
  education: "#ec4899",
  ecommerce: "#f97316",
  fitness: "#84cc16",
}

const items: ShowcaseItem[] = INDUSTRIES.map((industry) => ({
  slug: industry.slug,
  name: industry.name,
  short: industry.short,
  icon: industry.icon,
  href: `/industries/${industry.slug}`,
  accent: ACCENT_BY_SLUG[industry.slug] ?? "#3b82f6",
}))

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function FilmstripCard({ item, active }: { item: ShowcaseItem; active: boolean }) {
  const Icon = item.icon
  const ref = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)

  // Same cursor-tracking tilt + spotlight + glow + pulsing-icon-ring hover
  // language as the feature grid's IndustryFeatureCard
  // (components/sections/industries.tsx), reused here per explicit request.
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const springCfg = { stiffness: 220, damping: 20, mass: 0.4 }
  const sx = useSpring(nx, springCfg)
  const sy = useSpring(ny, springCfg)
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4])
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--card-accent) 30%, transparent), transparent 70%)`

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
    setHovering(true)
  }

  function handleLeave() {
    nx.set(0)
    ny.set(0)
    setHovering(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        {
          "--card-accent": item.accent,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        } as React.CSSProperties
      }
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border transition-colors duration-300",
        active
          ? "border-[color:var(--card-accent)]/50 bg-[#0b1220]"
          : "border-white/10 bg-[#08080a] hover:bg-white/[0.03]",
      )}
    >
      {/* cursor-tracking spotlight, tinted with this card's own accent */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* soft glow around the card edge on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "0 0 50px -20px var(--card-accent)" }}
      />

      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[3px]"
          style={{ background: "var(--card-accent)" }}
        />
      )}

      {active ? (
        <div className="relative z-10 flex h-full min-w-[300px] flex-col p-7 md:p-8">
          <span
            className="relative flex size-[68px] flex-none items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, color-mix(in oklch, var(--card-accent) 65%, white 35%), var(--card-accent))",
              boxShadow: "0 10px 26px -8px var(--card-accent)",
            }}
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ border: "1px solid var(--card-accent)" }}
              animate={hovering ? { scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] } : { scale: 1, opacity: 0 }}
              transition={
                hovering
                  ? { duration: 1.7, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }
                  : { duration: 0.3 }
              }
            />
            <Icon className="size-9" aria-hidden />
          </span>
          <h3 className={cn("mt-6 text-white", headingType.h4)} style={{ fontSize: "28px" }}>
            {item.name}
          </h3>
          <p
            className={cn("mt-3 text-pretty text-muted-foreground", bodyType.paragraph)}
            style={{ fontSize: "18px", lineHeight: 1.65 }}
          >
            {item.short}
          </p>
          <Link
            href={item.href}
            className={cn(
              "group/link relative mt-auto inline-flex w-fit items-center gap-2 pt-6 transition-opacity hover:opacity-80",
              bodyType.button,
            )}
            style={{ fontSize: "17px", color: "var(--card-accent)" }}
          >
            Know more
            <ArrowRight
              className="size-[18px] transition-transform duration-300 group-hover/link:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col items-center gap-6 py-8">
          <span className="relative flex size-14 flex-none items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white/80">
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ border: "1px solid var(--card-accent)" }}
              animate={hovering ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : { scale: 1, opacity: 0 }}
              transition={
                hovering
                  ? { duration: 1.7, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }
                  : { duration: 0.3 }
              }
            />
            <Icon className="size-6" aria-hidden />
          </span>
          <span
            className="flex-1 whitespace-nowrap uppercase text-white/45 transition-colors duration-300 group-hover:text-white/70"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              ...monoStyle.strongLabel,
              fontSize: "15px",
              letterSpacing: "2px",
            }}
          >
            {item.name}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export function IndustryShowcase() {
  const [hovered, setHovered] = useState<number | null>(null)
  const active = hovered ?? 0

  return (
    <section id="playbooks" className="relative overflow-hidden border-t border-border/40 bg-black py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="ai-pill-cyan" style={monoStyle.sectionTag}>
            Industry playbooks
          </span>
          <h2 className={cn("mt-5 text-balance text-white", headingType.h2)}>Ten playbooks, one platform.</h2>
          <p className={cn("mt-4 text-pretty text-muted-foreground", bodyType.intro)}>
            Hover any industry below to see exactly what your agent handles from day one.
          </p>
        </div>

        <ScrollReveal className="mt-16">
          <div onMouseLeave={() => setHovered(null)}>
            <StaggerGroup className="flex h-[480px] gap-2.5 md:gap-3" stagger={0.06}>
              {items.map((item, i) => (
                <motion.div
                  key={item.slug}
                  variants={itemVariants}
                  className="flex h-full"
                  animate={{ flex: active === i ? "4.5 4.5 0%" : "1 1 0%" }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  onMouseEnter={() => setHovered(i)}
                >
                  <FilmstripCard item={item} active={active === i} />
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
