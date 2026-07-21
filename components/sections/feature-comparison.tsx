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
      <div
        aria-hidden
        className="drift-blob pointer-events-none absolute bottom-0 left-0 h-[28rem] w-[28rem] -translate-x-1/3 rounded-full opacity-50 blur-[130px]"
        style={{ background: "color-mix(in srgb, var(--features-blue) 28%, transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
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

        {/* ---------- Small screens: one card per capability ---------- */}
        {/* Cards hold until lg. At md the four-column table gives each note
            cell ~106px — about fifteen characters a line — so every one of the
            eighteen cells ladders. */}
        <div className="space-y-2.5 lg:hidden">
          {ROWS.map((row, ri) => (
            <motion.div
              key={row.label}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: ri * 0.05 }}
              className="rounded-2xl border border-border bg-card/50 p-4 shadow-lg shadow-black/20 sm:p-5"
            >
              <h3 className="font-heading text-sm font-medium tracking-[-0.01em] text-foreground">{row.label}</h3>
              {/* Tighter than the desktop rhythm on purpose: six of these
                  stacked ran ~2,300px on a phone, and the padding was doing
                  most of it. */}
              <dl className="mt-3 space-y-1.5">
                {row.cells.map((cell, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start gap-1 rounded-xl px-3 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                    style={
                      i === 0
                        ? {
                            background: "color-mix(in srgb, var(--features-blue) 12%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--features-blue) 26%, transparent)",
                          }
                        : undefined
                    }
                  >
                    {/* The winner's label carries the accent colour and a
                        marker dot. On a phone the three options are stacked
                        rather than sitting in a highlighted column, so the
                        tinted panel alone wasn't enough to say which one is
                        ours at a glance. */}
                    <dt
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        i === 0 ? "font-medium" : "text-muted-foreground/70"
                      }`}
                      style={i === 0 ? { color: "var(--features-blue)" } : undefined}
                    >
                      {i === 0 && (
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full"
                          style={{ background: "var(--features-blue)" }}
                        />
                      )}
                      {COLUMNS[i]}
                    </dt>
                    {/* Icon leads and the note runs left-aligned on phones —
                        right-aligning it against the label in a 222px row left
                        the note ~111px, roughly sixteen characters a line. */}
                    <dd className="flex min-w-0 items-start gap-2 sm:justify-end sm:text-right">
                      <VerdictIcon verdict={cell.verdict} />
                      <span
                        className={`text-sm ${i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                      >
                        {cell.note}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
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
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--features-blue) 22%, transparent), color-mix(in srgb, var(--features-navy) 70%, transparent))",
              }}
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              Best fit
            </span>
          </div>

          <ScrollReveal>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 shadow-xl shadow-black/30">
              {/* Glow behind the winner column */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 z-0 blur-2xl"
                style={{
                  left: WINNER_LEFT,
                  width: WINNER_W,
                  background: "color-mix(in srgb, var(--features-blue) 18%, transparent)",
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
                                background:
                                  "linear-gradient(180deg, color-mix(in srgb, var(--features-blue) 22%, transparent), color-mix(in srgb, var(--features-blue) 10%, transparent))",
                                boxShadow: "inset 1px 0 0 color-mix(in srgb, var(--features-blue) 35%, transparent), inset -1px 0 0 color-mix(in srgb, var(--features-blue) 35%, transparent), inset 0 1px 0 color-mix(in srgb, var(--features-blue) 45%, transparent)",
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
                                    background: "color-mix(in srgb, var(--features-blue) 9%, transparent)",
                                    boxShadow: `inset 1px 0 0 color-mix(in srgb, var(--features-blue) 35%, transparent), inset -1px 0 0 color-mix(in srgb, var(--features-blue) 35%, transparent)${
                                      isLast
                                        ? ", inset 0 -1px 0 color-mix(in srgb, var(--features-blue) 45%, transparent)"
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
          <div className="rounded-2xl border border-border bg-card/50 px-4 py-4 shadow-lg shadow-black/20">
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
