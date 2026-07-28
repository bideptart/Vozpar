"use client"

import { motion, useReducedMotion } from "motion/react"
import { INDUSTRIES } from "@/lib/industries"
import { monoStyle } from "@/lib/industries-typography"
import { cn } from "@/lib/utils"

/**
 * Hero "trusted by" style strip — structurally modeled on a client-logo
 * marquee (horizontal scrolling row) the user referenced, but populated
 * with our own industries (icon + name) rather than real company logos.
 * Rendered as a bare overlay directly on the hero background — no card,
 * border, or fill — with a mask-image edge fade so items dissolve into
 * whatever's behind them instead of a painted gradient box. Replaces
 * IndustryQuickLinks in the hero. Self-imports INDUSTRIES (client
 * component reading icon component refs directly, not as a prop).
 */
// One tint per item, cycled — the flat bg-primary/10 badge made every
// industry look identical (same blue square, different icon). Cycling a
// small palette gives each item its own identity, same approach as the FAQ
// category pills and the tab bars elsewhere on the site.
const TINTS = ["#2d98f1", "#10b981", "#f59e0b", "#a855f7", "#ef4444", "#0ea5e9"]

export function IndustryMarquee() {
  const reduced = useReducedMotion()
  const loop = [...INDUSTRIES, ...INDUSTRIES]
  const edgeFade = "linear-gradient(to right, transparent, black 12%, black 88%, transparent)"

  return (
    <motion.div
      className="relative mx-auto mt-10 w-full max-w-6xl overflow-hidden py-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn("flex w-max items-center gap-14", !reduced && "marquee")}
        style={{
          maskImage: edgeFade,
          WebkitMaskImage: edgeFade,
          animationDuration: reduced ? undefined : "48s",
        }}
      >
        {loop.map((industry, i) => {
          const Icon = industry.icon
          const tint = TINTS[i % TINTS.length]
          return (
            <div
              key={`${industry.slug}-${i}`}
              className="flex flex-none items-center gap-3.5 opacity-70 transition-opacity duration-500 ease-out hover:opacity-100"
            >
              <span
                className="flex size-12 flex-none items-center justify-center rounded-xl border transition-transform duration-300"
                style={{
                  borderColor: `${tint}35`,
                  background: `linear-gradient(155deg, ${tint}22, ${tint}08)`,
                  color: tint,
                  boxShadow: `0 6px 18px -8px ${tint}50`,
                }}
              >
                <Icon className="size-6" aria-hidden />
              </span>
              <span
                className="whitespace-nowrap text-white"
                style={{ ...monoStyle.strongLabel, fontSize: "19px", letterSpacing: "0.3px" }}
              >
                {industry.name}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
