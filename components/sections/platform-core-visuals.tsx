"use client"

import type React from "react"
import type { LucideIcon } from "lucide-react"

/**
 * Three architecture diagrams for the PlatformCore panel — one per tab
 * (Real-time Execution, Carrier Independence, 100% Data Sovereignty). The
 * previous version rendered the exact same hub-and-3-spoke radial diagram
 * for all three tabs and just swapped colours/icons; the topology itself
 * never changed. Each tab now gets a layout that actually matches what it's
 * describing:
 *
 *   • Real-time Execution → a hub reaching out to 3 systems at once (radial —
 *     this one legitimately fits "acts on everything simultaneously").
 *   • Carrier Independence → a left-to-right signal relay (linear — audio
 *     flows from a carrier, through the trunk, into Vozpar).
 *   • 100% Data Sovereignty → a sealed perimeter around a central vault
 *     (containment — nothing radiates outward, which is the whole point).
 *
 * All motion is transform/opacity on the existing viz-* / hero-conveyor
 * primitives — compositor-only, reduced-motion covered.
 */

export type ArchKind = "hub" | "relay" | "vault"

type Node = { label: string; icon: LucideIcon }

const PANEL = "relative h-[220px] w-full overflow-hidden sm:h-[240px]"

/* ── 1 · Real-time Execution — radial hub, 3 systems called simultaneously ── */

const HUB_CANVAS = { w: 400, h: 230 }
const HUB_POS = { x: 200, y: 118 }
const HUB_NODE_POS = [
  { x: 62, y: 40 },
  { x: 338, y: 40 },
  { x: 200, y: 202 },
] as const

const pct = (v: number, total: number) => `${(v / total) * 100}%`

