"use client"

import { motion } from "motion/react"
import { INDUSTRIES } from "@/lib/industries"
import { monoStyle } from "@/lib/industries-typography"

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
export function IndustryMarquee() {
  const loop = [...INDUSTRIES, ...INDUSTRIES]
  const edgeFade = "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"

  return (
    <div className="relative mx-auto mt-10 w-full max-w-6xl overflow-hidden py-4">
      <motion.div
        className="flex w-max items-center gap-14"
        style={{ maskImage: edgeFade, WebkitMaskImage: edgeFade }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 34, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {loop.map((industry, i) => {
          const Icon = industry.icon
          return (
            <div
              key={`${industry.slug}-${i}`}
              className="flex flex-none items-center gap-3 opacity-75 transition-opacity hover:opacity-100"
            >
              <span className="flex size-12 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
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
      </motion.div>
    </div>
  )
}
