import "server-only"
import { INDUSTRIES } from "@/lib/industries"
import { SITE, absoluteUrl } from "@/lib/seo"

export type SeoEntry = {
  path: string
  title: string
  description: string
  canonical: string
  indexable: boolean
  /** Section the page belongs to — used for grouping in the dashboard. */
  group: "Marketing" | "Industry" | "Funnel" | "Internal"
}

export type AuditWarning = {
  level: "error" | "warn" | "info"
  msg: string
}

export type AuditedPage = SeoEntry & {
  warnings: AuditWarning[]
  titleLength: number
  descLength: number
}

const TITLE_MIN = 25
const TITLE_MAX = 60
const DESC_MIN = 80
const DESC_MAX = 160

/**
 * Single source of truth for what the marketing site claims to be indexable.
 * The actual `metadata` exports on each page are still authoritative; this
 * registry mirrors them so the dashboard has something to lint against.
 *
 * If a page changes its title/description, update it here too.
 */
export function getRegistry(): SeoEntry[] {
  const industries: SeoEntry[] = INDUSTRIES.map((i) => ({
    path: `/industries/${i.slug}`,
    title: `${i.name} AI voice agents`,
    description:
      i.pitch ??
      `${i.name} teams use 9278.ai to handle inbound calls, qualify leads, and book appointments around the clock.`,
    canonical: absoluteUrl(`/industries/${i.slug}`),
    indexable: true,
    group: "Industry",
  }))

  const marketing: SeoEntry[] = [
    {
      path: "/",
      title: `${SITE.name} — AI voice agents that actually sound human`,
      description: SITE.description,
      canonical: absoluteUrl("/"),
      indexable: true,
      group: "Marketing",
    },
    {
      path: "/pricing",
      title: "Pricing — voice AI from $0.10/min",
      description:
        "Simple, transparent pricing. Voice from $0.10/min. Top up with $20, $50, or $100 to unlock 1, 2, or 3 AI voice agents. Phone numbers from $2/month.",
      canonical: absoluteUrl("/pricing"),
      indexable: true,
      group: "Marketing",
    },
    {
      path: "/industries",
      title: "Industries we power",
      description:
        "Pre-tuned AI voice agents for real estate, dental, healthcare, home services, restaurants, automotive, legal, education, e-commerce, and fitness — live in under 5 minutes.",
      canonical: absoluteUrl("/industries"),
      indexable: true,
      group: "Marketing",
    },
    {
      path: "/faq",
      title: "Frequently asked questions",
      description:
        "Answers on pricing, voice credit expiry, phone numbers, AI agents, compliance, and account access at 9278.ai.",
      canonical: absoluteUrl("/faq"),
      indexable: true,
      group: "Marketing",
    },
  ]

  const funnel: SeoEntry[] = [
    {
      path: "/get-started",
      title: "Get started — launch your AI voice agent",
      description:
        "Spin up your AI voice agent in minutes. Choose a credit plan, optionally add a phone number, and start talking.",
      canonical: absoluteUrl("/get-started"),
      indexable: true,
      group: "Funnel",
    },
    {
      path: "/get-started/thanks",
      title: "Payment received",
      description: "Thanks — we’ve activated your 9278.ai voice credit and are provisioning your agent now.",
      canonical: absoluteUrl("/get-started/thanks"),
      indexable: false,
      group: "Funnel",
    },
  ]

  const internal: SeoEntry[] = [
    {
      path: "/admin/login",
      title: "Super-admin sign in",
      description: "Sign in to the 9278.ai super-admin dashboard.",
      canonical: absoluteUrl("/admin/login"),
      indexable: false,
      group: "Internal",
    },
    {
      path: "/auth/error",
      title: "Sign-in link expired",
      description: "",
      canonical: absoluteUrl("/auth/error"),
      indexable: false,
      group: "Internal",
    },
  ]

  return [...marketing, ...industries, ...funnel, ...internal]
}

export function audit(entry: SeoEntry, allTitles: Map<string, number>): AuditedPage {
  const warnings: AuditWarning[] = []
  const titleLength = entry.title.length
  const descLength = entry.description.length

  if (titleLength < TITLE_MIN) warnings.push({ level: "warn", msg: `Title too short (${titleLength} chars, ideal ${TITLE_MIN}–${TITLE_MAX})` })
  if (titleLength > TITLE_MAX) warnings.push({ level: "warn", msg: `Title too long (${titleLength} chars, ideal ≤ ${TITLE_MAX})` })
  if (descLength < DESC_MIN) warnings.push({ level: "warn", msg: `Description too short (${descLength} chars, ideal ${DESC_MIN}–${DESC_MAX})` })
  if (descLength > DESC_MAX) warnings.push({ level: "warn", msg: `Description too long (${descLength} chars, ideal ≤ ${DESC_MAX})` })

  if (!entry.description) warnings.push({ level: "error", msg: "Missing description" })
  if (!entry.title) warnings.push({ level: "error", msg: "Missing title" })

  if (entry.indexable && (allTitles.get(entry.title) ?? 0) > 1) {
    warnings.push({ level: "error", msg: "Duplicate title across the site" })
  }

  if (!entry.canonical.startsWith(SITE.url)) {
    warnings.push({ level: "error", msg: `Canonical does not match site URL (${SITE.url})` })
  }

  return { ...entry, warnings, titleLength, descLength }
}

export function getAuditedRegistry(): {
  pages: AuditedPage[]
  totals: {
    pages: number
    indexable: number
    errors: number
    warnings: number
  }
} {
  const pages = getRegistry()
  const titleCounts = new Map<string, number>()
  for (const p of pages) {
    if (!p.indexable) continue
    titleCounts.set(p.title, (titleCounts.get(p.title) ?? 0) + 1)
  }
  const audited = pages.map((p) => audit(p, titleCounts))
  let errors = 0
  let warnings = 0
  for (const p of audited) {
    for (const w of p.warnings) {
      if (w.level === "error") errors += 1
      else if (w.level === "warn") warnings += 1
    }
  }
  return {
    pages: audited,
    totals: {
      pages: audited.length,
      indexable: audited.filter((p) => p.indexable).length,
      errors,
      warnings,
    },
  }
}