export function HubExecutionViz({ tint, icon: Icon, nodes, reduced }: { tint: string; icon: LucideIcon; nodes: readonly Node[]; reduced: boolean }) {
  return (
    <div className={PANEL}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: tint, opacity: 0.16 }} />

      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${HUB_CANVAS.w} ${HUB_CANVAS.h}`} preserveAspectRatio="none" aria-hidden>
        {HUB_NODE_POS.map((n, i) => (
          <g key={i}>
            <line x1={HUB_POS.x} y1={HUB_POS.y} x2={n.x} y2={n.y} stroke="white" strokeOpacity="0.07" strokeWidth="1.5" />
            {!reduced && (
              <line className="viz-dash" pathLength={100} x1={HUB_POS.x} y1={HUB_POS.y} x2={n.x} y2={n.y}
                stroke={tint} strokeWidth="1.6" strokeLinecap="round"
                style={{ "--viz-dash-duration": `${1.6 + i * 0.3}s`, "--viz-dash-delay": `${i * 0.25}s` } as React.CSSProperties} />
            )}
          </g>
        ))}
      </svg>

      <div className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border backdrop-blur-md"
        style={{
          left: pct(HUB_POS.x, HUB_CANVAS.w), top: pct(HUB_POS.y, HUB_CANVAS.h),
          borderColor: `${tint}55`,
          background: `linear-gradient(155deg, ${tint}30, rgba(0,0,0,0.75))`,
          boxShadow: `0 0 30px -6px ${tint}80`,
        }}>
        <Icon className="h-5 w-5" style={{ color: tint }} />
        <span className="absolute -bottom-2 flex items-center gap-1 rounded-full bg-emerald-500 px-1.5 py-[1px] font-mono text-[7px] font-bold uppercase text-black">Live</span>
      </div>

      {HUB_NODE_POS.map((pos, i) => {
        const node = nodes[i]
        const NodeIcon = node.icon
        return (
          <div key={node.label}
            className="absolute w-[112px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-left backdrop-blur-md transition-transform duration-300 hover:scale-[1.06] hover:border-white/25 sm:w-[130px]"
            style={{ left: pct(pos.x, HUB_CANVAS.w), top: pct(pos.y, HUB_CANVAS.h) }}>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                style={{ borderColor: `${tint}35`, background: `${tint}18`, color: tint }}>
                <NodeIcon className="h-3 w-3" />
              </span>
              <span className="truncate font-mono text-[9px] font-medium text-white/75">{node.label}</span>
              <span className={reduced ? "relative ml-auto block h-1.5 w-1.5 shrink-0 rounded-full" : "viz-blink relative ml-auto block h-1.5 w-1.5 shrink-0 rounded-full"}
                style={{ background: tint, boxShadow: `0 0 5px ${tint}`, "--viz-blink-duration": `${1.8 + i * 0.3}s` } as React.CSSProperties} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── 2 · Carrier Independence — linear relay, left carriers → right trunk ─── */

export function CarrierRelayViz({ tint, icon: Icon, nodes, reduced }: { tint: string; icon: LucideIcon; nodes: readonly Node[]; reduced: boolean }) {
  const rowY = [22, 50, 78] // % positions for the 3 carrier badges, top to bottom
  return (
    <div className={PANEL}>
      <div aria-hidden className="pointer-events-none absolute left-[18%] top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: tint, opacity: 0.14 }} />

      {/* Trunk line the three carriers all feed into, running to the hub on the right. */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 230" preserveAspectRatio="none" aria-hidden>
        {rowY.map((y, i) => (
          <path key={i} d={`M92 ${y * 2.3} H180 Q198 ${y * 2.3} 198 115 H310`} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="1.5" />
        ))}
        {!reduced && rowY.map((y, i) => (
          <path key={i} className="viz-dash" pathLength={100} d={`M92 ${y * 2.3} H180 Q198 ${y * 2.3} 198 115 H310`}
            fill="none" stroke={tint} strokeWidth="1.6" strokeLinecap="round"
            style={{ "--viz-dash-duration": `${2 + i * 0.35}s`, "--viz-dash-delay": `${i * 0.3}s` } as React.CSSProperties} />
        ))}
      </svg>

      {/* Carrier badges, stacked on the left. */}
      {nodes.map((node, i) => {
        const NodeIcon = node.icon
        return (
          <div key={node.label}
            className="absolute left-[10%] w-[104px] -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-left backdrop-blur-md transition-transform duration-300 hover:scale-[1.06] hover:border-white/25 sm:w-[118px]"
            style={{ top: `${rowY[i]}%` }}>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                style={{ borderColor: `${tint}35`, background: `${tint}18`, color: tint }}>
                <NodeIcon className="h-3 w-3" />
              </span>
              <span className="truncate font-mono text-[9px] font-medium text-white/75">{node.label}</span>
            </div>
          </div>
        )
      })}

      {/* Destination hub — the Vozpar audio pipeline, right-aligned. */}
      <div className="absolute right-[8%] top-1/2 flex h-16 w-16 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border backdrop-blur-md"
        style={{
          borderColor: `${tint}55`,
          background: `linear-gradient(155deg, ${tint}30, rgba(0,0,0,0.75))`,
          boxShadow: `0 0 30px -6px ${tint}80`,
        }}>
        <Icon className="h-5 w-5" style={{ color: tint }} />
        <span className="absolute -bottom-2 flex items-center gap-1 rounded-full bg-emerald-500 px-1.5 py-[1px] font-mono text-[7px] font-bold uppercase text-black">Live</span>
      </div>

      {/* Small pulses travelling the trunk toward the hub. */}
      {!reduced && (
        <div className="absolute inset-y-0 left-[46%] w-[30%] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <span key={i} className="hero-conveyor absolute top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full"
              style={{
                left: 0, background: tint, boxShadow: `0 0 6px ${tint}`,
                "--hero-conveyor-distance": "110px", "--hero-conveyor-duration": "2.6s",
                animationDelay: `${i * 0.85}s`,
              } as React.CSSProperties} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── 3 · 100% Data Sovereignty — sealed perimeter around a central vault ──── */

export function SecurityVaultViz({ icon: Icon, tint, nodes, reduced }: { tint: string; icon: LucideIcon; nodes: readonly Node[]; reduced: boolean }) {
  const badgePos = [
    { x: 78, y: 24 },
    { x: 322, y: 24 },
    { x: 200, y: 206 },
  ]
  return (
    <div className={PANEL}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: tint, opacity: 0.14 }} />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 230" preserveAspectRatio="none" aria-hidden>
        {/* Sealed boundary — a dashed perimeter, nothing crosses it. */}
        <rect x="30" y="18" width="340" height="194" rx="26" fill="none" stroke={`${tint}55`} strokeWidth="1.5" strokeDasharray="7 7" />
        {/* Short connectors from each badge into the central vault. */}
        {badgePos.map((p, i) => (
          <line key={i} x1={p.x} y1={p.y} x2={200} y2={115} stroke="white" strokeOpacity="0.08" strokeWidth="1.5" />
        ))}
        {!reduced && badgePos.map((p, i) => (
          <line key={i} className="viz-dash" pathLength={100} x1={p.x} y1={p.y} x2={200} y2={115}
            stroke={tint} strokeWidth="1.6" strokeLinecap="round"
            style={{ "--viz-dash-duration": `${2.2 + i * 0.3}s`, "--viz-dash-delay": `${i * 0.3}s` } as React.CSSProperties} />
        ))}
        {/* Blocked external access — a small rejected ping just outside the
            perimeter, the visual counterpart of "External data: 0 bytes". */}
        <g transform="translate(370, 18)">
          <circle r="7" fill="none" stroke="#f43f5e" strokeOpacity="0.5" strokeWidth="1.3" />
          <path d="M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5" stroke="#f43f5e" strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      </svg>

      {/* Central vault. */}
      <div className="absolute flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl border backdrop-blur-md"
        style={{
          left: "50%", top: "50%",
          borderColor: `${tint}55`,
          background: `linear-gradient(155deg, ${tint}30, rgba(0,0,0,0.8))`,
          boxShadow: `0 0 34px -6px ${tint}80`,
        }}>
        <Icon className="h-5 w-5" style={{ color: tint }} />
        <span className="absolute -bottom-2 flex items-center gap-1 rounded-full bg-emerald-500 px-1.5 py-[1px] font-mono text-[7px] font-bold uppercase text-black">Sealed</span>
      </div>

      {badgePos.map((pos, i) => {
        const node = nodes[i]
        const NodeIcon = node.icon
        return (
          <div key={node.label}
            className="absolute w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-left backdrop-blur-md transition-transform duration-300 hover:scale-[1.06] hover:border-white/25 sm:w-[118px]"
            style={{ left: pct(pos.x, 400), top: pct(pos.y, 230) }}>
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border"
                style={{ borderColor: `${tint}35`, background: `${tint}18`, color: tint }}>
                <NodeIcon className="h-3 w-3" />
              </span>
              <span className="truncate font-mono text-[9px] font-medium text-white/75">{node.label}</span>
              <span className={reduced ? "relative ml-auto block h-1.5 w-1.5 shrink-0 rounded-full" : "viz-blink relative ml-auto block h-1.5 w-1.5 shrink-0 rounded-full"}
                style={{ background: tint, boxShadow: `0 0 5px ${tint}`, "--viz-blink-duration": `${1.8 + i * 0.3}s` } as React.CSSProperties} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

export function ArchitectureViz({
  kind, icon, tint, nodes, reduced,
}: { kind: ArchKind; icon: LucideIcon; tint: string; nodes: readonly Node[]; reduced: boolean }) {
  switch (kind) {
    case "hub":
      return <HubExecutionViz icon={icon} tint={tint} nodes={nodes} reduced={reduced} />
    case "relay":
      return <CarrierRelayViz icon={icon} tint={tint} nodes={nodes} reduced={reduced} />
    case "vault":
      return <SecurityVaultViz icon={icon} tint={tint} nodes={nodes} reduced={reduced} />
  }
}
