/**
 * Lightweight parsers used by the /api/track/pageview endpoint.
 *
 * Intentionally regex-only (no UA-parser dependency) so it stays small,
 * runs on the edge / any Node host, and never trips on dependency drift.
 */

const SEARCH_HOSTS = [
  /(^|\.)google\./,
  /(^|\.)bing\./,
  /(^|\.)duckduckgo\./,
  /(^|\.)yahoo\./,
  /(^|\.)yandex\./,
  /(^|\.)baidu\./,
  /(^|\.)ecosia\./,
  /(^|\.)brave\.com/,
  /(^|\.)kagi\.com/,
]
const SOCIAL_HOSTS = [
  /(^|\.)facebook\./,
  /(^|\.)fb\.com/,
  /(^|\.)instagram\./,
  /(^|\.)x\.com/,
  /(^|\.)twitter\./,
  /(^|\.)t\.co/,
  /(^|\.)linkedin\./,
  /(^|\.)reddit\./,
  /(^|\.)tiktok\./,
  /(^|\.)pinterest\./,
  /(^|\.)youtube\./,
  /(^|\.)threads\./,
]
const EMAIL_HOSTS = [/(^|\.)mailchimp\./, /(^|\.)substack\./, /^mail\./, /^em\./]

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|preview|monitor|axios|curl|wget|httpie|python-requests|node-fetch|undici|googlebot|adsbot|gptbot|claudebot|amazonbot/i

export type Source = "organic" | "paid" | "social" | "referral" | "email" | "direct"

export function classify(referrer: string | null | undefined, utm: { medium?: string; source?: string }): {
  source: Source
  refHost: string | null
} {
  // UTM medium wins.
  const medium = utm.medium?.toLowerCase() ?? ""
  if (medium === "cpc" || medium === "ppc" || medium === "paid" || medium === "ads") {
    return { source: "paid", refHost: hostOf(referrer) }
  }
  if (medium === "email" || medium === "newsletter") return { source: "email", refHost: hostOf(referrer) }
  if (medium === "social") return { source: "social", refHost: hostOf(referrer) }
  if (medium === "organic") return { source: "organic", refHost: hostOf(referrer) }

  if (!referrer) return { source: "direct", refHost: null }

  let host: string | null = null
  try {
    host = new URL(referrer).hostname.toLowerCase()
  } catch {
    return { source: "direct", refHost: null }
  }
  if (!host) return { source: "direct", refHost: null }

  if (SEARCH_HOSTS.some((re) => re.test(host!))) return { source: "organic", refHost: shortHost(host) }
  if (SOCIAL_HOSTS.some((re) => re.test(host!))) return { source: "social", refHost: shortHost(host) }
  if (EMAIL_HOSTS.some((re) => re.test(host!))) return { source: "email", refHost: shortHost(host) }
  return { source: "referral", refHost: shortHost(host) }
}

export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return shortHost(new URL(url).hostname.toLowerCase())
  } catch {
    return null
  }
}

function shortHost(host: string): string {
  // Strip leading "www." and a few common subdomains for cleaner grouping.
  return host.replace(/^www\./, "").replace(/^m\./, "").replace(/^l\./, "")
}

export function isBotUA(ua: string | null | undefined): boolean {
  if (!ua) return false
  return BOT_RE.test(ua)
}

export function deviceOf(ua: string | null | undefined): "mobile" | "tablet" | "desktop" {
  if (!ua) return "desktop"
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet"
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile"
  return "desktop"
}

export function browserOf(ua: string | null | undefined): string {
  if (!ua) return "unknown"
  if (/Edg\//i.test(ua)) return "Edge"
  if (/OPR\//i.test(ua)) return "Opera"
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome"
  if (/Firefox\//i.test(ua)) return "Firefox"
  if (/Safari\//i.test(ua)) return "Safari"
  return "Other"
}

export function osOf(ua: string | null | undefined): string {
  if (!ua) return "unknown"
  if (/Windows NT/i.test(ua)) return "Windows"
  if (/Mac OS X|Macintosh/i.test(ua)) return "macOS"
  if (/Android/i.test(ua)) return "Android"
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS"
  if (/Linux/i.test(ua)) return "Linux"
  return "Other"
}
