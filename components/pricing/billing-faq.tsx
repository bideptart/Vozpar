"use client"

import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type FaqItem = {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "How does pricing work?",
    answer:
      "You top up with $20, $50, or $100 of voice credit. Voice minutes are billed against that credit at $0.15/min on Starter, $0.12/min on Growth, or $0.10/min on Scale. There are no setup fees, no contracts, and no monthly platform fees beyond your top-up.",
  },
  {
    question: "Do my voice minutes expire?",
    answer:
      "Voice credit is valid for 60 days from the date of purchase. After 60 days any unused balance expires. Top up again at any time to extend — every new top-up gets its own fresh 60-day window.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. The only line item from us is voice credit. There's no setup, no contracts, and no minimums beyond your top-up. Phone numbers stay billed directly by your carrier — we don't add a markup.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "If you experience a service issue we'll always make it right. Unused credit purchased within the last 14 days is refundable on request.",
  },
  {
    question: "Can I top up more than $100?",
    answer:
      "Yes. You can top up multiple times in any combination — Stripe handles every charge. High-volume teams typically run 3–5 Scale top-ups a week.",
  },
]

export function BillingFAQ() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <ScrollReveal>
        <h2 className="text-balance text-center text-4xl font-serif font-normal leading-[1.1] tracking-tight md:text-5xl">
          Billing questions, <span className="text-primary">answered.</span>
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-xl text-pretty text-center text-sm leading-relaxed text-muted-foreground md:text-base">
          Straight answers on credit, billing cycles, and what happens when your minutes run out — no jargon, no
          surprise charges.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="group/item relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] px-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.02] data-[state=open]:border-primary/30 data-[state=open]:bg-white/[0.03]"
            >
              <div 
                className="absolute left-0 inset-y-0 w-[3px] bg-primary scale-y-0 transition-transform duration-300 origin-center group-data-[state=open]/item:scale-y-100" 
                aria-hidden="true"
              />
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline data-[state=open]:text-primary transition-colors py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-pretty leading-relaxed text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </section>
  )
}