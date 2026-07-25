"use client"

import { HelpCircle } from "lucide-react"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type FaqItem = {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "How does per-second billing work on Vozpar?",
    answer:
      "Every voice call is measured down to the exact second. Unlike traditional telephony carriers that round up to full minutes, Vozpar only deducts the exact duration of your call so you never pay for unused seconds.",
  },
  {
    question: "What happens when I use all my included plan minutes?",
    answer:
      "Each plan includes a generous monthly minute allocation (250 min on Starter, 800 min on Growth, 3,000 min on Scale). If you exceed your plan's included minutes, additional usage is billed seamlessly at your plan's low effective rate ($0.13/min, $0.12/min, or $0.11/min).",
  },
  {
    question: "Are there any setup fees or hidden markups?",
    answer:
      "None. What you see is what you pay. There are zero setup fees, no line-item carrier markups, no hidden maintenance charges, and no long-term contracts required.",
  },
  {
    question: "Can I upgrade, downgrade, or cancel my plan anytime?",
    answer:
      "Yes. You can change your plan or toggle between monthly and yearly billing anytime from your dashboard. Upgrades take effect immediately with prorated billing.",
  },
  {
    question: "Are phone numbers and concurrent calls included?",
    answer:
      "Yes! Every plan includes phone number provisioning, inbound & outbound calling capabilities, call recording, and real-time transcriptions out of the box.",
  },
  {
    question: "Do you offer enterprise solutions for high-volume call centers?",
    answer:
      "High-volume teams running thousands of concurrent AI voice agents can unlock custom SIP trunking, dedicated infrastructure, SLA guarantees, and custom voice fine-tuning. Contact our team for custom quotes.",
  },
]

export function BillingFAQ() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pt-6 pb-16 md:px-6 md:pt-10 md:pb-20" suppressHydrationWarning>
      <ScrollReveal>
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
            <span>Got Questions?</span>
          </div>

          {/* Gradient Heading */}
          <h2 className="font-sans text-balance text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Everything you need to know about{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Vozpar Billing
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-12 mt-4 max-w-2xl text-pretty font-sans text-sm leading-relaxed text-slate-300 md:text-base">
            Everything you need to know about per-second billing, included minutes, and feature access—all with transparent pricing and no hidden fees.
          </p>
        </div>

        {/* Accordion Cards */}
        <Accordion type="single" collapsible className="w-full space-y-3.5" suppressHydrationWarning>
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="group/item relative overflow-hidden rounded-2xl border border-white/25 last:border-b-white/25 bg-white/[0.03] px-6 transition-all duration-300 hover:border-sky-500/50 hover:bg-white/[0.05] data-[state=open]:border-sky-500/60 data-[state=open]:bg-white/[0.06] data-[state=open]:shadow-[0_4px_24px_rgba(56,189,248,0.2)] shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
              suppressHydrationWarning
            >
              {/* Glowing side accent line */}
              <div 
                className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-sky-400 to-blue-600 scale-y-0 transition-transform duration-300 origin-center group-data-[state=open]/item:scale-y-100" 
                aria-hidden="true"
                suppressHydrationWarning
              />
              <AccordionTrigger className="text-left font-sans text-base font-semibold text-slate-100 hover:text-sky-300 hover:no-underline data-[state=open]:text-sky-400 transition-colors py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-sm leading-relaxed text-slate-300/90 pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </section>
  )
}