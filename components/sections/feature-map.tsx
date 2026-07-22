"use client"

/**
 * RETIRED — no longer imported anywhere (2026-07-22, same day it was added).
 * User called it redundant: FeatureShowcase already surfaces all 12
 * capabilities, so a second "map" of the same 12 added nothing. Left in place
 * only because this session's tools can't delete a file; safe to remove
 * entirely, along with feature-integrations.tsx (also retired, same reason).
 */

import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import {
  AudioLines,
  Hand,
  Mic,
  Languages,
  PhoneCall,
  Repeat,
  Wrench,
  CalendarClock,
  Webhook,
  Activity,
  ShieldCheck,
  Network,
  ChevronRight,
} from "lucide-react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureMap
 * A full, scannable map of every capability — grouped the way a buyer
 * actually thinks about them (what it sounds like, how it plugs into a phone
 * line, what it talks to, how you keep it running), not a flat wall of 12
 * equal tiles.
 *
 * Replaces the old FeatureIntegrations "live connections" rails. That section
 * only ever showed the connector layer; this one is the whole surface area of
 * the product, with the connectors folded in as one category among four
 * rather than a section of their own. Same 12 capabilities as FeatureShowcase
 * above (deliberately — one source of truth for what the product does), just
 * presented as an overview map instead of a one-at-a-time explorer.
 *
 * Left rail is a scroll-spy nav, sticky on desktop, that tracks which group is
 * in view — an index into the page, not a second interaction model.
 */

type CategoryKey = "voice" | "telephony" | "integrations" | "operations"

type Item = { icon: ElementType; title: string; blurb: string }

type Category = {
  key: CategoryKey
  label: string
  description: string
  accent: string
  items: Item[]
}

