"use client"

import { motion } from "motion/react"
import { Phone } from "lucide-react"
import { PHONE_NUMBER_RATES } from "@/lib/pricing"

export function PhoneRates() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/30">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <Phone className="size-5 text-primary" aria-hidden />
          <div>
            <h3 className="text-base font-semibold tracking-tight">Phone numbers (DID)</h3>
            <p className="text-xs text-muted-foreground">Optional. Only billed if you provision a number.</p>
          </div>
        </div>
        <div className="hidden text-right md:block">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Per number / month</p>
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        {PHONE_NUMBER_RATES.map((row, i) => (
          <motion.li
            key={row.region}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between gap-6 px-6 py-5"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="grid size-10 flex-none place-items-center rounded-lg border border-border/60 bg-background/60 text-xs font-semibold tracking-wider text-foreground/80"
              >
                {row.flag}
              </span>
              <div>
                <p className="text-sm font-medium">{row.region}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.description}</p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  Includes: <span className="text-foreground/70">{row.countries.join(", ")}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold tracking-tight">${row.monthly}</p>
              <p className="text-xs text-muted-foreground">/ month</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
