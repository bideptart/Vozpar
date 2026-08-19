"use client"

import Link from "next/link"
import { ArrowUpRight, Check, Database, Lock, PhoneForwarded, ShieldCheck } from "lucide-react"
import type { ElementType } from "react"
import { motion, useReducedMotion } from "@/lib/motion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { SpotlightPanel } from "@/components/animation/magnetic"

/**
 * FeatureTrust
 * The section a technical buyer scrolls looking for, and the one the rest of
 * the page was missing: what is actually committed to in writing.
 *
 * Every figure and every claim here is lifted from this site's own legal
 * pages — /sla, /dpa, /subprocessors, /e911, /ai-disclosure — and each card
 * links to the primary document behind it. Nothing is asserted that a reader
 * can't go verify, which is the entire point: the surrounding sections make
 * performance claims, this one makes checkable ones.
 *
 * Two things this section deliberately does NOT say, because the legal pages
 * don't support them: that PII redaction is customer-configurable (only
 * retention is, per /dpa §2), and that we handle consent or notice on the
 * customer's behalf (/dpa §5 and /ai-disclosure both put those duties on the
 * customer — the platform supplies a configurable disclosure, not the legal
 * obligation). The product pages elsewhere may pitch those harder; this
 * section is the one that has to survive being read next to the contract.
 *
 * If the legal pages change, THIS SECTION HAS TO CHANGE WITH THEM. The
 * headline risk is the uptime figure: /sla commits to 99.9% monthly and
 * writes its credit schedule against that number, so marketing a tighter one
 * anywhere on the site creates a contradiction procurement will find.
 */

/** Pulled from /sla §1, §2 and /subprocessors intro. */
const COMMITMENTS = [
  { value: "99.9%", label: "Monthly uptime commitment", tint: "var(--features-blue)" },
  { value: "1 hr", label: "P1 first response, 24×7", tint: "var(--features-green)" },
  { value: "14 days", label: "Notice before a sub-processor changes", tint: "var(--features-amber)" },
]

type Card = {
  icon: ElementType
  title: string
  lines: string[]
  href: string
  hrefLabel: string
  tint: string
}

const CARDS: Card[] = [
  {
    icon: ShieldCheck,
    title: "Uptime you can hold us to",
    lines: [
      "99.9% monthly uptime commitment, measured as (total minutes − downtime) ÷ total minutes.",
      "Miss it and service credits are 10%, 25% or 50% of the monthly fee, banded by how far short the month fell.",
      "P1 — platform down or agents not answering — targets a first response inside 1 hour, 24×7.",
    ],
    href: "/sla",
    hrefLabel: "Read the SLA",
    tint: "var(--features-blue)",
  },
  {
    icon: Lock,
    title: "Written terms on your data",
    lines: [
      "Recordings and transcripts are processed under the DPA, with retention set per your configuration and applicable law.",
      "Cross-border transfers run on EU SCCs / UK IDTA where relevant.",
      "You stay the controller; processing follows your documented instructions.",
    ],
    href: "/dpa",
    hrefLabel: "Read the DPA",
    tint: "var(--features-green)",
  },
  {
    icon: Database,
    title: "Who actually touches a call",
    lines: [
      "Named in writing: Vercel for hosting and edge, Supabase for account data, recordings and transcripts, Stripe for billing.",
      "Model providers are bound not to train on your data; the ASR, LLM and TTS vendors are confirmed on request.",
      "At least 14 days' notice before any new sub-processor handles customer personal data.",
    ],
    href: "/subprocessors",
    hrefLabel: "See the sub-processor list",
    tint: "var(--features-blue-deep)",
  },
  {
    icon: PhoneForwarded,
    title: "Your carrier stays yours",
    lines: [
      "Bring your own SIP: the numbers and the carrier charges stay on your account, under your carrier's terms.",
      "E911 obligations are acknowledged at activation, before a number carries live traffic.",
      "A configurable opening AI disclosure ships with the platform — though the consent and notice duties themselves stay yours, and both policies spell out which.",
    ],
    href: "/e911",
    hrefLabel: "E911 & disclosure",
    tint: "var(--features-amber)",
  },
]

