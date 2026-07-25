"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const SESSION_KEY = "_vozpar_session"

// crypto.randomUUID() only exists in secure contexts (HTTPS or localhost).
// Loading the site over plain HTTP via a LAN IP (e.g. http://192.168.x.x)
// is an insecure context, so this falls back to crypto.getRandomValues()
// (available everywhere) and finally to Math.random() for very old browsers.
function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 24)
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(12))
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
  }
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

function getOrCreateSession(): string {
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(new RegExp("(?:^|; )" + SESSION_KEY + "=([^;]+)"))
  if (match?.[1]) return match[1]
  const id = generateId()
  // 30 minutes idle session
  document.cookie = `${SESSION_KEY}=${id}; path=/; max-age=${30 * 60}; samesite=lax`
  return id
}

function bumpSession(id: string) {
  document.cookie = `${SESSION_KEY}=${id}; path=/; max-age=${30 * 60}; samesite=lax`
}

/**
 * First-party pageview tracker. Mounted once in the root layout. Sends a
 * single beacon per pathname change (de-duped against StrictMode double
 * effects).
 */
export function PageviewTracker() {
  const pathname = usePathname()
  const search = useSearchParams()
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return

    // Skip admin and auth pages.
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.startsWith("/api")) {
      return
    }

    const key = `${pathname}?${search?.toString() ?? ""}`
    if (lastSent.current === key) return
    lastSent.current = key

    const session_id = getOrCreateSession()
    bumpSession(session_id)

    const utm = {
      source: search?.get("utm_source") ?? undefined,
      medium: search?.get("utm_medium") ?? undefined,
      campaign: search?.get("utm_campaign") ?? undefined,
      term: search?.get("utm_term") ?? undefined,
      content: search?.get("utm_content") ?? undefined,
    }

    const payload = JSON.stringify({
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      utm,
      session_id,
    })

    try {
      // sendBeacon is best for unload-safe delivery; falls back to fetch.
      const blob = new Blob([payload], { type: "application/json" })
      const ok = typeof navigator !== "undefined" && navigator.sendBeacon?.("/api/track/pageview", blob)
      if (!ok) {
        void fetch("/api/track/pageview", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        })
      }
    } catch {
      // never break the app for analytics
    }
  }, [pathname, search])

  return null
}
