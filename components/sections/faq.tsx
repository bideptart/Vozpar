"use client"

import Link from "next/link"
import { HelpCircle, ArrowRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FLAT_FAQ } from "@/lib/faq"

export function FAQ() {
  const items = FLAT_FAQ.slice(0, 8)
  return (
    <section id="faq" className="relative overflow-hidden border-t border-border/40">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          {/* LEFT: Heading */}
          <ScrollReveal className="lg:col-span-4">
            <span className="ai-pill-magenta">
              <HelpCircle className="h-3 w-3" />
              FAQ
            </span>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Questions,{" "}
              <span className="text-aurora">answered.</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
              The short version: $20 minimum top-up, voice credit valid 60 days, phone numbers stay with your existing carrier.
              The long version is on the right.
            </p>
            <Link
              href="/faq"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              See all FAQs
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>

          {/* RIGHT: Accordion */}
          <ScrollReveal className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="card-glow rounded-2xl border-0 px-5 transition-colors data-[state=open]:border data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline data-[state=open]:text-primary">
                    <span className="flex items-start gap-4">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-[11px] font-semibold text-primary ring-1 ring-primary/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-10 text-pretty leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
