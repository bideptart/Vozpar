"use client"

import { monoStyle } from "@/lib/industries-typography"
import { CountUp } from "@/components/industries/count-up"

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
    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 border-t border-white/10 pt-8">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-4xl font-bold text-[var(--accent)] md:text-5xl">
            <CountUp value={stat.value} />
            {stat.suffix}
          </div>
          <div className="mt-1.5 uppercase text-white/50" style={monoStyle.sectionTag}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
