"use client"

import type React from "react"

/**
 * Six visualisations for the UseCases showcase panel — one per tab
 * (Booking, Support, Leads, Follow-up, Order Updates, After-Hours). Each is
 * a different shape tied to its own theme, not the same plot recoloured:
 * every previous version of this panel reused one visual across all six
 * tabs (a bar waveform, then a dot ripple), which read as identical no
 * matter which case was active.
 *
 * Shared rules:
 * • Fixed h-9 (36px) row — swapping tabs never changes the panel height.
 * • Every element has a static box size; only transform/opacity animate
 *   (scaleY, translateY, translateX, rotate, ring-scale), so all six run on
 *   the compositor and none of them can reflow the card.
 * • Reduced-motion fallbacks come from the existing viz-* classes in
 *   globals.css, which already cover every primitive reused here.
 */

export type CaseVizKind = "calendar" | "equalizer" | "trend" | "ping" | "stream" | "radar"

const ROW = "relative flex h-9 w-full items-center"

/* ── 1 · Booking — calendar slot grid, one slot lit as "booked" ─────────── */

function CalendarGridViz({ tint, reduced }: { tint: string; reduced: boolean }) {
  const slots = Array.from({ length: 12 })
  const bookedIndex = 7
  return (
    <div className={`${ROW} justify-center gap-[5px]`} aria-hidden>
      <div className="grid grid-cols-6 grid-rows-2 gap-[5px]">
        {slots.map((_, i) => {
          const isBooked = i === bookedIndex
          return (
            <span
              key={i}
              className={!reduced && isBooked ? "viz-blink block h-[6px] w-[6px] rounded-[2px]" : "block h-[6px] w-[6px] rounded-[2px]"}
              style={
                {
                  background: isBooked ? tint : `${tint}35`,
                  boxShadow: isBooked ? `0 0 6px ${tint}` : "none",
                  "--viz-blink-duration": "1.8s",
                } as React.CSSProperties
              }
            />
          )
        })}
      </div>
    </div>
  )
}

/* ── 2 · Support — segmented equalizer meter ─────────────────────────────── */

