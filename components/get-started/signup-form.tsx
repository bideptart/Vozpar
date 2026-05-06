"use client"

import { useActionState, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Check, Loader2, Phone, ShieldCheck, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  PLANS,
  PHONE_NUMBER_RATES,
  type PlanId,
  type PhoneNumberRegion,
} from "@/lib/pricing"
import { submitSignup, type SignupState } from "@/app/get-started/actions"

const INDUSTRIES = [
  { id: "real-estate", label: "Real Estate" },
  { id: "dental", label: "Dental" },
  { id: "healthcare", label: "Healthcare" },
  { id: "home-services", label: "Home Services" },
  { id: "automotive", label: "Automotive" },
  { id: "legal", label: "Legal" },
  { id: "restaurants", label: "Restaurants" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "fitness", label: "Fitness & Wellness" },
  { id: "other", label: "Other" },
]

export function SignupForm() {
  const params = useSearchParams()
  const initialPlan = (params.get("plan") as PlanId) || "growth"

  const [planId, setPlanId] = useState<PlanId>(
    PLANS.find((p) => p.id === initialPlan) ? initialPlan : "growth",
  )
  const [region, setRegion] = useState<PhoneNumberRegion["id"] | "none">("none")
  const [phoneQty, setPhoneQty] = useState<number>(1)

  const plan = PLANS.find((p) => p.id === planId)!
  const regionRow: PhoneNumberRegion | undefined =
    region === "none" ? undefined : PHONE_NUMBER_RATES.find((r) => r.id === region)

  const phoneCost = regionRow ? regionRow.monthly * phoneQty : 0
  const total = plan.amount + phoneCost

  const [state, formAction, pending] = useActionState<SignupState, FormData>(submitSignup, { ok: true })
  const errors = state.errors ?? {}

  const summary = useMemo(
    () => ({
      planLine: `${plan.name} credit · $${plan.amount}`,
      minutesLine: `≈ ${plan.minutes.toLocaleString()} min · ${plan.agents} ${plan.agents === 1 ? "agent" : "agents"} · $${plan.ratePerMin.toFixed(2)}/min`,
      phoneLine: regionRow ? `${phoneQty} × ${regionRow.region} number${phoneQty > 1 ? "s" : ""}` : "No phone number",
      phoneCostLine: regionRow ? `$${regionRow.monthly} / mo each` : "—",
    }),
    [plan, regionRow, phoneQty],
  )

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-12">
        {/* Plan selection */}
        <Section
          number="01"
          title="Choose your starting credit"
          subtitle="Three tiers, three rates. Higher tiers unlock lower per-minute pricing and more concurrent AI agents."
        >
          <input type="hidden" name="plan" value={planId} />
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => {
              const active = p.id === planId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlanId(p.id)}
                  className={cn(
                    "group relative rounded-xl border p-5 text-left transition-all",
                    active
                      ? "border-primary/60 bg-primary/[0.06]"
                      : "border-border/60 bg-card/30 hover:border-border hover:bg-card/50",
                  )}
                  aria-pressed={active}
                >
                  {p.recommended && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span
                      className={cn(
                        "grid size-5 place-items-center rounded-full border transition-colors",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                      )}
                      aria-hidden
                    >
                      {active && <Check className="size-3" />}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">${p.amount}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${p.ratePerMin.toFixed(2)}/min · {p.minutes.toLocaleString()} min · {p.agents}{" "}
                    {p.agents === 1 ? "agent" : "agents"}
                  </p>
                </button>
              )
            })}
          </div>
          {errors.plan && <p className="mt-2 text-xs text-destructive">{errors.plan}</p>}
        </Section>

        {/* Phone number */}
        <Section
          number="02"
          title="Add a phone number?"
          subtitle="Optional. Provision a DID for outbound caller-ID and inbound calls."
        >
          <input type="hidden" name="phoneRegion" value={region} />
          <input type="hidden" name="phoneQty" value={phoneQty} />
          <div className="grid gap-3 md:grid-cols-2">
            <RegionOption
              active={region === "none"}
              onClick={() => setRegion("none")}
              title="Skip for now"
              price="Free"
              description="Use our shared connectivity. You can add a number later."
              icon={ShieldCheck}
            />
            {PHONE_NUMBER_RATES.map((r) => (
              <RegionOption
                key={r.id}
                active={region === r.id}
                onClick={() => setRegion(r.id)}
                title={r.region}
                price={`$${r.monthly} / mo`}
                description={r.description}
                icon={Phone}
                flag={r.flag}
              />
            ))}
          </div>

          {regionRow && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-card/30 px-4 py-3">
              <Label htmlFor="phoneQty" className="text-sm">
                Quantity
              </Label>
              <Input
                id="phoneQty"
                type="number"
                min={1}
                max={50}
                value={phoneQty}
                onChange={(e) => setPhoneQty(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="h-9 w-24"
              />
              <span className="text-sm text-muted-foreground">
                × ${regionRow.monthly} / mo = <span className="text-foreground">${phoneCost}/mo</span>
              </span>
            </div>
          )}
          {errors.phoneRegion && <p className="mt-2 text-xs text-destructive">{errors.phoneRegion}</p>}
          {errors.phoneQty && <p className="mt-2 text-xs text-destructive">{errors.phoneQty}</p>}
        </Section>

        {/* Customer details */}
        <Section number="03" title="Tell us about you" subtitle="So we can configure your agent and onboard you fast.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" name="name" placeholder="Jane Doe" error={errors.name} required />
            <Field
              label="Work email"
              name="email"
              type="email"
              placeholder="jane@company.com"
              error={errors.email}
              required
            />
            <Field label="Company" name="company" placeholder="Acme Realty" error={errors.company} required />
            <Field label="Phone (optional)" name="phone" placeholder="+1 555 123 4567" />

            <div className="md:col-span-2">
              <Label htmlFor="industry" className="mb-2 inline-block text-sm">
                Industry
              </Label>
              <select
                id="industry"
                name="industry"
                defaultValue=""
                className={cn(
                  "h-10 w-full rounded-md border border-border/60 bg-card/30 px-3 text-sm",
                  "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30",
                )}
              >
                <option value="" disabled>
                  Select your industry
                </option>
                {INDUSTRIES.map((i) => (
                  <option key={i.id} value={i.id} className="bg-background">
                    {i.label}
                  </option>
                ))}
              </select>
              {errors.industry && <p className="mt-1 text-xs text-destructive">{errors.industry}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="useCase" className="mb-2 inline-block text-sm">
                What will your agent do?
              </Label>
              <Textarea
                id="useCase"
                name="useCase"
                rows={4}
                placeholder="e.g. Qualify inbound leads from our website, book showings on our calendar, and follow up by SMS the next morning."
                className="bg-card/30"
              />
            </div>
          </div>
        </Section>

        {state?.message && !state.ok && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>

      {/* Sticky summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <motion.div
          layout
          className="rounded-2xl border border-border/60 bg-card/40 p-6"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            Order summary
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <Row label="Plan" value={summary.planLine} sub={summary.minutesLine} />
            <Row label="Phone numbers" value={summary.phoneLine} sub={summary.phoneCostLine} />
            <div className="border-t border-border/60 pt-4">
              <Row label="Voice rate" value={`$${plan.ratePerMin.toFixed(2)} / min`} muted />
              <Row label="Today's charge" value={`$${total.toFixed(2)}`} bold />
              {phoneCost > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  + ${phoneCost.toFixed(2)} / month thereafter for phone numbers.
                </p>
              )}
            </div>
          </dl>

          <Button
            type="submit"
            disabled={pending}
            className="mt-6 h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Processing…
              </>
            ) : (
              <>Pay ${total.toFixed(2)} with Stripe →</>
            )}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Secure Stripe checkout. Voice credit valid 60 days. Phone numbers renew monthly.
          </p>
        </motion.div>
      </aside>
    </form>
  )
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-3">
        <span className="text-xs font-mono text-muted-foreground">{number}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  error,
  required,
}: {
  label: string
  name: string
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2 inline-block text-sm">
        {label} {required && <span className="text-muted-foreground">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="bg-card/30"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function RegionOption({
  active,
  onClick,
  title,
  price,
  description,
  icon: Icon,
  flag,
}: {
  active: boolean
  onClick: () => void
  title: string
  price: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  flag?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
        active
          ? "border-primary/60 bg-primary/[0.06]"
          : "border-border/60 bg-card/30 hover:border-border hover:bg-card/50",
      )}
    >
      <span
        aria-hidden
        className="grid size-9 flex-none place-items-center rounded-lg border border-border/60 bg-background/60"
      >
        {flag ? (
          <span className="text-[10px] font-semibold tracking-wider">{flag}</span>
        ) : (
          <Icon className="size-4 text-primary" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-sm text-foreground/80">{price}</p>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}

function Row({
  label,
  value,
  sub,
  muted,
  bold,
}: {
  label: string
  value: string
  sub?: string
  muted?: boolean
  bold?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className={cn("text-muted-foreground", muted && "text-xs uppercase tracking-wider")}>{label}</dt>
      <dd className="text-right">
        <p className={cn(bold ? "text-base font-semibold tracking-tight" : "text-sm text-foreground")}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </dd>
    </div>
  )
}
