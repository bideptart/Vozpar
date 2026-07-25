import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, MessageSquareQuote, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/animation/scroll-reveal"
import { INDUSTRIES, getIndustry } from "@/lib/industries"
import { pageSeo } from "@/lib/seo"
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/jsonld"
import { RelatedLinks } from "@/components/seo/related-links"

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) return {}

  return pageSeo({
    title: `AI voice agents for ${industry.name.toLowerCase()}`,
    description: industry.short,
    path: `/industries/${industry.slug}`,
  })
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) notFound()

  const Icon = industry.icon

  // Pick three sibling industries for the related-links module.
  const related = INDUSTRIES.filter((i) => i.slug !== industry.slug).slice(0, 3)

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${industry.slug}` },
        ]}
      />
      <ServiceJsonLd
        name={`AI voice agents for ${industry.name.toLowerCase()}`}
        description={industry.pitch}
        path={`/industries/${industry.slug}`}
        serviceType="AI voice agent"
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(220,38,38,0.10),transparent_70%)]"
        />
        <div className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6 md:py-24">
          <ScrollReveal>
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/industries" className="hover:text-foreground">
                    Industries
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">{industry.name}</li>
              </ol>
            </nav>

            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Icon className="size-3.5 text-primary" aria-hidden />
              {industry.name}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
              AI voice agents for {industry.name.toLowerCase()}.
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {industry.pitch}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/get-started?industry=${industry.slug}`}>
                  Get started <ArrowRight className="ml-1 size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What it does */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <ScrollReveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              What the agent does on day one
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Pre-built playbooks tuned for {industry.name.toLowerCase()} workflows. Every action below works out of the
              box; you can fine-tune them, add new ones, and wire them into your existing tools without writing code.
            </p>
            <ul className="mt-8 space-y-4">
              {industry.jobs.map((job) => (
                <li key={job} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span className="text-pretty leading-relaxed">{job}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              How the agent actually sounds
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Real lines our voice agents have used in {industry.name.toLowerCase()} deployments. Every word is
              generated in real time with sub-second latency, real interruptions, and natural emotion.
            </p>
            <ul className="mt-8 space-y-4">
              {industry.sampleLines.map((line, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-border/60 bg-card/30 p-4"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquareQuote className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <p className="text-pretty leading-relaxed">{line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Why teams switch */}
      <section className="border-y border-border/50 bg-card/20">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6 md:py-20">
          <ScrollReveal className="grid gap-8 md:grid-cols-3">
            <Stat
              label="First-touch response"
              value="< 3 seconds"
              sub={`Every ${industry.name.toLowerCase()} call answered before it goes to voicemail.`}
            />
            <Stat
              label="Concurrent calls"
              value="Up to 3"
              sub="On the Scale plan — no extra hardware, no extra licenses."
            />
            <Stat
              label="Per-minute rate"
              value="From $0.10"
              sub="See the full rate card on the pricing page."
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Internal contextual links */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6 md:py-20">
        <ScrollReveal>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            How {industry.name.toLowerCase()} teams roll out Vozpar
          </h2>
          <div className="mt-6 grid gap-4 text-sm leading-relaxed text-muted-foreground md:grid-cols-2 md:text-base">
            <p className="text-pretty">
              Most {industry.name.toLowerCase()} customers start by{" "}
              <Link href="/get-started" className="text-primary underline-offset-4 hover:underline">
                spinning up a Starter agent
              </Link>{" "}
              with a single phone number, then upgrade to{" "}
              <Link href="/pricing" className="text-primary underline-offset-4 hover:underline">
                Growth or Scale
              </Link>{" "}
              once the inbound and outbound playbooks prove out.
            </p>
            <p className="text-pretty">
              Curious about voice credit, phone numbers, or compliance? The{" "}
              <Link href="/faq" className="text-primary underline-offset-4 hover:underline">
                FAQ
              </Link>{" "}
              answers the questions {industry.name.toLowerCase()} ops teams ask most — and you can browse{" "}
              <Link href="/industries" className="text-primary underline-offset-4 hover:underline">
                every other industry
              </Link>{" "}
              we support to compare playbooks.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={`/get-started?industry=${industry.slug}`}>Launch a {industry.name.toLowerCase()} agent</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/faq">Read the FAQ</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <RelatedLinks
        heading="Other industries we power"
        description="Pre-tuned playbooks for the calls your peers in adjacent verticals already automate."
        links={[
          ...related.map((r) => ({
            href: `/industries/${r.slug}`,
            title: `AI voice agents for ${r.name.toLowerCase()}`,
            description: r.short,
          })),
          {
            href: "/pricing",
            title: "Compare plans and per-minute rates",
            description: "Three tiers from $20 to $100, with rates from $0.15 down to $0.10/min.",
          },
          {
            href: "/faq",
            title: "FAQ — credit, phone numbers, compliance",
            description: "60-day credit validity, monthly DID billing, HIPAA, TCPA, and more.",
          },
        ]}
      />

      <SiteFooter />
    </main>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Sparkles className="size-4 text-primary" aria-hidden />
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  )
}
