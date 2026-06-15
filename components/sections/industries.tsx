"use client"

import { Home, Stethoscope, HeartPulse, Wrench, UtensilsCrossed, Car } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const items = [
  {
    icon: Home,
    title: "Real estate",
    description:
      "Qualify buyer & seller leads 24/7, book showings on your calendar, and follow up the moment a listing gets a hit.",
  },
  {
    icon: Stethoscope,
    title: "Dental",
    description:
      "Confirm appointments, fill last-minute cancellations, and answer insurance & treatment questions without tying up the front desk.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description:
      "Automate patient intake, prescription refills, and reminder calls with a calm, HIPAA-aware bedside tone.",
  },
  {
    icon: Wrench,
    title: "Home services",
    description:
      "Capture every after-hours service request, dispatch the right tech, and never lose a job to a slow callback again.",
  },
  {
    icon: UtensilsCrossed,
    title: "Restaurants",
    description:
      "Take reservations, confirm large parties, answer hours and menu questions — fluently, in any accent.",
  },
  {
    icon: Car,
    title: "Automotive",
    description:
      "Schedule service, follow up on test drives, and keep the BDC ringing 24 hours a day across every dealership.",
  },
]

export function Industries({ showHeader = true }: { showHeader?: boolean } = {}) {
  return (
    <section id="industries" className="relative overflow-hidden border-t border-border/40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-10 md:px-6 md:py-12">
        {showHeader && (
          <ScrollReveal className="mx-auto max-w-xl text-center">
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Industries
            </span>
            <h2 className="mt-3 text-balance text-2xl font-semibold leading-[1.15] tracking-tight md:text-3xl">
              Built for every kind of{" "}
              <span className="text-primary">phone call.</span>
            </h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              Pre-tuned scripts, integrations, and compliance guardrails for the workflows you actually run.
            </p>
          </ScrollReveal>
        )}

        <StaggerGroup className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", showHeader && "mt-8")}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="group relative h-full"
                >
                  <div className="card-glow relative h-full overflow-hidden rounded-lg p-3.5">
                    <span
                      aria-hidden
                      className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/0 blur-xl transition-all duration-500 group-hover:bg-primary/30"
                    />
                    <div className="relative">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 text-primary ring-1 ring-primary/20 transition-all group-hover:ring-primary/40">
                        <Icon
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                          aria-hidden="true"
                        />
                      </span>
                      <h3 className="mt-2.5 text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{item.description}</p>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Explore playbook →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
