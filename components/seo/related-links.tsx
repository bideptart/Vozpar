"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"

export type RelatedLink = {
  href: string
  title: string
  description: string
}

const CARD_THEMES = [
  {
    numColor: "text-sky-400/40 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_16px_rgba(56,189,248,0.6)]",
    glowColor: "rgba(56, 189, 248, 0.25)",
    borderColor: "group-hover:border-sky-500/40",
    badgeBg: "rgba(56, 189, 248, 0.12)",
    badgeText: "#38bdf8",
    badgeShadow: "0 0 20px 2px rgba(56, 189, 248, 0.4)",
    lineGradient: "from-sky-500 via-cyan-400 to-transparent",
    hoverTitle: "group-hover:text-sky-300",
  },
  {
    numColor: "text-amber-400/40 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]",
    glowColor: "rgba(245, 158, 11, 0.25)",
    borderColor: "group-hover:border-amber-500/40",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    badgeText: "#fbbf24",
    badgeShadow: "0 0 20px 2px rgba(245, 158, 11, 0.4)",
    lineGradient: "from-amber-500 via-yellow-400 to-transparent",
    hoverTitle: "group-hover:text-amber-300",
  },
  {
    numColor: "text-emerald-400/40 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]",
    glowColor: "rgba(16, 185, 129, 0.25)",
    borderColor: "group-hover:border-emerald-500/40",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeText: "#34d399",
    badgeShadow: "0 0 20px 2px rgba(16, 185, 129, 0.4)",
    lineGradient: "from-emerald-500 via-teal-400 to-transparent",
    hoverTitle: "group-hover:text-emerald-300",
  },
]

function InteractiveCard({ link, index }: { link: RelatedLink; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const theme = CARD_THEMES[index % CARD_THEMES.length]
  const num = String(index + 1).padStart(2, "0")

  // Mouse tracking for 3D tilt & cursor spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 }
  const sx = useSpring(nx, springConfig)
  const sy = useSpring(ny, springConfig)

  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6])

  const mx = useSpring(mouseX, springConfig)
  const my = useSpring(mouseY, springConfig)

  const spotlight = useMotionTemplate`radial-gradient(350px circle at ${mx}px ${my}px, ${theme.glowColor}, transparent 80%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)
    nx.set(x / rect.width - 0.5)
    ny.set(y / rect.height - 0.5)
  }

  function handleMouseLeave() {
    nx.set(0)
    ny.set(0)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        <Link
          href={link.href}
          className={`group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d14] p-7 backdrop-blur-2xl transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ${theme.borderColor}`}
        >
          {/* Dynamic 3D Cursor Spotlight */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight, transform: "translateZ(10px)" }}
          />

          {/* Animated Background Orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-20 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-60"
            style={{ background: theme.glowColor }}
          />

          {/* Top row: Number & Glowing Arrow */}
          <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex items-start justify-between">
            <span className={`font-sans text-5xl font-extrabold tracking-tight transition-all duration-300 group-hover:scale-105 ${theme.numColor}`}>
              {num}
            </span>

            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-45"
              style={{
                background: theme.badgeBg,
                color: theme.badgeText,
                boxShadow: theme.badgeShadow,
              }}
            >
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300" aria-hidden />
            </div>
          </div>

          {/* Content section */}
          <div style={{ transform: "translateZ(25px)" }} className="relative z-10 mt-8 flex flex-1 flex-col justify-end">
            <h3 className={`font-sans text-xl font-bold tracking-tight text-white transition-colors duration-300 ${theme.hoverTitle}`}>
              {link.title}
            </h3>
            <p className="mt-2.5 font-sans text-sm leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
              {link.description}
            </p>
          </div>

          {/* Bottom expanding gradient line */}
          <span
            className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${theme.lineGradient} scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100`}
            aria-hidden="true"
          />

          {/* Shimmer sweep effect on hover */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
            animate={{ x: ["-140%", "340%"] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />
        </Link>
      </motion.div>
    </motion.li>
  )
}

/**
 * Site-wide internal-linking module rendering dark-mode glassmorphic cards (#0a0d14)
 * with interactive 3D perspective tilt, cursor-following spotlight, animated background orbs,
 * glowing top-right arrows, expanding bottom neon accents, and smooth hover lift animations.
 */
export function RelatedLinks({
  heading = "Keep exploring Vozpar",
  description = "Related guides, pricing, and use cases curated for the calls you take.",
  links,
}: {
  heading?: string
  description?: string
  links: RelatedLink[]
  variant?: "default" | "flip"
}) {
  return (
    <section aria-labelledby="related-heading" className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
      <div className="mb-10">
        <h2 id="related-heading" className="text-balance font-serif text-4xl font-normal leading-[1.1] tracking-tight text-white md:text-5xl">
          {heading}
        </h2>
        <p className="mt-4 max-w-2xl text-pretty font-sans text-base leading-relaxed text-slate-400 md:text-lg">
          {description}
        </p>
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {links.map((l, idx) => (
          <InteractiveCard key={l.href} link={l} index={idx} />
        ))}
      </ul>
    </section>
  )
}
