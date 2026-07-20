"use client"

import { ScrollReveal } from "@/components/animation/scroll-reveal"

/**
 * FeatureIntegrations
 * Infinite marquee of the systems an agent typically writes back to.
 * Uses the shared `.marquee` keyframe from globals.css, which translates
 * the track by -50% — so the list is rendered twice, back to back, to
 * make the loop seamless. The duplicate is aria-hidden so screen readers
 * only hear the list once.
 */

const ROW_ONE = [
  "Salesforce",
  "HubSpot",
  "Google Calendar",
  "Outlook",
  "Calendly",
  "Zendesk",
  "Intercom",
  "Slack",
]

const ROW_TWO = [
  "Twilio",
  "Telnyx",
  "Vonage",
  "Stripe",
  "Zapier",
  "Segment",
  "Snowflake",
  "Webhooks",
]

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="relative flex overflow-hidden">
      <div
        className="marquee flex shrink-0 items-center gap-3 pr-3"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {[...items, ...items].map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= items.length}
            className="shrink-0 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-slate-300 backdrop-blur-sm"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function FeatureIntegrations() {
  return (
    <section
      className="features-hero-dark relative overflow-hidden border-t border-white/10"
      style={{ background: "var(--features-hero-bg)" }}
    >
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-serif font-normal leading-tight tracking-tight text-white md:text-3xl">
            Plugs into the stack you already run.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-400 md:text-base">
            Your agent calls the same APIs your team does — over native integrations, webhooks, or any HTTP endpoint
            you point it at.
          </p>
        </ScrollReveal>

        {/* Edge fade so chips dissolve instead of clipping at the bounds */}
        <div className="relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="space-y-3">
            <Row items={ROW_ONE} />
            <Row items={ROW_TWO} reverse />
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don't see yours? Anything with an API works — point a tool call at it.
        </p>
      </div>
    </section>
  )
}
