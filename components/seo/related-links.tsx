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

// Blue-black themed cards — matching image 2 layout (arrow top-right, title+desc bottom)
// but adapted to the Vozpar dark blue palette instead of pink
const CARD_THEMES = [
  {
    cardBg: "rgba(4, 107, 210, 0.07)",
    cardBgHover: "rgba(4, 107, 210, 0.13)",
    borderColor: "border-[#046bd2]/20",
    borderHover: "group-hover:border-[#046bd2]/50",
    badgeBg: "rgba(4, 107, 210, 0.15)",
    badgeBgHover: "#046bd2",
    badgeText: "#60a5fa",
    badgeShadow: "0 0 22px 4px rgba(4, 107, 210, 0.45)",
    glowColor: "rgba(4, 107, 210, 0.20)",
    hoverTitle: "group-hover:text-blue-300",
    lineGradient: "from-blue-500 via-blue-400 to-transparent",
  },
  {
    cardBg: "rgba(37, 117, 252, 0.07)",
    cardBgHover: "rgba(37, 117, 252, 0.13)",
    borderColor: "border-[#2575fc]/20",
    borderHover: "group-hover:border-[#2575fc]/50",
    badgeBg: "rgba(37, 117, 252, 0.15)",
    badgeBgHover: "#2575fc",
    badgeText: "#818cf8",
    badgeShadow: "0 0 22px 4px rgba(37, 117, 252, 0.45)",
    glowColor: "rgba(37, 117, 252, 0.20)",
    hoverTitle: "group-hover:text-indigo-300",
    lineGradient: "from-indigo-500 via-blue-400 to-transparent",
  },
  {
    cardBg: "rgba(0, 134, 249, 0.07)",
    cardBgHover: "rgba(0, 134, 249, 0.13)",
    borderColor: "border-[#0086f9]/20",
    borderHover: "group-hover:border-[#0086f9]/50",
    badgeBg: "rgba(0, 134, 249, 0.15)",
    badgeBgHover: "#0086f9",
    badgeText: "#38bdf8",
    badgeShadow: "0 0 22px 4px rgba(0, 134, 249, 0.45)",
    glowColor: "rgba(0, 134, 249, 0.20)",
    hoverTitle: "group-hover:text-sky-300",
    lineGradient: "from-sky-500 via-blue-400 to-transparent",
  },
]

function InteractiveCard({ link, index }: { link: RelatedLink; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const theme = CARD_THEMES[index % CARD_THEMES.length]

  // Mouse tracking for 3D tilt & cursor spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 }
  const sx = useSpring(nx, springConfig)
  const sy = useSpring(ny, springConfig)

  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5])

  const mx = useSpring(mouseX, springConfig)
  const my = useSpring(mouseY, springConfig)

  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, ${theme.glowColor}, transparent 80%)`

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
      initial={{ opacity: 0, y: 28 }}
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
          className={`group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border p-7 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(4,107,210,0.35)] ${theme.borderColor} ${theme.borderHover}`}
          style={{ background: "rgba(11,11,14,0.95)" }}
        >
          {/* Dynamic cursor spotlight */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight }}
          />

          {/* Subtle corner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-30"
            style={{ background: theme.glowColor }}
          />

          {/* Arrow badge — top right, like image 2 */}
          <div className="relative z-10 flex justify-end" style={{ transform: "translateZ(20px)" }}>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-45 group-hover:shadow-lg"
              style={{
                background: theme.badgeBg,
                color: theme.badgeText,
                boxShadow: "none",
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLDivElement).style.background = theme.badgeBgHover
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = theme.badgeShadow
                ;(e.currentTarget as HTMLDivElement).style.color = "#fff"
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLDivElement).style.background = theme.badgeBg
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = "none"
                ;(e.currentTarget as HTMLDivElement).style.color = theme.badgeText
              }}
            >
              <ArrowUpRight className="h-5 w-5" aria-hidden />
            </div>
          </div>

          {/* Title + description — bottom, like image 2 */}
          <div className="relative z-10 mt-6" style={{ transform: "translateZ(18px)" }}>
            <h3 className={`font-sans text-[1.05rem] font-bold leading-snug tracking-tight text-white transition-colors duration-300 ${theme.hoverTitle}`}>
              {link.title}
            </h3>
            <p className="mt-2.5 font-sans text-sm leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
              {link.description}
            </p>
          </div>

          {/* Bottom expanding accent line */}
          <span
            className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${theme.lineGradient} scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100`}
            aria-hidden="true"
          />

          {/* Shimmer sweep */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 group-hover:opacity-100"
            animate={{ x: ["-140%", "340%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
        </Link>
      </motion.div>
    </motion.li>
  )
}

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
    <section aria-labelledby="related-heading" className="bg-black w-full px-4 pb-24 pt-16 md:px-0 md:pb-28 md:pt-20">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-12">
          <h2 id="related-heading" className="font-serif text-4xl font-normal leading-[1.1] tracking-tight text-white md:text-5xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-slate-400 md:text-lg">
            {description}
          </p>
        </div>

        <ul className="grid gap-5 md:grid-cols-3">
          {links.map((l, idx) => (
            <InteractiveCard key={l.href} link={l} index={idx} />
          ))}
        </ul>
      </div>
    </section>
  )
}
