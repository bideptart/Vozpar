"use client"

import { useState } from "react"
import Link from "next/link"
import {
  HelpCircle, ArrowRight, Plus, CreditCard, PhoneCall, Bot, ShieldCheck, UserCircle2, Flame,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FAQ_GROUPS } from "@/lib/faq"

/**
 * Rebuilt around the category-tab pattern PlatformCore/UseCases already use
 * (pill switcher with a sliding tint indicator, crossfading panel content)
 * instead of a plain static two-column accordion — the previous pass fixed
 * the color tokens but the layout itself still read as flat/generic next to
 * the rest of the redesigned Home page.
 */
const CATEGORY_META: Record<string, { icon: typeof CreditCard; tint: string }> = {
  billing: { icon: CreditCard, tint: "#2d98f1" },
  "phone-numbers": { icon: PhoneCall, tint: "#6366f1" },
  agents: { icon: Bot, tint: "#10b981" },
  compliance: { icon: ShieldCheck, tint: "#f59e0b" },
  account: { icon: UserCircle2, tint: "#ec4899" },
}

const TABS = FAQ_GROUPS.map(g => ({
  ...g,
  ...CATEGORY_META[g.id],
  // Popular items surface first inside each category so the highest-signal
  // answers are visible without expanding anything.
  items: [...g.items].sort((a, b) => Number(b.popular) - Number(a.popular)).slice(0, 5),
}))

export function FAQ() {
  const [activeId, setActiveId] = useState(TABS[0].id)
  const current = TABS.find(t => t.id === activeId)!

  return (
    <section id="faq" className="relative overflow-hidden border-t border-white/[0.06] bg-black">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
        style={{ background: "radial-gradient(50% 50% at 50% 0%, rgba(4,107,210,0.09) 0%, transparent 80%)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <ScrollReveal className="mx-auto mb-8 max-w-2xl text-center">
          <span className="ai-pill-magenta">
            <HelpCircle className="h-3 w-3" />
            FAQ
          </span>
          <h2 className="mt-5 text-balance font-heading text-3xl font-medium leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl md:text-5xl">
            Questions,{" "}
            <span className="bg-gradient-to-r from-[#2d98f1] via-[#60b8ff] to-[#2d98f1] bg-clip-text text-transparent">
              answered.
            </span>
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-white/50">
            $20 minimum top-up, voice credit valid 60 days, phone numbers stay with your existing carrier.
            Pick a category below for the rest.
          </p>
        </ScrollReveal>

        {/* Category tab pills */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isSelected = tab.id === activeId
            return (
              <button
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                aria-pressed={isSelected}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-colors duration-300 focus:outline-none sm:text-sm ${
                  isSelected ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="faqTab"
                    className="absolute inset-0 rounded-full border"
                    style={{
                      borderColor: `${tab.tint}60`,
                      background: `linear-gradient(135deg, ${tab.tint}22 0%, ${tab.tint}08 100%)`,
                      boxShadow: `0 0 22px ${tab.tint}30`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-4 w-4" style={{ color: isSelected ? tab.tint : "currentColor" }} />
                <span className="relative z-10">{tab.title}</span>
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-black shadow-2xl">
          <motion.div
            className="h-[2px] w-full"
            animate={{ background: `linear-gradient(90deg, transparent, ${current.tint}, transparent)` }}
            transition={{ duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="p-5 sm:p-6 md:p-8"
            >
              <Accordion type="single" collapsible className="w-full space-y-3">
                {current.items.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`item-${i}`}
                    className="group/faq rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-white/[0.01] px-5 transition-colors duration-300 hover:border-white/[0.14]"
                  >
                    <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline [&>svg]:hidden">
                      <span className="flex items-start gap-4">
                        <span
                          className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold transition-colors duration-300"
                          style={{
                            background: `${current.tint}18`,
                            color: current.tint,
                            boxShadow: `inset 0 0 0 1px ${current.tint}35`,
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex flex-wrap items-center gap-2">
                          {item.q}
                          {item.popular && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]"
                              style={{ background: `${current.tint}15`, color: current.tint }}
                            >
                              <Flame className="h-2.5 w-2.5" />
                              Popular
                            </span>
                          )}
                        </span>
                      </span>
                      <Plus
                        className="mt-1 h-4 w-4 shrink-0 text-white/35 transition-transform duration-300 group-data-[state=open]/faq:rotate-45"
                        aria-hidden
                      />
                    </AccordionTrigger>
                    <AccordionContent className="pl-10 text-pretty leading-relaxed text-white/50">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {current.items.length} of {FAQ_GROUPS.find(g => g.id === current.id)!.items.length} shown
                </span>
                <Link
                  href="/faq"
                  className="group inline-flex items-center gap-2 font-mono text-xs font-semibold hover:underline"
                  style={{ color: current.tint }}
                >
                  See all FAQs
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
