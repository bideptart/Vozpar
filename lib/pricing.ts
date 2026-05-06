/**
 * Single source of truth for 9278.ai pricing.
 * Used on /pricing, /get-started, and the homepage pricing section.
 */

export type PlanId = "starter" | "growth" | "scale"

export type Plan = {
  id: PlanId
  name: string
  /** Minimum credit amount in USD. */
  amount: number
  /** Voice rate in USD per minute for this tier. */
  ratePerMin: number
  /** Approx voice minutes included = amount / ratePerMin. */
  minutes: number
  /** Number of concurrent AI voice agents included. */
  agents: number
  tagline: string
  highlights: string[]
  recommended?: boolean
}

/** Lowest available rate, shown in homepage teaser copy. */
export const LOWEST_RATE_PER_MIN = 0.1
/** Highest entry rate, shown in "from … per minute" copy. */
export const ENTRY_RATE_PER_MIN = 0.15

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    amount: 20,
    ratePerMin: 0.15,
    minutes: 133,
    agents: 1,
    tagline: "Pilot a single agent and prove the ROI.",
    highlights: [
      "1 AI voice agent",
      "~133 voice minutes included",
      "$0.15 per minute",
      "Credit valid for 60 days",
      "Inbound or outbound calling",
      "Real-time transcripts",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    amount: 50,
    ratePerMin: 0.12,
    minutes: 416,
    agents: 2,
    tagline: "Most teams start here. Scale to a full pipeline.",
    highlights: [
      "2 AI voice agents",
      "~416 voice minutes included",
      "$0.12 per minute",
      "Credit valid for 60 days",
      "Inbound + outbound + transfers",
      "Custom voice & persona",
      "CRM & calendar integrations",
      "Priority support",
    ],
    recommended: true,
  },
  {
    id: "scale",
    name: "Scale",
    amount: 100,
    ratePerMin: 0.1,
    minutes: 1000,
    agents: 3,
    tagline: "High-volume teams running full call centers.",
    highlights: [
      "3 AI voice agents",
      "1,000 voice minutes included",
      "$0.10 per minute — our best rate",
      "Credit valid for 60 days",
      "Concurrent call campaigns",
      "Advanced analytics & reports",
      "Custom integrations & webhooks",
      "Dedicated success manager",
    ],
  },
]

/** How long voice credit remains usable after purchase. */
export const CREDIT_VALIDITY_DAYS = 60

export type PhoneNumberRegion = {
  /** Stable id for use in Stripe price_data lookups. */
  id: "us" | "ca" | "uk" | "eu"
  region: string
  flag: string
  countries: string[]
  monthly: number
  description: string
}

export const PHONE_NUMBER_RATES: PhoneNumberRegion[] = [
  {
    id: "us",
    region: "United States",
    flag: "US",
    countries: ["USA"],
    monthly: 2,
    description: "Local US area codes, toll-free 800-series available.",
  },
  {
    id: "ca",
    region: "Canada",
    flag: "CA",
    countries: ["Canada"],
    monthly: 5,
    description: "Local Canadian numbers across all provinces.",
  },
  {
    id: "uk",
    region: "United Kingdom",
    flag: "UK",
    countries: ["United Kingdom"],
    monthly: 5,
    description: "London, Manchester, Edinburgh and other UK city codes.",
  },
  {
    id: "eu",
    region: "Europe",
    flag: "EU",
    countries: ["Germany", "France", "Spain", "Italy", "Netherlands", "Ireland", "Belgium", "Portugal"],
    monthly: 5,
    description: "Local numbers across major European markets.",
  },
]
