"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Minus, Sparkles, X } from "lucide-react"
import { animate, motion, useInView, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureComparison
 * Positions the platform against the two alternatives buyers are actually
 * weighing: keeping a legacy IVR, or assembling STT + LLM + TTS + SIP
 * in-house.
 *
 * Still a real <table> for semantics and screen readers — the layout is
 * `table-fixed` with explicit column widths so the "best fit" cap and the
 * raised winner column can be positioned against known geometry instead of
 * whatever the auto layout algorithm decides. Below lg the table becomes one
 * card per capability: at md the four columns give each note cell ~106px,
 * about fifteen characters a line, so all eighteen of them ladder.
 */

type Verdict = "yes" | "no" | "partial"

const COLUMNS = ["Vozpar", "Legacy IVR", "Build in-house"] as const

/** Column widths — must total 100 and stay in sync with WINNER_LEFT below. */
const COL_W = ["28%", "24%", "24%", "24%"] as const
const WINNER_LEFT = "28%"
const WINNER_W = "24%"

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

/** Clean wins per column — the payoff strip under the table. */
const SCORES = COLUMNS.map((_, i) => ROWS.filter((r) => r.cells[i].verdict === "yes").length)

const SCORE_TINT = ["var(--features-green)", "var(--features-amber)", "var(--features-blue)"] as const

/* ---------------------------------------------------------------------- */

function VerdictIcon({ verdict, animated = true }: { verdict: Verdict; animated?: boolean }) {
  const reduced = useReducedMotion()
  const icon =
    verdict === "yes" ? (
      <Check className="h-4 w-4 shrink-0" style={{ color: "var(--features-green)" }} aria-label="Yes" />
    ) : verdict === "partial" ? (
      <Minus className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-label="Partial" />
    ) : (
      <X className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-label="No" />
    )

  if (!animated || reduced) return icon

  return (
    <motion.span
      className="inline-flex"
      initial={{ scale: 0.3, opacity: 0, rotate: verdict === "yes" ? -25 : 0 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 420, damping: 20 }}
    >
      {icon}
    </motion.span>
  )
}

/** Counts up once, the first time the strip is on screen. */
function ScoreStat({ value, label, tint }: { value: number; label: string; tint: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLParagraphElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [n, setN] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced || !inView) return
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduced, value])

  return (
    <div className="px-4 py-3 text-center">
      <p ref={ref} className="font-heading text-2xl font-medium tabular-nums tracking-[-0.025em] sm:text-3xl">
        <span style={{ color: tint }}>{n}</span>
        <span className="text-muted-foreground/40">/{ROWS.length}</span>
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-muted-foreground/70">
        {label}
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------------- */

export function FeatureComparison() {
  const reduced = useReducedMotion()

  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      {/* Ambient glow removed — flat black canvas per the /features theme. */}

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Honest comparison
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            Against the alternatives.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Building it yourself is entirely doable — it&apos;s mostly a question of whether voice infrastructure is
            what your team should be spending the next quarter on.
          </p>
        </ScrollReveal>

        {/* ---------- Small screens: compact list ----------
            One divided row per capability, not a card each. The winner's answer
            is the hero line; the two alternatives collapse into a single muted
            reference line beneath it. The old one-card-per-cell version stacked
            eighteen bordered blocks and ran ~2,300px on a phone; this is closer
            to a third of that while keeping every value on screen. */}
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/30 lg:hidden">
          {ROWS.map((row, ri) => (
            <motion.div
              key={row.label}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: ri * 0.04 }}
              className="p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">{row.label}</p>

              {/* Winner — the line that matters */}
              <div className="mt-2 flex items-center gap-2">
                <VerdictIcon verdict={row.cells[0].verdict} />
                <span className="text-[15px] font-medium text-foreground">{row.cells[0].note}</span>
                <span
                  className="ml-auto shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]"
                  style={{
                    color: "var(--features-blue)",
                    borderColor: "color-mix(in srgb, var(--features-blue) 30%, transparent)",
                    background: "color-mix(in srgb, var(--features-blue) 10%, transparent)",
                  }}
                >
                  {COLUMNS[0]}
                </span>
              </div>

              {/* The two alternatives, condensed to one reference line */}
              <div className="mt-2 flex flex-col gap-1 border-t border-border/60 pt-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-muted-foreground/70">
                    <VerdictIcon verdict={row.cells[i].verdict} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
                      {COLUMNS[i]}
                    </span>
                    <span className="truncate">{row.cells[i].note}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---------- lg+ : the real table ---------- */}
        <div className="relative hidden pt-5 lg:block">
          {/* Cap over the winner column. Sits on known geometry — the table is
              `table-fixed` with the widths in COL_W. */}
          <div
            className="pointer-events-none absolute top-0 z-20 flex justify-center"
            style={{ left: WINNER_LEFT, width: WINNER_W }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] shadow-lg shadow-black/40 backdrop-blur-sm"
              style={{
                color: "var(--features-blue)",
                borderColor: "color-mix(in srgb, var(--features-blue) 45%, transparent)",
                // Navy removed from this badge fill — it's the one place in
                // the file that still referenced --features-navy. Solid
                // black underneath the same blue-tinted top edge keeps the
                // badge readable without introducing a navy cast.
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--features-blue) 22%, transparent), color-mix(in srgb, black 70%, transparent))",
              }}
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              Best fit
            </span>
          </div>

          <ScrollReveal>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/30 shadow-xl shadow-black/30">
              {/* Faint glow behind the winner column — enough to draw the eye
                  without turning the column into a solid blue block. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 z-0 blur-2xl"
                style={{
                  left: WINNER_LEFT,
                  width: WINNER_W,
                  background: "color-mix(in srgb, var(--features-blue) 8%, transparent)",
                }}
              />

              <table className="relative w-full table-fixed border-collapse text-left">
                <colgroup>
                  {COL_W.map((w, i) => (
                    <col key={i} style={{ width: w }} />
                  ))}
                </colgroup>

                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70"
                    >
                      Capability
                    </th>
                    {COLUMNS.map((c, i) => (
                      <th
                        key={c}
                        scope="col"
                        className={`relative px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] ${
                          i === 0 ? "text-foreground" : "text-muted-foreground/70"
                        }`}
                        style={
                          i === 0
                            ? {
                                // Only the header carries a light tint — it's
                                // where the column is named, so that's where the
                                // marking belongs. Body cells below stay clear.
                                background: "color-mix(in srgb, var(--features-blue) 12%, transparent)",
                                boxShadow:
                                  "inset 1px 0 0 color-mix(in srgb, var(--features-blue) 28%, transparent), inset -1px 0 0 color-mix(in srgb, var(--features-blue) 28%, transparent), inset 0 1px 0 color-mix(in srgb, var(--features-blue) 40%, transparent)",
                              }
                            : undefined
                        }
                      >
                        {i === 0 ? (
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="pulse-ring relative h-1.5 w-1.5 rounded-full"
                              style={{ color: "var(--features-blue)", background: "var(--features-blue)" }}
                            />
                            {c}
                          </span>
                        ) : (
                          c
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {ROWS.map((row, ri) => (
                    <motion.tr
                      key={row.label}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: ri * 0.07 }}
                      className="group border-b border-border transition-colors duration-300 last:border-0 hover:bg-white/[0.03]"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-sm font-medium text-foreground transition-colors duration-300"
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="h-4 w-px shrink-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{ background: "var(--features-blue)" }}
                          />
                          {row.label}
                        </span>
                      </th>

                      {row.cells.map((cell, i) => {
                        const isWinner = i === 0
                        const isLast = ri === ROWS.length - 1
                        return (
                          <td
                            key={i}
                            className="px-5 py-4 align-top"
                            style={
                              isWinner
                                ? {
                                    // No fill on the body cells — the column is
                                    // framed by two thin blue side-lines and the
                                    // header tint, so it reads as "the one to
                                    // look at" without being a painted block.
                                    boxShadow: `inset 1px 0 0 color-mix(in srgb, var(--features-blue) 28%, transparent), inset -1px 0 0 color-mix(in srgb, var(--features-blue) 28%, transparent)${
                                      isLast
                                        ? ", inset 0 -1px 0 color-mix(in srgb, var(--features-blue) 40%, transparent)"
                                        : ""
                                    }`,
                                  }
                                : undefined
                            }
                          >
                            <span className="flex items-start gap-2.5">
                              <VerdictIcon verdict={cell.verdict} />
                              <span
                                className={`text-sm ${
                                  isWinner ? "font-medium text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {cell.note}
                              </span>
                            </span>
                          </td>
                        )
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>

        {/* ---------- Payoff strip ---------- */}
        <ScrollReveal className="mt-6">
          <div className="rounded-2xl border border-border bg-card/30 px-4 py-4 shadow-lg shadow-black/20">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {COLUMNS.map((c, i) => (
                <ScoreStat key={c} value={SCORES[i]} label={`${c} — clean wins`} tint={SCORE_TINT[i]} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Icon key + the honesty note */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {(
              [
                ["yes", "Handled"],
                ["partial", "Partly / with work"],
                ["no", "Not really"],
              ] as [Verdict, string][]
            ).map(([v, label]) => (
              <span key={v} className="inline-flex items-center gap-1.5">
                <VerdictIcon verdict={v} animated={false} />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {label}
                </span>
              </span>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground/70">
            Comparison reflects typical deployments; your mileage varies with carrier, region, and call complexity.
          </p>
        </div>
      </div>
    </section>
  )
}
