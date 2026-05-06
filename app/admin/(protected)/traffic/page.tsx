import { Card } from "@/components/ui/card"
import { requireAdmin } from "@/lib/admin/auth"
import { getTrafficSummary, RANGE_LABEL, type Range } from "@/lib/admin/analytics"
import { TrafficChart } from "@/components/admin/traffic-chart"
import Link from "next/link"

export const metadata = {
  title: "Traffic Analytics — Super-admin",
  robots: { index: false, follow: false },
}

export default async function TrafficPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  await requireAdmin()
  const { range: r } = await searchParams
  const range = (r === "24h" || r === "7d" || r === "30d" || r === "90d" ? r : "30d") as Range
  const data = await getTrafficSummary(range)

  return (
    <div className="space-y-6">
      {/* Header + range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Traffic Analytics</h1>
          <p className="text-sm text-muted-foreground">First-party pageview tracking (no third-party scripts)</p>
        </div>
        <div className="flex gap-1.5">
          {(["24h", "7d", "30d", "90d"] as Range[]).map((r) => (
            <Link
              key={r}
              href={`/admin/traffic?range=${r}`}
              className={`rounded-md px-3 py-1.5 text-xs ${
                r === range
                  ? "bg-accent/15 text-foreground"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {RANGE_LABEL[r]}
            </Link>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Pageviews</div>
          <div className="mt-1 text-2xl font-semibold">{data.totals.pageviews.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Visitors</div>
          <div className="mt-1 text-2xl font-semibold">{data.totals.visitors.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Sessions</div>
          <div className="mt-1 text-2xl font-semibold">{data.totals.sessions.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Bot pageviews (filtered)</div>
          <div className="mt-1 text-2xl font-semibold">{data.totals.botPageviews.toLocaleString()}</div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4">
        <div className="mb-2 text-xs font-medium text-muted-foreground">Pageviews & Visitors</div>
        <TrafficChart data={data.series} range={range} />
      </Card>

      {/* Tables grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top pages */}
        <Card className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">Top pages</div>
          <div className="space-y-1.5">
            {data.topPages.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="truncate text-foreground/90">{r.path}</div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span>{r.pageviews.toLocaleString()} views</span>
                  <span className="text-[10px]">{r.visitors} uniq</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sources */}
        <Card className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">Traffic sources</div>
          <div className="space-y-1.5">
            {data.sources.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="capitalize text-foreground/90">{r.source}</div>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span>{r.pageviews.toLocaleString()} views</span>
                  <span className="text-[10px]">{r.visitors} uniq</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Referrers */}
        <Card className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">Top referrers</div>
          <div className="space-y-1.5">
            {data.referrers.length ? (
              data.referrers.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="truncate text-foreground/90">{r.ref_host}</div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <span>{r.pageviews.toLocaleString()} views</span>
                    <span className="text-[10px]">{r.visitors} uniq</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground/70">No external referrers yet</div>
            )}
          </div>
        </Card>

        {/* Countries */}
        <Card className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">Countries</div>
          <div className="space-y-1.5">
            {data.countries.length ? (
              data.countries.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="uppercase text-foreground/90">{r.country}</div>
                  <div className="text-xs text-muted-foreground">{r.pageviews.toLocaleString()} views</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground/70">No country data captured</div>
            )}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">Devices</div>
          <div className="space-y-1.5">
            {data.devices.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="capitalize text-foreground/90">{r.device}</div>
                <div className="text-xs text-muted-foreground">{r.pageviews.toLocaleString()} views</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Campaigns */}
        <Card className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">Campaigns (utm_campaign)</div>
          <div className="space-y-1.5">
            {data.campaigns.length ? (
              data.campaigns.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="truncate text-foreground/90">{r.utm_campaign}</div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    <span>{r.utm_source ?? "(no source)"}</span>
                    <span>{r.pageviews.toLocaleString()} views</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground/70">No utm_campaign traffic yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Live feed */}
      <Card className="p-4">
        <div className="mb-3 text-xs font-medium text-muted-foreground">Recent pageviews (last 50)</div>
        <div className="space-y-1">
          {data.recent.map((r, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border/30 py-1.5 text-[11px]">
              <div className="truncate text-foreground/80">{r.path}</div>
              <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
                {r.source && <span className="capitalize">{r.source}</span>}
                {r.ref_host && <span className="text-[10px]">{r.ref_host}</span>}
                {r.country && <span className="uppercase">{r.country}</span>}
                {r.device && <span className="capitalize">{r.device}</span>}
                <span className="text-[10px] text-muted-foreground/60">
                  {new Date(r.created_at).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