function EqualizerViz({ tint, wave, reduced }: { tint: string; wave: readonly number[]; reduced: boolean }) {
  return (
    <div className={`${ROW} justify-center gap-[3px]`} aria-hidden>
      {wave.slice(0, 10).map((f, i) => (
        <span
          key={i}
          className={reduced ? "block w-[4px] rounded-[1px]" : "viz-bar block w-[4px] rounded-[1px]"}
          style={
            {
              height: 28,
              background: `linear-gradient(to top, ${tint}45, ${tint})`,
              maskImage: "repeating-linear-gradient(to top, #000 0px, #000 3px, transparent 3px, transparent 5px)",
              WebkitMaskImage: "repeating-linear-gradient(to top, #000 0px, #000 3px, transparent 3px, transparent 5px)",
              opacity: reduced ? 0.6 : undefined,
              "--viz-bar-origin": "bottom",
              "--viz-bar-min": 0.22,
              "--viz-bar-max": f,
              "--viz-bar-static": f * 0.6,
              "--viz-bar-duration": `${1.1 + (i % 4) * 0.18}s`,
              "--viz-bar-delay": `${(i % 6) * 0.09}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/* ── 3 · Leads — ascending qualification trend line ──────────────────────── */

function TrendLineViz({ tint, reduced }: { tint: string; reduced: boolean }) {
  const path = "M0 30 L26 24 L52 26 L78 15 L104 18 L130 6 L156 10"
  return (
    <div className={ROW} aria-hidden>
      <svg viewBox="0 0 156 34" preserveAspectRatio="none" className="h-full w-full">
        <path d={path} fill="none" stroke={tint} strokeOpacity="0.28" strokeWidth="1.5" />
        {!reduced && (
          <path
            className="viz-dash"
            d={path}
            pathLength={100}
            fill="none"
            stroke={tint}
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ "--viz-dash-duration": "2.4s" } as React.CSSProperties}
          />
        )}
        <circle className={reduced ? undefined : "viz-node"} cx="156" cy="10" r="3" fill={tint}
          style={{ "--viz-node-duration": "2s" } as React.CSSProperties} />
      </svg>
    </div>
  )
}

/* ── 4 · Follow-up — outbound ping, expanding rings from a source dot ────── */

function OutboundPingViz({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className={`${ROW} justify-center`} aria-hidden>
      <span className="relative flex h-9 w-9 items-center justify-center">
        {!reduced && [0, 1, 2].map((i) => (
          <span
            key={i}
            className="viz-ring absolute inset-0 rounded-full border"
            style={{ borderColor: tint, "--viz-ring-duration": "2.8s", "--viz-ring-delay": `${i * 0.9}s` } as React.CSSProperties}
          />
        ))}
        <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: tint, boxShadow: `0 0 8px ${tint}` }} />
      </span>
    </div>
  )
}

/* ── 5 · Order Updates — packets streaming along a delivery line ─────────── */

function PacketStreamViz({ tint, reduced }: { tint: string; reduced: boolean }) {
  const packets = [0, 1, 2, 3]
  return (
    <div className={`${ROW} overflow-hidden`} aria-hidden>
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2" style={{ background: `${tint}30` }} />
      <div className="relative h-full w-full overflow-hidden">
        {packets.map((i) => (
          <span
            key={i}
            className={reduced ? "absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-[2px]" : "hero-conveyor absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-[2px]"}
            style={
              {
                left: `${-10 + i * 6}%`,
                background: tint,
                boxShadow: `0 0 6px ${tint}`,
                opacity: reduced ? 0.7 : undefined,
                "--hero-conveyor-distance": "130px",
                "--hero-conveyor-duration": "3.6s",
                animationDelay: `${i * 0.9}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

/* ── 6 · After-Hours — radar sweep with surrounding night-watch dots ─────── */

function NightRadarViz({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className={`${ROW} justify-center gap-3`} aria-hidden>
      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full border" style={{ borderColor: `${tint}45` }}>
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: tint }} />
        {!reduced && (
          <span
            className="viz-radar absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${tint}00 0deg, ${tint}00 270deg, ${tint}70 350deg, ${tint}00 360deg)`,
              "--viz-radar-duration": "3.4s",
            } as React.CSSProperties}
          />
        )}
      </span>
      <span className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={reduced ? "block h-1.5 w-1.5 rounded-full" : "viz-blink block h-1.5 w-1.5 rounded-full"}
            style={{
              background: tint,
              boxShadow: `0 0 5px ${tint}`,
              opacity: reduced ? 0.7 : undefined,
              "--viz-blink-duration": `${1.6 + i * 0.3}s`,
              "--viz-blink-delay": `${i * 0.28}s`,
            } as React.CSSProperties}
          />
        ))}
      </span>
    </div>
  )
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

export const CASE_VIZ_LABEL: Record<CaseVizKind, string> = {
  calendar: "Calendar Sync",
  equalizer: "Support Throughput",
  trend: "Qualification Trend",
  ping: "Outbound Signal",
  stream: "Delivery Stream",
  radar: "Night Coverage",
}

export function CaseViz({
  kind, tint, wave, reduced,
}: { kind: CaseVizKind; tint: string; wave: readonly number[]; reduced: boolean }) {
  switch (kind) {
    case "calendar":
      return <CalendarGridViz tint={tint} reduced={reduced} />
    case "equalizer":
      return <EqualizerViz tint={tint} wave={wave} reduced={reduced} />
    case "trend":
      return <TrendLineViz tint={tint} reduced={reduced} />
    case "ping":
      return <OutboundPingViz tint={tint} reduced={reduced} />
    case "stream":
      return <PacketStreamViz tint={tint} reduced={reduced} />
    case "radar":
      return <NightRadarViz tint={tint} reduced={reduced} />
  }
}
