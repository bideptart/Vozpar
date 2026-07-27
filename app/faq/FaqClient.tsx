"use client"

import type React from "react"
import Link from "next/link"
import { useState, useMemo, useRef } from "react"
import { Search, ArrowRight, CreditCard, Phone, Headset, Shield, Users, Zap } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { Magnetic, SpotlightPanel } from "@/components/animation/magnetic"
import { FAQ_GROUPS } from "@/lib/faq"
import { RelatedLinks } from "@/components/seo/related-links"
import {
  FloatingAccents,
  ParticleField,
  FloatingIconBadges,
} from "@/components/industries/industries-fx"

const getCategoryIcon = (id: string) => {
  switch (id) {
    case "billing":       return <CreditCard className="h-4 w-4" />
    case "phone-numbers": return <Phone className="h-4 w-4" />
    case "agents":        return <Headset className="h-4 w-4" />
    case "compliance":    return <Shield className="h-4 w-4" />
    case "account":       return <Users className="h-4 w-4" />
    default:              return null
  }
}

/**
 * One tint per category, matching the tinted-pill treatment the homepage
 * UseCases / PlatformCore tab rails already use: the pill picks up its own
 * colour on hover and holds it while active, instead of every pill sharing
 * the single blue --primary.
 */
const CATEGORY_TINT: Record<string, string> = {
  billing:         "#2d98f1", // blue
  "phone-numbers": "#10b981", // green
  agents:          "#ef4444", // red
  compliance:      "#f59e0b", // orange
  account:         "#a855f7", // purple
}

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const filteredGroups = useMemo(() => {
    let groups = FAQ_GROUPS

    if (activeCategory) {
      groups = groups.filter(g => g.id === activeCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      groups = groups.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
        )
      })).filter(group => group.items.length > 0)
    }

    return groups
  }, [searchQuery, activeCategory])

  return (
    <>
      {/* Matches the Industries page hero: flat bg-black with only the
          FX layers on top. The blue radial wash and the bg-grid overlay
          that used to sit here were what kept this reading navy rather
          than black. */}
      <section className="relative overflow-hidden border-b border-border/50 bg-black">
        <FloatingAccents />
        <ParticleField />
        <FloatingIconBadges />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-28 md:px-6 md:py-44">
          <ScrollReveal className="text-center">
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              FAQ
            </span>
            <h1 className="mt-8 text-balance font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3rem] lg:text-[3.25rem]">
              Everything you <span className="text-primary">wanted to know.</span>
            </h1>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Pricing, credit expiry, phone numbers, compliance, and account access — all in one place. Still stuck?
              The team replies within an hour during business days.
            </p>
          </ScrollReveal>

          {/* Search Bar */}
          <ScrollReveal className="mt-36 md:mt-44">
            <div className="relative mx-auto max-w-xl group">
              <div className="absolute -inset-1.5 rounded-full bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-base rounded-full border-2 border-primary/30 bg-card focus:outline-none focus:border-primary/50 transition-all duration-300"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                >
                  Search <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Category tabs — slim flat pills like 9278.ai reference */}
          <ScrollReveal className="mt-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {FAQ_GROUPS.map((g) => {
                const tint = CATEGORY_TINT[g.id] ?? "#2d98f1"
                const isActive = activeCategory === g.id
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      if (activeCategory === g.id) {
                        setActiveCategory(null)
                      } else {
                        setActiveCategory(g.id)
                        setTimeout(() => {
                          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                        }, 50)
                      }
                      setSearchQuery("")
                    }}
                    /* Colours live in CSS custom properties so hover and
                       active share one source of truth — Tailwind arbitrary
                       values read them, no per-state inline style needed. */
                    style={
                      {
                        "--tint": tint,
                        "--tint-bg": `${tint}22`,
                        "--tint-border": `${tint}60`,
                        "--tint-glow": `${tint}40`,
                      } as React.CSSProperties
                    }
                    className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "border-[var(--tint-border)] bg-[var(--tint-bg)] text-white shadow-[0_0_20px_var(--tint-glow)]"
                        : "border-white/15 text-slate-400 hover:border-[var(--tint-border)] hover:bg-[var(--tint-bg)] hover:text-white hover:shadow-[0_0_20px_var(--tint-glow)]"
                    }`}
                  >
                    <span
                      className={`transition-colors duration-300 ${isActive ? "" : "text-slate-500 group-hover:text-[var(--tint)]"}`}
                      style={isActive ? { color: tint } : undefined}
                    >
                      {getCategoryIcon(g.id)}
                    </span>
                    {g.title}
                  </button>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div ref={contentRef} className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16 md:px-6 md:pt-14 md:pb-24 scroll-mt-20">
        {filteredGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24 border-b border-white/[0.07] py-10 first:pt-0 last:border-b-0">
            <ScrollReveal>
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{group.title}</h2>
            </ScrollReveal>

            <ScrollReveal className="mt-6 space-y-3">
              {group.items.map((item, i) => (
                <div key={i} className="group/faq">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={`${group.id}-${i}`}
                      className="border-0 rounded-2xl bg-[#0b0b0e] border border-white/[0.07] px-6 py-1
                        transition-all duration-300 ease-out
                        hover:border-primary/30 hover:bg-[#0f0f14] hover:shadow-[0_0_0_1px_rgba(4,107,210,0.15),0_8px_32px_-8px_rgba(4,107,210,0.20)]
                        data-[state=open]:bg-[#0f0f14] data-[state=open]:border-primary/40
                        data-[state=open]:shadow-[0_0_0_1px_rgba(4,107,210,0.25),0_12px_40px_-8px_rgba(4,107,210,0.18)]"
                    >
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline text-white py-5 group-hover/faq:text-primary/90 transition-colors duration-300 [&>svg]:text-slate-500 [&>svg]:group-hover/faq:text-primary [&>svg]:transition-colors [&>svg]:duration-300">
                        <div className="flex items-center gap-3 pr-4">
                          <span>{item.q}</span>
                          {item.popular && (
                            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium border border-primary/20">
                              <Zap className="h-3 w-3 fill-current" />
                              Popular
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-pretty leading-relaxed text-slate-400 pt-0 pb-5 text-[15px]">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </ScrollReveal>
          </section>
        ))}
      </div>

      {/* Still have a question section */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl p-px">
            <span
              aria-hidden
              className="spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[300%] w-[160%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #3b82f6 40deg, transparent 100deg, transparent 200deg, #1d4ed8 250deg, transparent 310deg)",
                opacity: 0.85,
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl border"
              style={{ borderColor: "color-mix(in srgb, #3b82f6 35%, transparent)" }}
            />

            <SpotlightPanel
              glow="#3b82f6"
              size={520}
              className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0b0b0e] px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12"
            >
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <span
                  className="sheen-sweep absolute inset-y-0 w-1/3"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, color-mix(in srgb, #3b82f6 12%, transparent), transparent)",
                  }}
                />
              </span>

              <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
                <div className="max-w-xl">
                  <span className="ai-pill-blue">
                    <span className="h-1 w-1 rounded-full bg-current" />
                    Live support
                  </span>

                  <h3 className="mt-4 text-balance font-heading text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-foreground sm:text-3xl md:text-4xl">
                    Still have a question?
                  </h3>

                  <p className="mt-3 text-[15px] font-light leading-relaxed text-muted-foreground">
                    Talk to a live Vozpar agent — yes, that&apos;s actually how we do support — or book 20 minutes with a solutions engineer.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                      Sub-second latency
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                      Bring your own carrier
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                      No contracts required
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <Magnetic strength={0.28} className="w-full sm:w-auto">
                    <Link
                      href="/get-started"
                      className="btn-ai inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[filter,box-shadow] duration-300 sm:w-auto"
                    >
                      Get started
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Magnetic>

                  <Magnetic strength={0.22} className="w-full sm:w-auto">
                    <Link
                      href="/pricing"
                      className="inline-flex h-11 w-full items-center justify-center rounded-full bg-black/80 px-6 text-sm font-medium text-foreground border border-white/10 transition-colors duration-300 hover:border-white/30 hover:bg-black sm:w-auto"
                    >
                      View pricing
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </SpotlightPanel>
          </div>
        </ScrollReveal>
      </section>

      <RelatedLinks
        variant="flip"
        heading="Keep reading"
        description="The pages most teams visit right after the FAQ."
        links={[
          {
            href: "/pricing",
            title: "Pricing & per-minute rates",
            description: "Compare Starter, Growth and Scale top-ups and see the full phone-number rate card.",
          },
          {
            href: "/industries",
            title: "Industries — pre-tuned playbooks",
            description: "Real estate, dental, healthcare, home services, restaurants, automotive, and more.",
          },
          {
            href: "/get-started",
            title: "Get started in under 5 minutes",
            description: "Pick a plan, optionally add a phone number, and start a real test call.",
          },
        ]}
      />
    </>
  )
}
