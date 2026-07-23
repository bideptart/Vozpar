"use client"

import type React from "react"
import { useRef } from "react"
import Link from "next/link"
import { Home, Stethoscope, HeartPulse, Wrench, UtensilsCrossed, Car, ArrowRight, type LucideIcon } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { cn } from "@/lib/utils"
import { ScrollReveal, StaggerGroup } from "@/components/animation/scroll-reveal"
import { headingType, bodyType, monoStyle } from "@/lib/industries-typography"
import { FloatingAccents } from "@/components/industries/industries-fx"

type IndustryCardItem = {
  id: string
  icon: LucideIcon
  title: string
  accent: string
  logoColor: string
  href: string
  description: string
}

/**
 * Per-card accent colors — a deliberate, explicit exception to this page's
 * black+blue lock, made at the user's request to match a rozper.com feature
 * grid reference (each card there carries its own distinct hue: blue, gold,
 * green, red, teal, purple). Scoped to this one grid only — every other
 * industries-page component keeps the blue-only palette.
 */
const items: IndustryCardItem[] = [
  {
    id: "real-estate",
    icon: Home,
    title: "Real estate",
    accent: "var(--primary)",
    logoColor: "#1e6fd6",
    href: "/industries/real-estate",
    description:
      "Qualifies every buyer and seller lead the instant it arrives, books showings on your calendar, and follows up before the moment goes cold.",
  },
  {
    id: "dental",
    icon: Stethoscope,
    title: "Dental",
    accent: "var(--primary)",
    logoColor: "#14b8a6",
    href: "/industries/dental",
    description:
      "Confirms appointments, fills cancellations the same day, and handles insurance questions — so the front desk never has to choose between the phone and the chair.",
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    title: "Healthcare",
    accent: "var(--primary)",
    logoColor: "#d92b34",
    href: "/industries/healthcare",
    description:
      "Manages intake, refills, and reminder calls with a calm, HIPAA-aware bedside manner patients won't distinguish from a person.",
  },
  {
    id: "home-services",
    icon: Wrench,
    title: "Home services",
    accent: "var(--primary)",
    logoColor: "#f2a71b",
    href: "/industries/home-services",
    description:
      "Captures every after-hours call, triages the job, and dispatches the right technician — so a slow callback never costs you the work.",
  },
  {
    id: "restaurants",
    icon: UtensilsCrossed,
    title: "Restaurants",
    accent: "var(--primary)",
    logoColor: "#1f9d55",
    href: "/industries/restaurants",
    description:
      "Takes reservations, confirms large parties, and answers hours and menu questions fluently, in any accent your guests speak.",
  },
  {
    id: "automotive",
    icon: Car,
    title: "Automotive",
    accent: "var(--primary)",
    logoColor: "#8b5cf6",
    href: "/industries/automotive",
    description:
      "Books service, follows up on every test drive, and keeps the BDC lines open around the clock, across every rooftop you run.",
  },
]

/**
 * Solid feature-grid card — modeled on a rozper.com reference image (circular
 * colored icon badge, bold title, gray description, a soft color wash
 * bleeding up from the bottom). Extra touch-up pass adds: a cursor-tracking
 * 3D tilt + accent-colored spotlight (hand-rolled rather than reusing the
 * shared MouseGlowCard, which is glassy/backdrop-blur and would break the
 * explicit "solid card" requirement), a colored top edge, a pulsing ring
 * around the icon on hover, and a faint index number. Background stays
 * solid at rest — all of this is purely additive on top of the existing
 * hover language (lift, border glow, icon scale, CTA reveal).
 */
function IndustryFeatureCard({ item, index }: { item: IndustryCardItem; index: number }) {
  const Icon = item.icon
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const springCfg = { stiffness: 220, damping: 20, mass: 0.4 }
  const sx = useSpring(nx, springCfg)
  const sy = useSpring(ny, springCfg)
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, ${item.accent} 30%, transparent), transparent 70%)`

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
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="h-full"
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", "--card-accent": item.accent } as React.CSSProperties}
    >
      <Link
        href={item.href}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0d] p-6 transition-colors duration-300 hover:border-[color:var(--card-accent)]/60 md:p-7"
      >
        {/* colored top edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "var(--card-accent)" }}
        />

        {/* cursor-tracking spotlight, tinted with this card's own accent */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />

        {/* bottom color wash — always faintly present, intensifies on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-40 transition-opacity duration-500 group-hover:opacity-90"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 130%, color-mix(in oklch, var(--card-accent) 35%, transparent), transparent 70%)",
          }}
        />
        {/* subtle hover glow around the card edge */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "0 0 50px -18px var(--card-accent)" }}
        />

        {/* faint index number */}
        <span
          aria-hidden
          className="absolute right-5 top-5 text-white/15 md:right-6 md:top-6"
          style={{ ...monoStyle.tinyLabel, fontSize: "11px" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="relative flex size-12 flex-none items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110"
          style={{
            background:
              `radial-gradient(circle at 32% 28%, color-mix(in oklch, ${item.logoColor} 65%, white 35%), ${item.logoColor})`,
            boxShadow: `0 8px 20px -6px ${item.logoColor}`,
          }}
        >
          {/* pulsing ring, only while hovered */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ border: `1px solid ${item.logoColor}` }}
            initial={{ scale: 1, opacity: 0 }}
            whileHover={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.7, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
          />
          <Icon className="size-5" aria-hidden />
        </span>

        <h3 className={`relative mt-5 text-white ${headingType.h4}`}>{item.title}</h3>
        <p className={`relative mt-2.5 text-muted-foreground ${bodyType.smallPrint}`}>{item.description}</p>

        <span
          className={`relative mt-4 inline-flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${bodyType.labelEmphasis}`}
          style={{ color: "var(--card-accent)" }}
        >
          Explore playbook
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </motion.div>
  )
}

const cardEntranceVariants = (index: number) => ({
  hidden: { opacity: 0, y: 30, scale: 0.94, rotate: index % 2 === 0 ? -1.5 : 1.5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
})

export function Industries({ showHeader = true }: { showHeader?: boolean } = {}) {
  return (
    <section id="industries" className="relative overflow-hidden border-t border-border/40 bg-black">
      {/* vignette for extra depth behind the grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(80% 60% at 50% 35%, transparent 45%, black 100%)" }}
      />
      <FloatingAccents />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        {showHeader && (
          <ScrollReveal className="mx-auto max-w-xl text-center">
            <span className="ai-pill-cyan" style={monoStyle.sectionTag}>
              <span className="h-1 w-1 rounded-full bg-accent" />
              Industries
            </span>
            <h2 className={`mt-3 text-balance ${headingType.h2}`}>
              Precision-tuned for the calls{" "}
              <span className="text-primary">you handle every day.</span>
            </h2>
            <p className={`mt-2 text-pretty text-muted-foreground ${bodyType.paragraph}`}>
              Purpose-built scripts, integrations, and compliance guardrails for the workflows your team already runs.
            </p>
          </ScrollReveal>
        )}

        <StaggerGroup className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", showHeader && "mt-10")}>
          {items.map((item, i) => (
            <motion.div key={item.id} variants={cardEntranceVariants(i)} className="h-full">
              <IndustryFeatureCard item={item} index={i} />
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
