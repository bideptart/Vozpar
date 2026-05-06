import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

export type Range = "24h" | "7d" | "30d" | "90d"

export const RANGE_LABEL: Record<Range, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
}

const RANGE_DAYS: Record<Range, number> = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 }

function rangeStart(range: Range): Date {
  const d = new Date()
  if (range === "24h") d.setHours(d.getHours() - 24)
  else d.setDate(d.getDate() - RANGE_DAYS[range])
  return d
}

type RawPv = {
  visitor_id: string | null
  session_id: string | null
  path: string
  referrer: string | null
  ref_host: string | null
  source: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  country: string | null
  device: string | null
  browser: string | null
  os: string | null
  is_bot: boolean
  created_at: string
}

export type TrafficSummary = {
  range: Range
  totals: {
    pageviews: number
    visitors: number
    sessions: number
    botPageviews: number
  }
  series: { date: string; pageviews: number; visitors: number }[]
  topPages: { path: string; pageviews: number; visitors: number }[]
  sources: { source: string; pageviews: number; visitors: number }[]
  referrers: { ref_host: string; pageviews: number; visitors: number }[]
  campaigns: { utm_campaign: string; utm_source: string | null; utm_medium: string | null; pageviews: number }[]
  countries: { country: string; pageviews: number }[]
  devices: { device: string; pageviews: number }[]
  recent: {
    path: string
    source: string | null
    ref_host: string | null
    country: string | null
    device: string | null
    created_at: string
  }[]
}

export async function getTrafficSummary(range: Range = "30d"): Promise<TrafficSummary> {
  const supabase = createAdminClient()
  const since = rangeStart(range).toISOString()

  // Pull the window once. Soft cap at 50k to keep memory bounded.
  const { data } = await supabase
    .from("pageviews")
    .select(
      "visitor_id, session_id, path, referrer, ref_host, source, utm_source, utm_medium, utm_campaign, country, device, browser, os, is_bot, created_at",
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(50000)

  const all = (data ?? []) as RawPv[]
  const human = all.filter((p) => !p.is_bot)

  // Totals.
  const visitors = new Set(human.map((p) => p.visitor_id).filter(Boolean) as string[])
  const sessions = new Set(human.map((p) => p.session_id).filter(Boolean) as string[])
  const botPageviews = all.length - human.length

  // Time series — bucket by hour for 24h, by day for everything else.
  const series = buildSeries(human, range)

  // Top pages.
  const topPages = aggregate(human, (p) => p.path)
    .slice(0, 20)
    .map((r) => ({ path: r.key, pageviews: r.pageviews, visitors: r.visitors }))

  // Sources.
  const sources = aggregate(human, (p) => p.source ?? "direct")
    .slice(0, 10)
    .map((r) => ({ source: r.key, pageviews: r.pageviews, visitors: r.visitors }))

  // Referrers (only when set).
  const referrers = aggregate(
    human.filter((p) => p.ref_host),
    (p) => p.ref_host ?? "(none)",
  )
    .slice(0, 15)
    .map((r) => ({ ref_host: r.key, pageviews: r.pageviews, visitors: r.visitors }))

  // Campaigns.
  const campaignMap = new Map<string, { pageviews: number; utm_source: string | null; utm_medium: string | null }>()
  for (const p of human) {
    if (!p.utm_campaign) continue
    const cur = campaignMap.get(p.utm_campaign) ?? {
      pageviews: 0,
      utm_source: p.utm_source,
      utm_medium: p.utm_medium,
    }
    cur.pageviews += 1
    campaignMap.set(p.utm_campaign, cur)
  }
  const campaigns = Array.from(campaignMap.entries())
    .map(([utm_campaign, v]) => ({ utm_campaign, ...v }))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 10)

  // Countries.
  const countryMap = new Map<string, number>()
  for (const p of human) {
    if (!p.country) continue
    countryMap.set(p.country, (countryMap.get(p.country) ?? 0) + 1)
  }
  const countries = Array.from(countryMap.entries())
    .map(([country, pageviews]) => ({ country, pageviews }))
    .sort((a, b) => b.pageviews - a.pageviews)
    .slice(0, 10)

  // Devices.
  const deviceMap = new Map<string, number>()
  for (const p of human) {
    deviceMap.set(p.device ?? "unknown", (deviceMap.get(p.device ?? "unknown") ?? 0) + 1)
  }
  const devices = Array.from(deviceMap.entries())
    .map(([device, pageviews]) => ({ device, pageviews }))
    .sort((a, b) => b.pageviews - a.pageviews)

  // Recent live feed (last 50, newest first).
  const recent = human.slice(0, 50).map((p) => ({
    path: p.path,
    source: p.source,
    ref_host: p.ref_host,
    country: p.country,
    device: p.device,
    created_at: p.created_at,
  }))

  return {
    range,
    totals: {
      pageviews: human.length,
      visitors: visitors.size,
      sessions: sessions.size,
      botPageviews,
    },
    series,
    topPages,
    sources,
    referrers,
    campaigns,
    countries,
    devices,
    recent,
  }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function aggregate(rows: RawPv[], pick: (r: RawPv) => string) {
  const m = new Map<string, { pageviews: number; visitors: Set<string> }>()
  for (const r of rows) {
    const k = pick(r) || "(none)"
    const cur = m.get(k) ?? { pageviews: 0, visitors: new Set<string>() }
    cur.pageviews += 1
    if (r.visitor_id) cur.visitors.add(r.visitor_id)
    m.set(k, cur)
  }
  return Array.from(m.entries())
    .map(([key, v]) => ({ key, pageviews: v.pageviews, visitors: v.visitors.size }))
    .sort((a, b) => b.pageviews - a.pageviews)
}

function buildSeries(rows: RawPv[], range: Range): { date: string; pageviews: number; visitors: number }[] {
  const isHourly = range === "24h"
  const now = new Date()
  const buckets = new Map<string, { pv: number; visitors: Set<string> }>()
  const keys: string[] = []

  if (isHourly) {
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3_600_000)
      const key = d.toISOString().slice(0, 13) + ":00"
      keys.push(key)
      buckets.set(key, { pv: 0, visitors: new Set<string>() })
    }
  } else {
    const days = RANGE_DAYS[range]
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86_400_000)
      const key = d.toISOString().slice(0, 10)
      keys.push(key)
      buckets.set(key, { pv: 0, visitors: new Set<string>() })
    }
  }

  for (const r of rows) {
    const key = isHourly ? r.created_at.slice(0, 13) + ":00" : r.created_at.slice(0, 10)
    const b = buckets.get(key)
    if (!b) continue
    b.pv += 1
    if (r.visitor_id) b.visitors.add(r.visitor_id)
  }

  return keys.map((k) => ({
    date: k,
    pageviews: buckets.get(k)!.pv,
    visitors: buckets.get(k)!.visitors.size,
  }))
}
