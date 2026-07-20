"use client"

import { Check, Minus, X } from "lucide-react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureComparison
 * Positions the platform against the two alternatives buyers are actually
 * weighing: keeping a legacy IVR, or assembling STT + LLM + TTS + SIP
 * in-house.
 *
 * Rendered as a real <table> for semantics/screen readers, with the row
 * label repeated as a card heading on narrow screens via a stacked layout.
 */

type Verdict = "yes" | "no" | "partial"

const COLUMNS = ["9278.ai", "Legacy IVR", "Build in-house"] as const

const ROWS: { label: string; cells: { verdict: Verdict; note: string }[] }[] = [
  {
    label: "Response latency",
    cells: [
      { verdict: "yes", note: "Under 300ms" },
      { verdict: "no", note: "Menu trees, no dialogue" },
      { verdict: "partial", note: "1–3s typical" },
    ],
  },
  {
    label: "Handles interruptions",
    cells: [
      { verdict: "yes", note: "Barge-in built in" },
      { verdict: "no", note: "Caller waits for the beep" },
      { verdict: "partial", note: "Needs custom VAD work" },
    ],
  },
  {
    label: "Time to first live call",
    cells: [
      { verdict: "yes", note: "An afternoon" },
      { verdict: "partial", note: "Weeks of scripting" },
      { verdict: "no", note: "Months of engineering" },
    ],
  },
  {
    label: "Scales to peak volume",
    cells: [
      { verdict: "yes", note: "Burst capacity included" },
      { verdict: "partial", note: "Licensed per port" },
      { verdict: "no", note: "You size the fleet" },
    ],
  },
  {
    label: "Compliance out of the box",
    cells: [
      { verdict: "yes", note: "Redaction + retention" },
      { verdict: "partial", note: "Varies by vendor" },
      { verdict: "no", note: "Your team owns it" },
    ],
  },
  {
    label: "Keeps your carrier",
    cells: [
      { verdict: "yes", note: "Bring your own SIP" },
      { verdict: "no", note: "Usually locked in" },
      { verdict: "yes", note: "If you wire it" },
    ],
  },
]

function VerdictIcon({ verdict }: { verdict: Verdict }) {
  if (verdict === "yes") {
    return <Check className="h-4 w-4 shrink-0" style={{ color: "var(--features-sky)" }} aria-label="Yes" />
  }
  if (verdict === "partial") {
    return <Minus className="h-4 w-4 shrink-0 text-slate-500" aria-label="Partial" />
  }
  return <X className="h-4 w-4 shrink-0 text-slate-600" aria-label="No" />
}

export function FeatureComparison() {
  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-white/10"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 h-[28rem] w-[28rem] -translate-x-1/3 rounded-full opacity-50 blur-[130px]"
        style={{ background: "oklch(0.45 0.2 258 / 0.3)" }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-20 md:px-6 md:py-28">
        <ScrollReveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Honest comparison
          </span>
          <h2 className="mt-5 text-balance text-3xl font-serif font-normal leading-tight tracking-tight text-white md:text-4xl">
            Against the alternatives.
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-slate-400">
            Building it yourself is entirely doable — it's mostly a question of whether voice infrastructure is what
            your team should be spending the next quarter on.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/20">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="px-5 py-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                      Capability
                    </th>
                    {COLUMNS.map((c, i) => (
                      <th
                        key={c}
                        scope="col"
                        className={`px-5 py-4 text-xs font-medium uppercase tracking-[0.16em] ${
                          i === 0 ? "text-white" : "text-slate-500"
                        }`}
                        style={i === 0 ? { background: "color-mix(in oklch, var(--features-blue) 12%, transparent)" } : undefined}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-white/[0.06] last:border-0">
                      <th
                        scope="row"
                        className="px-5 py-4 text-sm font-medium text-white"
                      >
                        {row.label}
                      </th>
                      {row.cells.map((cell, i) => (
                        <td
                          key={i}
                          className="px-5 py-4 align-top"
                          style={
                            i === 0
                              ? { background: "color-mix(in oklch, var(--features-blue) 8%, transparent)" }
                              : undefined
                          }
                        >
                          <span className="flex items-start gap-2.5">
                            <VerdictIcon verdict={cell.verdict} />
                            <span className={`text-sm ${i === 0 ? "text-slate-200" : "text-slate-400"}`}>
                              {cell.note}
                            </span>
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        <p className="mt-5 text-center text-xs text-slate-500">
          Comparison reflects typical deployments; your mileage varies with carrier, region, and call complexity.
        </p>
      </div>
    </section>
  )
}
