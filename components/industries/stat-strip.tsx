"use client"

import { monoStyle } from "@/lib/industries-typography"
import { CountUp } from "@/components/industries/count-up"
import { StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

/**
 * New for the onething.design-inspired redesign: a small row of stats that
 * count up once they scroll into view, mirroring the "portfolio stat card"
 * pattern that agency sites like onething.design use — but built from real
 * numbers this page already states elsewhere (10 industries, 24/7 coverage,
 * live in under 5 minutes), not invented figures.
 * Industries-page-only; lives in components/industries/ alongside the rest
 * of this page's animation primitives.
 */

const STATS = [
  { value: 10, suffix: "", label: "Industry playbooks" },
  { value: 24, suffix: "/7", label: "Always answering" },
  { value: 5, suffix: " min", label: "Time to go live" },
]

export function StatStrip() {
  return (
    <StaggerGroup
      className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 border-t border-white/10 pt-6 sm:mt-12 sm:gap-x-12 sm:gap-y-6 sm:pt-8"
      stagger={0.14}
    >
      {STATS.map((stat) => (
        <StaggerItem key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-[var(--accent)] sm:text-4xl md:text-5xl">
            <CountUp value={stat.value} />
            {stat.suffix}
          </div>
          <div
            className="mt-1.5 inline-block rounded-full bg-black/70 px-2 py-0.5 uppercase text-white/50 backdrop-blur-sm sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none"
            style={monoStyle.sectionTag}
          >
            {stat.label}
          </div>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
