"use client"

import Link from "next/link"
import type { ElementType } from "react"
import { ArrowRight, ArrowUpRight, BookOpen, CircleQuestionMark, Layers, PhoneCall, Receipt } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Magnetic, SpotlightPanel } from "@/components/animation/magnetic"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * The closing pair for /features: the conversion panel, then the internal
 * links out.
 *
 * These live here rather than using the site-wide <RelatedLinks/> because
 * that component is still on the legacy styling (semibold sans headings, red
 * `--primary` accents) and is rendered by every other landing page. Restyling
 * it in place would silently change six pages that haven't been migrated to
 * the brand reference yet, so /features gets its own version and the shared
 * one is left alone. Same markup shape and same outbound links, so the
 * internal-linking value is unchanged.
 */

const BULLETS = [
  { label: "No credit card required", tint: "var(--features-blue)" },
  { label: "Cancel anytime", tint: "var(--features-blue-deep)" },
  { label: "Live in an afternoon", tint: "var(--features-green)" },
]

/**
 * Icons are resolved here from a string key rather than passed in as
 * components. /features/page.tsx is a Server Component and this file is a
 * Client Component, so a prop holding a component reference would have to
 * cross that boundary — and React can't serialize a function. A plain string
 * crosses fine and the lookup happens on the client.
 */
const LINK_ICONS = {
  pricing: Receipt,
  industries: Layers,
  faq: CircleQuestionMark,
  docs: BookOpen,
} satisfies Record<string, ElementType>

export type FeatureLink = {
  href: string
  title: string
  description: string
  /** Optional — cards fall back to a numbered tile when omitted. */
  icon?: keyof typeof LINK_ICONS
}

/**
 * Accent per destination, cycled by position. Three cards, three brand tints:
 * a single blue repeated three times made the row read as one block of
 * identical things rather than three separate places to go.
 */
const LINK_TINTS = ["var(--features-blue)", "var(--features-green)", "var(--features-amber)"]

/* ---------------------------------------------------------------------- */

/** Idle waveform — decorative, so it never announces itself. */
function Waveform({ reduced }: { reduced: boolean | null }) {
  const bars = [0.35, 0.7, 1, 0.55, 0.85, 0.4, 0.95, 0.6, 0.3]
  return (
    <span aria-hidden className="flex h-8 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className={reduced ? "w-[3px] rounded-full" : "voice-bar w-[3px] rounded-full"}
          style={{
            height: `${h * 100}%`,
            background: `linear-gradient(180deg, var(--features-blue), var(--features-blue-deep))`,
            animationDelay: `${i * 0.11}s`,
            animationDuration: `${1 + (i % 3) * 0.22}s`,
          }}
        />
      ))}
    </span>
  )
}

export function FeatureCta() {
  const reduced = useReducedMotion()

  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-border py-16 md:py-24"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div
        aria-hidden
        className="drift-blob pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-50 blur-[100px]"
        style={{ background: "color-mix(in srgb, var(--features-blue) 40%, transparent)" }}
      />
      <div
        aria-hidden
        className="drift-blob pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full opacity-40 blur-[120px]"
        style={{ background: "color-mix(in srgb, var(--features-blue-deep) 38%, transparent)", animationDelay: "-9s" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          {/* p-px + a rotating conic underneath = a 1px border that travels
              around the panel. The conic has to be far larger than the panel
              and clipped by it, or its corners swing outside as it turns. */}
          <div className="relative overflow-hidden rounded-3xl p-px">
            {!reduced && (
              <span
                aria-hidden
                className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, var(--features-blue) 40deg, transparent 100deg, transparent 200deg, var(--features-blue-deep) 250deg, transparent 310deg)",
                  opacity: 0.7,
                }}
              />
            )}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl border border-border"
            />

            <SpotlightPanel
              glow="var(--features-blue)"
              size={520}
              className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-card/80 px-5 py-10 backdrop-blur-xl sm:px-8 md:px-12 md:py-14"
            >
              {/* Engineering grid + a slow specular pass over the glass */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.4]"
                style={{
                  backgroundImage:
                    "linear-gradient(color-mix(in srgb, var(--features-blue) 7%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--features-blue) 7%, transparent) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                  maskImage: "radial-gradient(120% 100% at 50% 0%, #000, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(120% 100% at 50% 0%, #000, transparent 75%)",
                }}
              />
              {!reduced && (
                <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span
                    className="sheen-sweep absolute inset-y-0 w-1/3"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, color-mix(in srgb, var(--features-blue) 10%, transparent), transparent)",
                    }}
                  />
                </span>
              )}

              {/* Splits at lg, not md: at 768px the copy and the button stack
                  side by side squeeze the CTA row to near its min-content. */}
              <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <span className="ai-pill-blue">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    Try it live
                  </span>

                  <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
                    Ready to hear it for yourself?
                  </h2>

                  <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">
                    Spin up an agent in minutes and place a real test call — no credit card to try.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {BULLETS.map((b, i) => (
                      <motion.span
                        key={b.label}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.tint }} />
                        {b.label}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-5 sm:w-auto">
                  {/* Live-call chip — gives the panel something with a pulse in
                      it, so the CTA doesn't read as a static footer band. */}
                  <div className="flex items-center gap-3 self-start rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur-sm sm:self-end">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ background: "color-mix(in srgb, var(--features-blue) 18%, transparent)" }}
                    >
                      <PhoneCall className="h-4 w-4" style={{ color: "var(--features-blue)" }} aria-hidden />
                    </span>
                    <Waveform reduced={reduced} />
                    <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.16em] text-muted-foreground/70">
                      Agent
                      <br />
                      listening
                    </span>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
                    <Magnetic strength={0.28} className="w-full sm:w-auto">
                      <Link
                        href="/get-started"
                        className="btn-ai inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[filter,box-shadow] duration-300 sm:w-auto"
                      >
                        Get started
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </Magnetic>

                    <Magnetic strength={0.22} className="w-full sm:w-auto">
                      <Link
                        href="/pricing"
                        className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-foreground transition-colors duration-300 hover:border-white/40 hover:bg-white/10 sm:w-auto"
                      >
                        View pricing
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </SpotlightPanel>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------- */