export function FeatureTrust() {
  const reduced = useReducedMotion()

  return (
    <section
      className="features-hero-dark relative isolate overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      {/* Ambient glow removed — flat black canvas per the /features theme. */}

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Trust &amp; operations
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            The part procurement asks about.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            Everything below is committed in writing and linked to the document it comes from — so you can check it
            rather than take our word for it.
          </p>
        </ScrollReveal>

        {/* Commitment strip — the three numbers worth remembering */}
        <ScrollReveal className="mb-6 md:mb-8">
          <div className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card/30 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {COMMITMENTS.map((c, i) => (
              <motion.div
                key={c.label}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="px-5 py-6 text-center"
              >
                <p
                  className="font-heading text-2xl font-medium tabular-nums tracking-[-0.025em] sm:text-3xl"
                  style={{ color: c.tint }}
                >
                  {c.value}
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-muted-foreground/70">
                  {c.label}
                </p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Four claims in one row from lg — a 2×2 block ran nearly the full
            height of the viewport on its own, so the four sit side by side on
            wide screens and fall to 2×2 only at md and below. */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                {/* Surface sits on the panel, not the link, so the spotlight
                    renders over it instead of being muted by a card
                    background painted on top. */}
                <SpotlightPanel
                  glow={card.tint}
                  size={360}
                  className="h-full overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-sm transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-white/25"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 transition-transform duration-500 group-hover/spot:scale-x-100"
                    style={{
                      background: `linear-gradient(90deg, ${card.tint}, color-mix(in srgb, ${card.tint} 10%, transparent))`,
                    }}
                  />

                  <div className="relative flex h-full flex-col p-5">
                    <div className="flex items-start gap-3 border-b border-border pb-3.5">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/spot:-rotate-6 group-hover/spot:scale-105"
                        style={{
                          background: `color-mix(in srgb, ${card.tint} 16%, transparent)`,
                          borderColor: `color-mix(in srgb, ${card.tint} 32%, transparent)`,
                          color: card.tint,
                        }}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="font-heading text-[15px] font-medium leading-snug tracking-[-0.02em] text-foreground">
                        {card.title}
                      </h3>
                    </div>

                    {/* Ticks rather than dots. Every line here is something
                        committed in writing, and a check reads as exactly that
                        where a bullet reads as "assorted notes". */}
                    <ul className="mt-3.5 flex-1 space-y-2.5">
                      {card.lines.map((line) => (
                        <li key={line} className="flex gap-2">
                          <Check
                            aria-hidden
                            className="mt-[0.15em] h-3 w-3 shrink-0"
                            style={{ color: card.tint }}
                          />
                          <span className="text-[12.5px] font-light leading-relaxed text-muted-foreground">{line}</span>
                        </li>
                      ))}
                    </ul>

                    {/* A bordered pill, not a bare text link. These are the
                        only routes from this page to the SLA and the DPA — the
                        documents the whole section is asking to be checked
                        against — and as 12px underlined text they read as a
                        footnote. The border also carries the 44px hit area
                        without needing negative margins to sit flush. */}
                    <Link
                      href={card.href}
                      className="mt-4 inline-flex min-h-10 w-fit items-center gap-2 rounded-full border px-3.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-300"
                      style={{
                        color: card.tint,
                        borderColor: `color-mix(in srgb, ${card.tint} 32%, transparent)`,
                        background: `color-mix(in srgb, ${card.tint} 8%, transparent)`,
                      }}
                    >
                      {card.hrefLabel}
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-300 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </SpotlightPanel>
              </motion.div>
            )
          })}
        </div>

        {/* Entity strip. Routed to /contact rather than the support mailbox:
            that address is on the 9278.ai domain, and this page is branded
            Vozpar — printing the other name here is the kind of mismatch a
            procurement reader notices in a section about trust. The contact
            page reaches the same team without asserting a second identity. */}
        <ScrollReveal className="mt-8">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card/30 px-5 py-5 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs font-light leading-relaxed text-muted-foreground/70">
              Operated by Ace Peak Invest Pte Ltd, 1 Scotts Road, #24-10, Shaw Centre, Singapore 228208.
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:border-white/30 hover:text-foreground"
            >
              Service credits &amp; security questions
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
