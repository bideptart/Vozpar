"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"
import { headingType, bodyType } from "@/lib/industries-typography"

export type RelatedGuideLink = {
  href: string
  title: string
  description: string
}

/**
 * Industries-page-only replacement for the shared
 * components/seo/related-links.tsx — that component is rendered on 9 pages
 * (pricing, faq, features, blog, contact, about, both industries pages), so
 * it can't be edited for a richer animation without touching all of them.
 * This carries the same heading/description/links props and content, just
 * with a staggered per-card entrance, hover lift, and hover glow — used only
 * on app/industries/page.tsx.
 */
export function RelatedGuides({
  heading,
  description,
  links,
}: {
  heading: string
  description: string
  links: RelatedGuideLink[]
}) {
  return (
    <section
      aria-labelledby="related-heading"
      className="relative mx-auto w-full max-w-6xl overflow-hidden px-4 pb-24 md:px-6"
    >
      <ScrollReveal className="relative mb-10 text-center">
        <h2 id="related-heading" className={`text-balance text-white ${headingType.h3}`}>
          {heading}
        </h2>
        <p
          className={`mx-auto mt-2.5 max-w-2xl text-pretty text-muted-foreground ${bodyType.paragraph}`}
          style={{ fontSize: "17px" }}
        >
          {description}
        </p>
      </ScrollReveal>

      <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
        {links.map((l) => (
          <StaggerItem key={l.href} className="h-full">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="h-full"
            >
              <Link
                href={l.href}
                className="group relative flex h-full min-h-[280px] flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-10 transition-colors duration-300 hover:border-primary/50"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--accent)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                />
                <div className="relative">
                  <p className={`text-white ${bodyType.labelEmphasis}`} style={{ fontSize: "24px", fontWeight: 700 }}>
                    {l.title}
                  </p>
                  <p
                    className={`mt-3.5 text-muted-foreground ${bodyType.smallPrint}`}
                    style={{ fontSize: "17px", lineHeight: 1.6 }}
                  >
                    {l.description}
                  </p>
                </div>
                <span
                  className={`relative inline-flex items-center gap-2 text-primary ${bodyType.labelEmphasis}`}
                  style={{ fontSize: "18px" }}
                >
                  Read more
                  <ArrowRight
                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  )
}
