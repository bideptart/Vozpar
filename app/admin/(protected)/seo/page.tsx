import { Card } from "@/components/ui/card"
import { requireAdmin } from "@/lib/admin/auth"
import { getAuditedRegistry, type AuditedPage } from "@/lib/admin/seo-audit"
import { SerpPreview } from "@/components/admin/serp-preview"
import Link from "next/link"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

export const metadata = {
  title: "SEO Audit — Super-admin",
  robots: { index: false, follow: false },
}

export default async function SeoPage() {
  await requireAdmin()
  const { pages, totals } = getAuditedRegistry()

  // Group by section.
  const groups = new Map<AuditedPage["group"], AuditedPage[]>()
  for (const p of pages) {
    if (!groups.has(p.group)) groups.set(p.group, [])
    groups.get(p.group)!.push(p)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">SEO Audit</h1>
          <p className="text-sm text-muted-foreground">
            Every page&apos;s title, description, canonical, and indexability — with linting against duplicates and length thresholds.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/sitemap.xml"
            className="rounded-md border border-border/60 px-3 py-1.5 text-xs text-foreground/80 hover:border-primary/40 hover:text-foreground"
          >
            View sitemap.xml
          </Link>
          <Link
            href="/robots.txt"
            className="rounded-md border border-border/60 px-3 py-1.5 text-xs text-foreground/80 hover:border-primary/40 hover:text-foreground"
          >
            View robots.txt
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Pages</div>
          <div className="mt-1 text-2xl font-semibold">{totals.pages}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Indexable</div>
          <div className="mt-1 text-2xl font-semibold">{totals.indexable}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Errors</div>
          <div className="mt-1 text-2xl font-semibold text-rose-400">{totals.errors}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Warnings</div>
          <div className="mt-1 text-2xl font-semibold text-amber-400">{totals.warnings}</div>
        </Card>
      </div>

      {Array.from(groups.entries()).map(([group, list]) => (
        <Card key={group} className="overflow-hidden p-0">
          <div className="border-b border-border/40 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group} ({list.length})
          </div>
          <div className="divide-y divide-border/30">
            {list.map((p) => {
              const hasError = p.warnings.some((w) => w.level === "error")
              const hasWarn = p.warnings.some((w) => w.level === "warn")
              return (
                <div key={p.path} className="grid gap-4 p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {hasError ? (
                        <XCircle className="size-4 text-rose-400" aria-hidden />
                      ) : hasWarn ? (
                        <AlertTriangle className="size-4 text-amber-400" aria-hidden />
                      ) : (
                        <CheckCircle2 className="size-4 text-emerald-400" aria-hidden />
                      )}
                      <Link href={p.path} className="text-sm font-medium hover:text-primary" target="_blank">
                        {p.path}
                      </Link>
                      {!p.indexable && (
                        <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                          noindex
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-foreground/90">{p.title || "(missing)"}</div>
                    <div className="text-xs text-muted-foreground/90">{p.description || "(missing description)"}</div>
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-muted-foreground">
                      <span>Title: {p.titleLength} chars</span>
                      <span>Desc: {p.descLength} chars</span>
                      <span className="truncate">Canonical: {p.canonical}</span>
                    </div>
                    {p.warnings.length > 0 && (
                      <ul className="space-y-1 pt-1 text-[11px]">
                        {p.warnings.map((w, i) => (
                          <li
                            key={i}
                            className={
                              w.level === "error"
                                ? "text-rose-400"
                                : w.level === "warn"
                                ? "text-amber-400"
                                : "text-muted-foreground"
                            }
                          >
                            • {w.msg}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <SerpPreview title={p.title} description={p.description} path={p.path} />
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
