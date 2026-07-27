"use client"

import Link from "next/link"
import type { ElementType } from "react"
import { ArrowUpRight, Receipt, CircleQuestionMark, Zap, Layers, BookOpen, Rocket } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { SpotlightPanel } from "@/components/animation/magnetic"

export type RelatedGuideLink = {
  href: string
  title: string
  description: string
}

const TINTS = ["#3b82f6", "#10b981", "#ff7a00"]

function getGuideIcon(href: string): ElementType {
  if (href.includes("pricing")) return Receipt
  if (href.includes("faq")) return CircleQuestionMark
  if (href.includes("industries")) return Layers
  if (href.includes("get-started") || href.includes("start")) return Zap
  if (href.includes("docs")) return BookOpen
  return Rocket
}

function getPathBadge(href: string): string {
  if (href === "/") return "/HOME"
  return href.toUpperCase()
}

export function RelatedGuides({
  heading,
  description,
  links,
}: {
  heading: string
  description: string
  links: RelatedGuideLink[]
}) {
  const reduced = useReducedMotion()

  return (
    <section
      aria-labelledby="related-heading"
      className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 pb-24 pt-10 md:px-6 md:pb-28"
    >
      <div className="relative mb-10 text-center">
        <span className="ai-pill-cyan mb-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider">
          <span className="h-1 w-1 rounded-full bg-current" />
          Next
        </span>
        <h2 id="related-heading" className="mt-2 font-heading text-2xl font-medium tracking-tight text-white md:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] font-light leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <ul className="grid gap-5 md:grid-cols-3">
        {links.map((l, index) => {
          const tint = TINTS[index % TINTS.length]
          const Icon = getGuideIcon(l.href)
          const pathBadge = getPathBadge(l.href)

          return (
            <motion.li
              key={l.href}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <SpotlightPanel
                glow={tint}
                size={340}
                className="h-full overflow-hidden rounded-2xl border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  borderColor: `color-mix(in srgb, ${tint} 38%, transparent)`,
                  boxShadow: `0 0 24px -6px color-mix(in srgb, ${tint} 20%, transparent)`,
                }}
              >
                {/* Top hairline */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 transition-transform duration-500 group-hover/spot:scale-x-100"
                  style={{
                    background: `linear-gradient(90deg, ${tint}, color-mix(in srgb, ${tint} 10%, transparent))`,
                  }}
                />

                {/* Accent wash from top-left */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-40"
                  style={{
                    background: `radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, ${tint} 10%, transparent), transparent 65%)`,
                  }}
                />

                {/* Gradient sheen sweep */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-2/3 group-hover/spot:[animation:sheen-x_0.9s_ease-out]"
                  style={{
                    transform: "translateX(-140%) skewX(-18deg)",
                    background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${tint} 18%, transparent), transparent)`,
                  }}
                />

                <Link href={l.href} className="relative flex h-full flex-col p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover/spot:-rotate-6 group-hover/spot:scale-105"
                      style={{
                        background: `linear-gradient(155deg, color-mix(in srgb, ${tint} 30%, transparent), color-mix(in srgb, ${tint} 8%, transparent))`,
                        borderColor: `color-mix(in srgb, ${tint} 40%, transparent)`,
                        color: tint,
                        boxShadow: `0 8px 24px -10px color-mix(in srgb, ${tint} 60%, transparent)`,
                      }}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span
                      className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        color: `color-mix(in srgb, ${tint} 90%, white)`,
                        borderColor: `color-mix(in srgb, ${tint} 30%, transparent)`,
                        background: `color-mix(in srgb, ${tint} 10%, transparent)`,
                      }}
                    >
                      {pathBadge}
                    </span>
                  </div>

                  <div className="mt-6 flex-1">
                    <p className="font-heading text-lg font-medium leading-snug tracking-[-0.02em] text-foreground">
                      {l.title}
                    </p>
                    <p className="mt-2.5 text-[13px] font-light leading-relaxed text-muted-foreground">
                      {l.description}
                    </p>
                  </div>

                  {/* CTA bar */}
                  <span
                    className="relative mt-6 inline-flex h-10 items-center justify-between gap-2 overflow-hidden rounded-full border px-4 text-xs font-medium"
                    style={{
                      borderColor: `color-mix(in srgb, ${tint} 35%, transparent)`,
                      color: tint,
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-left scale-x-0 transition-transform duration-[400ms] ease-out group-hover/spot:scale-x-100"
                      style={{ background: tint }}
                    />
                    <span className="relative transition-colors duration-300 group-hover/spot:text-black font-semibold">
                      Explore
                    </span>
                    <ArrowUpRight className="relative h-4 w-4 transition-[transform,color] duration-300 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5 group-hover/spot:text-black" />
                  </span>
                </Link>
              </SpotlightPanel>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
