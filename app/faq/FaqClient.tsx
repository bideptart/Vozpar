"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Search, ArrowRight, CreditCard, Phone, Headset, Shield, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { FAQ_GROUPS } from "@/lib/faq"
import { RelatedLinks } from "@/components/seo/related-links"

const getCategoryIcon = (id: string) => {
  switch (id) {
    case "billing":
      return <CreditCard className="h-8 w-8" />
    case "phone-numbers":
      return <Phone className="h-8 w-8" />
    case "agents":
      return <Headset className="h-8 w-8" />
    case "compliance":
      return <Shield className="h-8 w-8" />
    case "account":
      return <Users className="h-8 w-8" />
    default:
      return null
  }
}

export default function FaqClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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

  // Duplicate categories for infinite scroll
  const categoriesForScroll = [...FAQ_GROUPS, ...FAQ_GROUPS]

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.10),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <ScrollReveal className="text-center">
            <span className="ai-pill-magenta">
              <span className="h-1 w-1 rounded-full bg-accent" />
              FAQ
            </span>
            <h1 className="mt-6 text-balance text-4xl font-serif font-normal tracking-tight md:text-6xl">
              Everything you <span className="text-primary">wanted to know.</span>
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg max-w-3xl mx-auto">
              Pricing, credit expiry, phone numbers, compliance, and account access — all in one place. Still stuck?
              The team replies within an hour during business days.
            </p>
          </ScrollReveal>

          {/* Search Bar */}
          <ScrollReveal className="mt-10">
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
                  className="w-full pl-12 pr-32 py-4 text-base rounded-full border-2 border-primary/30 bg-card focus:outline-none focus:border-primary/50"
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 font-semibold flex items-center gap-2"
                >
                  Search <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Cards - Infinite Scroll */}
          <ScrollReveal className="mt-10">
            <div className="overflow-hidden">
              <div className="flex gap-4 marquee">
                {categoriesForScroll.map((g, idx) => (
                  <button
                    key={`${g.id}-${idx}`}
                    onClick={() => { 
                      if (activeCategory === g.id) {
                        setActiveCategory(null)
                      } else {
                        setActiveCategory(g.id)
                      }
                      setSearchQuery("")
                    }}
                    className={`flex-shrink-0 flex flex-col items-center gap-3 p-6 rounded-xl border-2 min-w-[180px] transition-all ${
                      activeCategory === g.id
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20"
                        : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <div className="text-primary">
                      {getCategoryIcon(g.id)}
                    </div>
                    <span className="text-center font-medium">
                      {g.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6 md:py-24">
        {filteredGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24 border-b border-border/50 py-10 first:pt-0 last:border-b-0">
            <ScrollReveal>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{group.title}</h2>
            </ScrollReveal>

            <ScrollReveal className="mt-6 space-y-4">
              {group.items.map((item, i) => (
                <div key={i} className="group">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem 
                      value={`${group.id}-${i}`} 
                      className="border-0 rounded-2xl bg-card/50 px-6 py-4 data-[state=open]:bg-card data-[state=open]:shadow-lg transition-all"
                    >
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline group-hover:no-underline">
                        <div className="flex items-center gap-3">
                          <span className="text-foreground">{item.q}</span>
                          {item.popular && (
                            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                              <Zap className="h-3 w-3 fill-current" />
                              Popular
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-pretty leading-relaxed text-muted-foreground pt-2">
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
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-primary/5 p-8 md:p-12 shadow-xl">
            {/* Background glow */}
            <div className="absolute -inset-4 bg-primary/10 blur-2xl opacity-50" />
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold mb-4">
                    <Zap className="h-3 w-3 fill-current" />
                    LIVE DEMO • NO SIGNUP
                  </span>
                  <h3 className="text-balance text-3xl font-serif font-semibold tracking-tight md:text-4xl">
                    Still have <span className="text-primary">a question?</span>
                  </h3>
                  <p className="mt-4 text-muted-foreground md:text-lg">
                    Talk to a live Vozpar agent — yes, that's actually how we do support — or book 20 minutes with a
                    solutions engineer.
                  </p>
                  
                  <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Sub-second latency
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Bring your own carrier
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Self-hosted control panel
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      No contracts
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="bg-black text-white hover:bg-black/90 rounded-full px-8">
                    <Link href="/get-started">
                      Get started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-2">
                    <Link href="/pricing">View pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
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
