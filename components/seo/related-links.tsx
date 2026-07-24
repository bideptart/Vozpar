import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export type RelatedLink = {
  href: string
  title: string
  description: string
}

/**
 * Site-wide internal-linking module. Each landing page renders one of these
 * to push link equity to siblings (industries → pricing → FAQ → get-started).
 */
export function RelatedLinks({
  heading = "Keep exploring 9278.ai",
  description = "Related guides, pricing, and use cases curated for the calls you take.",
  links,
  variant = "default",
}: {
  heading?: string
  description?: string
  links: RelatedLink[]
  variant?: "default" | "flip"
}) {
  if (variant === "flip") {
    const brandColors = ["var(--ai-cyan)", "var(--ai-violet)", "var(--ai-magenta)"]
    return (
      <section aria-labelledby="related-heading" className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
        <div className="mb-10">
          <h2 id="related-heading" className="text-balance text-4xl font-serif font-normal leading-[1.1] tracking-tight md:text-5xl text-white">
            {heading}
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
          {links.map((l, idx) => {
            const num = String(idx + 1).padStart(2, "0")
            const cardColor = brandColors[idx % brandColors.length]
            return (
              <li key={l.href} style={{ perspective: "1200px" }}>
                <Link
                  href={l.href}
                  className="group relative block h-56 w-full outline-none transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front card */}
                  <div
                    className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl p-6"
                    style={{
                      backgroundImage: "linear-gradient(135deg, color-mix(in oklch, var(--primary) 28%, white), color-mix(in oklch, var(--primary) 14%, white))",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-6xl font-bold leading-none text-primary/20">{num}</span>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in oklch, ${cardColor} 12%, transparent)`,
                          boxShadow: `0 6px 16px -4px color-mix(in oklch, ${cardColor} 45%, transparent)`,
                          color: cardColor,
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold tracking-tight text-neutral-900">{l.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-700">{l.description}</p>
                    </div>
                  </div>

                  {/* Back card */}
                  <div
                    className="step-card card-glow absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl bg-black p-6"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: "black",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-6xl font-bold leading-none text-white/10">{num}</span>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in oklch, ${cardColor} 12%, transparent)`,
                          boxShadow: `0 6px 16px -4px color-mix(in oklch, ${cardColor} 45%, transparent)`,
                          color: cardColor,
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold tracking-tight text-white">{l.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.description}</p>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }

  return (
    <section aria-labelledby="related-heading" className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
      <div className="mb-10">
        <h2 id="related-heading" className="text-balance text-4xl font-serif font-normal leading-[1.1] tracking-tight md:text-5xl text-white">
          {heading}
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex h-full flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card/30 p-5 transition-colors hover:border-primary/40 hover:bg-card/50"
            >
              <div>
                <p className="text-base font-medium tracking-tight group-hover:text-foreground">{l.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.description}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-primary">
                Read more
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
