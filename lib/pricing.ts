export type PlanId = "starter" | "growth" | "scale"

export interface Plan {
  id: PlanId
  name: string
  recommended?: boolean
  amount: number
  yearlyAmount: number
  rate: number
  ratePerMin: number
  minutes: number
  agents: number
  tagline: string
  highlights: string[]
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    recommended: false,
    amount: 31,
    yearlyAmount: 298,
    rate: 0.13,
    ratePerMin: 0.13,
    minutes: 250,
    agents: 2,
    tagline: "Pilot a single agent and prove the ROI.",
    highlights: ["250 included minutes/mo", "2 AI Agents", "Standard Support", "Full API Access"],
  },
  {
    id: "growth",
    name: "Growth",
    recommended: true,
    amount: 93,
    yearlyAmount: 893,
    rate: 0.12,
    ratePerMin: 0.12,
    minutes: 800,
    agents: 10,
    tagline: "Most teams start here. Scale to a full pipeline.",
    highlights: ["800 included minutes/mo", "10 AI Agents", "Priority Support", "Advanced Analytics"],
  },
  {
    id: "scale",
    name: "Scale",
    recommended: false,
    amount: 316,
    yearlyAmount: 3034,
    rate: 0.11,
    ratePerMin: 0.11,
    minutes: 3000,
    agents: 999,
    tagline: "High-volume teams running full call centers.",
    highlights: ["3,000 included minutes/mo", "Unlimited AI Agents", "Dedicated SLA & Support", "Custom Integrations"],
  },
]

export const LOWEST_RATE_PER_MIN = 0.11
export const ENTRY_RATE_PER_MIN = 0.13

export type PhoneNumberRegion = {
  id: "us" | "ca" | "uk" | "eu"
  name: string
  monthlyRate: number
}

export const PHONE_NUMBER_RATES: PhoneNumberRegion[] = [
  { id: "us", name: "United States (+1)", monthlyRate: 2.0 },
  { id: "ca", name: "Canada (+1)", monthlyRate: 2.0 },
  { id: "uk", name: "United Kingdom (+44)", monthlyRate: 3.5 },
  { id: "eu", name: "European Union (+39/+49/+33)", monthlyRate: 4.0 },
]