const CATEGORIES: Category[] = [
  {
    key: "voice",
    label: "Voice",
    description: "What the caller actually hears — latency, turn-taking, clarity, language.",
    accent: "var(--features-blue)",
    items: [
      { icon: AudioLines, title: "Sub-300ms latency", blurb: "Conversations feel instant, never delayed." },
      { icon: Hand, title: "Natural turn-taking", blurb: "Listens, pauses, and responds like a person." },
      { icon: Mic, title: "Background noise removal", blurb: "Busy street, café, or car — still clear." },
      { icon: Languages, title: "Multilingual voices", blurb: "Dozens of languages and accents." },
    ],
  },
  {
    key: "telephony",
    label: "Telephony",
    description: "The phone line itself — carriers, numbers, and handing off mid-call.",
    accent: "var(--features-blue-deep)",
    items: [
      { icon: PhoneCall, title: "Carrier-grade telephony", blurb: "Inbound and outbound PSTN over SIP." },
      { icon: Repeat, title: "Live transfer & handoff", blurb: "Warm-transfer without repeating the customer." },
    ],
  },
  {
    key: "integrations",
    label: "Integrations",
    description: "What it reads from and writes back to — your APIs, calendar, and stack.",
    accent: "var(--features-green)",
    items: [
      { icon: Wrench, title: "Tools & function calling", blurb: "Your agent uses the same APIs your team does." },
      { icon: CalendarClock, title: "Scheduling & calendars", blurb: "Book, reschedule, and confirm over voice." },
      { icon: Webhook, title: "Webhooks & APIs", blurb: "Pipe call data into your stack in real time." },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    description: "How you monitor and trust it once it's live — records, compliance, scale.",
    accent: "var(--features-amber)",
    items: [
      { icon: Activity, title: "Live transcripts & analytics", blurb: "Searchable from day one." },
      { icon: ShieldCheck, title: "Recording, redaction & compliance", blurb: "Configurable PII handling out of the box." },
      { icon: Network, title: "Massive concurrency", blurb: "One call or thousands, no provisioning." },
    ],
  },
]

/** Folded in from the retired FeatureIntegrations rails — same connectors,
    a static line instead of a moving belt, grouped under the one category
    they actually belong to. */
const CONNECTORS = [
  "Salesforce", "HubSpot", "Zendesk", "Intercom", "Pipedrive", "Gong",
  "Google Calendar", "Outlook", "Calendly", "Slack",
  "Twilio", "Telnyx", "Vonage", "Stripe", "Zapier",
  "Segment", "Snowflake", "BigQuery", "Postgres",
]

const TOTAL_ITEMS = CATEGORIES.reduce((n, c) => n + c.items.length, 0)

export function FeatureMap() {
  const [active, setActive] = useState<CategoryKey>("voice")
  const sectionRefs = useRef<Partial<Record<CategoryKey, HTMLDivElement | null>>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport among those
        // currently intersecting — a plain "first intersecting" pick flickers
        // between two adjacent groups when both are partially on screen.
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
        const key = (top.target as HTMLElement).dataset.category as CategoryKey | undefined
        if (key) setActive(key)
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    )

    for (const cat of CATEGORIES) {
      const el = sectionRefs.current[cat.key]
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  const scrollTo = (key: CategoryKey) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-border"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-16">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="ai-pill-blue">
            <span className="h-1 w-1 rounded-full bg-current" />
            Everything, mapped
          </span>
          <h2 className="mt-5 text-balance font-heading text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
            The full surface area, grouped the way you&apos;ll actually use it.
          </h2>
          <p className="mt-4 text-pretty text-[15px] font-light leading-relaxed text-muted-foreground">
            {TOTAL_ITEMS} capabilities across four groups — how it sounds, how it answers the phone, what it plugs
            into, and how you keep it accountable.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_1fr]">
            {/* ---------- NAV ---------- */}
            <nav
              aria-label="Feature categories"
              className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:sticky lg:top-24 lg:mx-0 lg:h-fit lg:snap-none lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {CATEGORIES.map((cat) => {
                const isActive = active === cat.key
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => scrollTo(cat.key)}
                    className="group relative flex shrink-0 snap-start items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-300 lg:w-full lg:border-0 lg:px-3 lg:py-2"
                    style={{
                      borderColor: isActive ? "color-mix(in srgb, var(--features-blue) 35%, transparent)" : "var(--border)",
                      background: isActive ? "color-mix(in srgb, var(--features-blue) 8%, transparent)" : "transparent",
                    }}
                  >
                    <span
                      aria-hidden
                      className={`hidden h-5 w-[2px] shrink-0 rounded-full transition-[scale,opacity] duration-300 lg:block ${
                        isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                      }`}
                      style={{ background: cat.accent }}
                    />
                    <span
                      className={`font-heading text-sm font-medium tracking-[-0.01em] transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/50">
                      {cat.items.length}
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* ---------- CONTENT ---------- */}
            <div className="flex flex-col gap-8 md:gap-10">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  data-category={cat.key}
                  ref={(el) => {
                    sectionRefs.current[cat.key] = el
                  }}
                  className="scroll-mt-24"
                >
                  <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
                    <span
                      className="font-heading text-base font-medium tracking-[-0.015em]"
                      style={{ color: cat.accent }}
                    >
                      {cat.label}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                      {cat.items.length} {cat.items.length === 1 ? "feature" : "features"}
                    </span>
                  </div>
                  <p className="mb-4 text-sm font-light leading-relaxed text-muted-foreground">{cat.description}</p>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {cat.items.map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.title}
                          className="group flex items-start gap-3 rounded-xl border border-border bg-card/30 px-3.5 py-3 transition-colors duration-300 hover:bg-card/40"
                        >
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                            style={{
                              background: `color-mix(in srgb, ${cat.accent} 14%, transparent)`,
                              borderColor: `color-mix(in srgb, ${cat.accent} 32%, transparent)`,
                              color: cat.accent,
                            }}
                          >
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-snug text-foreground">
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-xs font-light leading-snug text-muted-foreground">
                              {item.blurb}
                            </span>
                          </span>
                          <ChevronRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Integrations only: the actual connector roster, folded in
                      from the retired rails section rather than dropped. */}
                  {cat.key === "integrations" && (
                    <div className="mt-4 rounded-xl border border-border bg-card/30 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                        Connects with {CONNECTORS.length}+ tools out of the box
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {CONNECTORS.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
