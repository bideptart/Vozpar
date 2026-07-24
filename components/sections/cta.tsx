"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CalendarDays, PhoneCall, Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"

export function CTA() {
  const reduced = useReducedMotion()
  return (
    <section id="cta" className="relative overflow-hidden border-t border-border/40">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <ScrollReveal>
          <div className="ring-gradient relative overflow-hidden rounded-[28px] border border-border/40 bg-gradient-to-br from-card/80 via-card/40 to-background/40 px-6 py-16 text-center md:px-12 md:py-24">
            {/* Drifting glow */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/3 top-0 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] [will-change:transform]"
              animate={reduced ? undefined : { x: [0, 60, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-[24rem] w-[24rem] translate-x-1/2 translate-y-1/2 rounded-full bg-accent/8 blur-[120px] [will-change:transform]"
              animate={reduced ? undefined : { x: [0, -40, 20, 0], y: [0, 30, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            {/* Subtle dot grid overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
            />

            <span className="relative ai-pill-cyan">
              <Sparkles className="h-3 w-3" />
              Live demo · No signup
            </span>

            <h2 className="relative mt-7 text-balance font-heading text-5xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
              Hear it before{" "}
              <span className="text-primary">you build it.</span>
            </h2>
            <p className="relative mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Talk to a live 9278.ai agent right now, see our pricing, or book a 20-minute walkthrough.
            </p>

            <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="group btn-ai h-12 rounded-full px-7 transition-all"
              >
                View pricing
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group h-12 rounded-full border-border/70 bg-card/40 px-7 text-foreground backdrop-blur-md hover:border-primary/50 hover:bg-card/60 hover:text-foreground"
              >
                <PhoneCall className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                Call me now
              </Button>
              <Button size="lg" variant="ghost" className="h-12 rounded-full px-7 text-foreground hover:bg-card/40 hover:text-foreground">
                <CalendarDays className="mr-2 h-4 w-4" />
                Schedule a meeting
              </Button>
            </div>

            {/* Trust strip */}
            <div className="relative mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Sub-second latency
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Bring your own carrier
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Self-hosted control panel
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No contracts
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