export function FeatureRelated({
  heading,
  description,
  links,
}: {
  heading: string
  description: string
  links: FeatureLink[]
}) {
  const reduced = useReducedMotion()

  return (
    <section
      aria-labelledby="related-heading"
      className="features-hero-dark relative overflow-hidden border-t border-border py-16 md:py-20"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Header runs the full width with a rule bridging to a count on the
            right. The old version left the entire right half of the row empty,
            which is what made the section read as an afterthought. */}
        <ScrollReveal className="mb-8 md:mb-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="ai-pill-blue">
              <span className="h-1 w-1 rounded-full bg-current" />
              Next
            </span>
            <h2
              id="related-heading"
              className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-foreground md:text-3xl"
            >
              {heading}
            </h2>
            <p className="mt-3 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* Count flanked by two rules that draw outward from the middle —
                the centred equivalent of the single rule this used to have
                running off to the right. */}
            <div aria-hidden className="mt-6 hidden items-center justify-center gap-4 md:flex">
              <motion.span
                className="block h-px w-20 origin-right"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in srgb, var(--features-blue) 55%, transparent))",
                }}
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
                {String(links.length).padStart(2, "0")} destinations
              </span>
              <motion.span
                className="block h-px w-20 origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, color-mix(in srgb, var(--features-blue) 55%, transparent), transparent)",
                }}
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </ScrollReveal>

        <ul className="grid gap-4 md:grid-cols-3">
          {links.map((l, i) => {
            const tint = LINK_TINTS[i % LINK_TINTS.length]
            const Icon = l.icon ? LINK_ICONS[l.icon] : undefined
            return (
            <motion.li
              key={l.href}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
              className="h-full"
            >
              {/* The panel carries the surface, not the <a>. A card background
                  painted on the link would sit above the spotlight overlay and
                  mute it — this way the glow renders over the surface and under
                  the text. */}
              <SpotlightPanel
                glow={tint}
                size={340}
                // `translate`, not `transform`: Tailwind v4 compiles
                // -translate-y-* to the standalone `translate` property, so a
                // transition list naming `transform` never covers it and the
                // lift snaps instead of easing.
                className="h-full overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-[translate,border-color] duration-300 hover:-translate-y-1.5 hover:border-white/25"
              >
                {/* Top hairline that fills in from the left on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 transition-transform duration-500 group-hover/spot:scale-x-100"
                  style={{
                    background: `linear-gradient(90deg, ${tint}, color-mix(in srgb, ${tint} 10%, transparent))`,
                  }}
                />

                {/* Oversized index sunk into the corner as texture, not content */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-5 select-none font-heading text-[5.5rem] font-medium leading-none tracking-[-0.05em] opacity-[0.06] transition-opacity duration-500 group-hover/spot:opacity-[0.13]"
                  style={{ color: tint }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <Link href={l.href} className="relative flex h-full flex-col gap-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/spot:-rotate-6 group-hover/spot:scale-105"
                      style={{
                        background: `color-mix(in srgb, ${tint} 16%, transparent)`,
                        borderColor: `color-mix(in srgb, ${tint} 32%, transparent)`,
                        color: tint,
                      }}
                    >
                      {Icon ? (
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      ) : (
                        <span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="font-heading text-[17px] font-medium leading-snug tracking-[-0.02em] text-foreground">
                      {l.title}
                    </p>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-muted-foreground">
                      {l.description}
                    </p>
                  </div>

                  {/* Footer rule + arrow disc. The disc fills with the card's
                      accent on hover, which gives the whole card one obvious
                      affordance instead of a small blue text link. */}
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <span
                      className="text-xs font-medium transition-colors duration-300"
                      style={{ color: tint }}
                    >
                      Read more
                    </span>
                    <span
                      aria-hidden
                      className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border transition-colors duration-300"
                      style={{ borderColor: `color-mix(in srgb, ${tint} 34%, transparent)`, color: tint }}
                    >
                      <span
                        className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-300 ease-out group-hover/spot:scale-y-100"
                        style={{ background: `color-mix(in srgb, ${tint} 22%, transparent)` }}
                      />
                      <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </SpotlightPanel>
            </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
