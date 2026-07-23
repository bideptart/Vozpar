export type PlanId = "starter" | "growth" | "scale"

export const PLANS = [
  {
    id: "starter", name: "Starter",
    amount: 31, yearlyAmount: 298,        // was 20
    rate: 0.13,                            // was 0.15
    minutes: 250,                          // was ~133
    agents: 2,                             // was 1
    tagline: "Pilot a single agent and prove the ROI.",
  },
  {
    id: "growth", name: "Growth", recommended: true,
    amount: 93, yearlyAmount: 893,         // was 50
    rate: 0.12,
    minutes: 800,                          // was ~416
    agents: 10,                            // was 2
    tagline: "Most teams start here. Scale to a full pipeline.",
  },
  {
    id: "scale", name: "Scale",
    amount: 316, yearlyAmount: 3034,       // was 100
    rate: 0.11,                            // was 0.10
    minutes: 3000,                         // was 1000
    agents: 999,                           // "Unlimited" (was 3)
    tagline: "High-volume teams running full call centers.",
  },
] as const

// also update the rate constants to match the catalog:
export const LOWEST_RATE_PER_MIN = 0.11   // was 0.1
export const ENTRY_RATE_PER_MIN  = 0.13   // was 0.15
