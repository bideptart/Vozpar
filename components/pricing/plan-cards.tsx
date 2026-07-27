"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Check, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PLANS } from "@/lib/pricing"
import { checkoutPlanAction } from "@/app/actions/checkout"

export function PlanCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLANS.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
          className={cn(
            "relative flex flex-col rounded-2xl border p-5 transition-colors sm:p-6 md:p-7",
            plan.recommended
              ? "border-primary/40 bg-gradient-to-b from-primary/[0.06] to-transparent"
              : "border-border/60 bg-card/40 hover:border-border",
          )}
        >
          {plan.recommended && (
            <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              Most popular
            </span>
          )}

          <div>
            <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.tagline}</p>
          </div>

          <div className="mt-5 flex items-baseline gap-2 sm:mt-6">
            <span className="text-4xl font-semibold tracking-tight sm:text-5xl">${plan.amount}</span>
            <span className="text-sm text-muted-foreground">credit</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            ${plan.ratePerMin.toFixed(2)}/min · ≈ {plan.minutes.toLocaleString()} minutes ·{" "}
            {plan.agents} {plan.agents === 1 ? "AI agent" : "AI agents"}
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {plan.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 flex-none text-primary" aria-hidden />
                <span className="text-foreground/90">{h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2 pt-2">
            <form action={checkoutPlanAction}>
              <input type="hidden" name="planId" value={plan.id} />
              <BuyNowButton recommended={plan.recommended} amount={plan.amount} />
            </form>
            <Button asChild variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
              <Link href={`/get-started?plan=${plan.id}`}>Configure with phone number →</Link>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function BuyNowButton({ recommended, amount }: { recommended?: boolean; amount: number }) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full",
        recommended
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      )}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
          Redirecting…
        </>
      ) : (
        <>Buy ${amount} now</>
      )}
    </Button>
  )
}
