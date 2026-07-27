"use client"

import type React from "react"

/**
 * Six visually distinct feature-card visualisations.
 *
 * Rules that apply to all of them:
 * • Fixed 52px strip, full width — every card's plot occupies identical space,
 *   so the six cards stay perfectly aligned on a row.
 * • Motion is CSS-keyframe driven (see the viz-* block in globals.css) and
 *   restricted to transform/opacity, so all six loops run on the compositor.
 *   Notably the bar plots use scaleY rather than animated height — height
 *   would force a layout pass per bar per frame.
 * • Nothing here translates the card. The card box is fixed; only the plot
 *   internals move.
 */

export type VizKind = "waveform" | "nodes" | "meter" | "signal" | "iot" | "shield"

const STRIP = "relative h-[52px] w-full"

/* ── 1 · AI waveform ─────────────────────────────────────────────────────── */

const WAVE_BARS = [
  0.34, 0.62, 0.45, 0.88, 0.54, 1, 0.48, 0.76, 0.4, 0.92, 0.58, 0.8, 0.44, 0.7, 0.36, 0.64, 0.5, 0.82,
]

function WaveformViz({ tint }: { tint: string }) {
  return (
    <div className={`${STRIP} flex items-center gap-[3px]`} aria-hidden>
      {WAVE_BARS.map((f, i) => (
        <span
          key={i}
          className="viz-bar block flex-1 rounded-full"
          style={
            {
              height: `${f * 44}px`,
              background: `linear-gradient(to top, ${tint}00, ${tint}, ${tint}55)`,
              "--viz-bar-min": 0.28,
              "--viz-bar-max": 1,
              "--viz-bar-static": 0.7,
              "--viz-bar-duration": `${2.4 + (i % 5) * 0.28}s`,
              "--viz-bar-delay": `${(i % 9) * 0.12}s`,
            } as React.CSSProperties
          }
        />
      ))}
      {/* Centre axis */}
      <span
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
        style={{ background: `linear-gradient(90deg, transparent, ${tint}30, transparent)` }}
      />
    </div>
  )
}

/* ── 2 · Network nodes ───────────────────────────────────────────────────── */

const NET_NODES = [
  { x: 12, y: 26 },
  { x: 58, y: 11 },
  { x: 58, y: 41 },
  { x: 104, y: 26 },
  { x: 150, y: 13 },
  { x: 150, y: 39 },
  { x: 192, y: 26 },
]
const NET_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
]

function NodesViz({ tint }: { tint: string }) {
  return (
    <div className={STRIP} aria-hidden>
      {/* xMidYMid meet (not "none") — "none" stretches the 204:52 viewBox to
          the strip's actual ~4.8:1 aspect, which turns every circular node
          into a visible ellipse. */}
      <svg viewBox="0 0 204 52" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
        <g stroke={tint} strokeOpacity="0.28" strokeWidth="1">
          {NET_EDGES.map(([a, b], i) => (
            <line key={i} x1={NET_NODES[a].x} y1={NET_NODES[a].y} x2={NET_NODES[b].x} y2={NET_NODES[b].y} />
          ))}
        </g>
        <g stroke={tint} strokeWidth="1.8" strokeLinecap="round" fill="none">
          {[NET_EDGES[0], NET_EDGES[3], NET_EDGES[6]].map(([a, b], i) => (
            <line
              key={i}
              className="viz-dash"
              pathLength={100}
              x1={NET_NODES[a].x}
              y1={NET_NODES[a].y}
              x2={NET_NODES[b].x}
              y2={NET_NODES[b].y}
              style={
                {
                  "--viz-dash-duration": `${2.6 + i * 0.7}s`,
                  "--viz-dash-delay": `${i * 0.8}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
        <g fill={tint}>
          {NET_NODES.map((n, i) => (
            <circle
              key={i}
              className="viz-node"
              cx={n.x}
              cy={n.y}
              r="2.6"
              style={
                {
                  "--viz-node-duration": `${2.4 + (i % 4) * 0.6}s`,
                  "--viz-node-delay": `${(i % 5) * 0.35}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

/* ── 3 · Spectrum analyzer (segmented LED meter) ─────────────────────────────
   Deliberately NOT another row of continuous bars — WaveformViz already owns
   that shape. Each column here is a stack of discrete lit/unlit blocks (real
   VU-meter language), rendered as a repeating-gradient mask over a scaleY
   bar, plus a peak-hold dot that spikes up and decays independently — a
   third animation primitive (viz-peak) no other card uses. Columns are also
   grouped in narrow clusters with visible gaps rather than edge-to-edge,
   so the layout silhouette reads differently from WaveformViz at a glance. */

const METER_COLS = [0.35, 0.62, 0.48, 0.8, 0.58, 0.92, 0.4, 0.7, 0.52, 0.86, 0.44, 0.66]

function SpectrumMeterViz({ tint }: { tint: string }) {
  return (
    <div className={`${STRIP} flex items-end gap-[3px]`} aria-hidden>
      {METER_COLS.map((f, i) => (
        <div key={i} className="relative flex h-full flex-1 items-end justify-center">
          {/* Segmented column: a scaleY bar with a repeating gap mask, so it
              reads as ~6 stacked LED blocks rather than one solid bar. */}
          <span
            className="viz-bar block h-full w-[70%] rounded-[1px]"
            style={
              {
                background: `linear-gradient(to top, ${tint}45 0%, ${tint} 55%, #ffffff 100%)`,
                maskImage: "repeating-linear-gradient(to top, #000 0px, #000 4px, transparent 4px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to top, #000 0px, #000 4px, transparent 4px, transparent 6px)",
                "--viz-bar-origin": "bottom",
                "--viz-bar-min": 0.28,
                "--viz-bar-max": f,
                "--viz-bar-static": Math.max(0.3, f * 0.7),
                "--viz-bar-duration": `${1.5 + (i % 5) * 0.22}s`,
                "--viz-bar-delay": `${(i % 7) * 0.11}s`,
              } as React.CSSProperties
            }
          />
          {/* Peak-hold dot — spikes to this column's ceiling then decays,
              independent of the column's own rhythm. */}
          <span
            className="viz-peak absolute bottom-0 h-[3px] w-[70%] rounded-[1px]"
            style={
              {
                background: "#ffffff",
                boxShadow: `0 0 6px ${tint}`,
                "--viz-peak-height": `${f * 44}px`,
                "--viz-peak-duration": `${2.1 + (i % 4) * 0.35}s`,
                "--viz-peak-delay": `${(i % 6) * 0.24}s`,
              } as React.CSSProperties
            }
          />
        </div>
      ))}
      {/* Baseline */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ background: `${tint}38` }} />
    </div>
  )
}

/* ── 4 · Digital signal ──────────────────────────────────────────────────── */

const SIGNAL_PATH =
  "M0 40 H18 V14 H38 V40 H56 V22 H80 V40 H98 V10 H122 V40 H142 V26 H164 V40 H186 V18 H204"

function SignalViz({ tint }: { tint: string }) {
  return (
    <div className={`${STRIP} overflow-hidden`} aria-hidden>
      {/* Oscilloscope rules — a decoration unique to this card. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `linear-gradient(90deg, ${tint}55 1px, transparent 1px)`,
          backgroundSize: "17px 100%",
        }}
      />
      <svg viewBox="0 0 204 52" preserveAspectRatio="none" className="relative h-full w-full">
        <path d={SIGNAL_PATH} fill="none" stroke={tint} strokeOpacity="0.34" strokeWidth="1.5" />
        <path
          className="viz-dash"
          d={SIGNAL_PATH}
          pathLength={100}
          fill="none"
          stroke={tint}
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{ "--viz-dash-duration": "3.4s" } as React.CSSProperties}
        />
      </svg>
      {/* Travelling scanline. The outer span is the full-width animated
          element (so translateX% in the keyframe spans the whole plot); the
          inner span is the actual 2px visible bar pinned to its left edge. */}
      <span
        className="viz-scan pointer-events-none absolute inset-0"
        style={{ "--viz-scan-duration": "5s" } as React.CSSProperties}
      >
        <span
          className="absolute inset-y-0 left-0 w-[2px]"
          style={{
            background: `linear-gradient(to bottom, transparent, ${tint}, transparent)`,
            boxShadow: `0 0 12px ${tint}`,
          }}
        />
      </span>
    </div>
  )
}

/* ── 5 · IoT indicators ──────────────────────────────────────────────────── */

const IOT_DEVICES = [0, 1, 2, 3, 4, 5]

function IotViz({ tint }: { tint: string }) {
  return (
    <div className={`${STRIP} flex items-center gap-3`} aria-hidden>
      {/* Radar dish */}
      <span
        className="relative block h-[46px] w-[46px] shrink-0 overflow-hidden rounded-full border"
        style={{ borderColor: `${tint}40`, background: `${tint}0c` }}
      >
        <span className="absolute inset-[7px] rounded-full border" style={{ borderColor: `${tint}28` }} />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: tint }} />
        <span
          className="viz-radar absolute inset-0 rounded-full"
          style={
            {
              background: `conic-gradient(from 0deg, ${tint}00 0deg, ${tint}00 260deg, ${tint}66 340deg, ${tint}00 360deg)`,
              "--viz-radar-duration": "4.2s",
            } as React.CSSProperties
          }
        />
      </span>

      {/* Device grid */}
      <span className="grid flex-1 grid-cols-3 gap-x-2 gap-y-[6px]">
        {IOT_DEVICES.map((i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded-[4px] border px-1.5 py-[3px]"
            style={{ borderColor: `${tint}26`, background: `${tint}0a` }}
          >
            <span
              className="viz-blink block h-[5px] w-[5px] shrink-0 rounded-full"
              style={
                {
                  background: tint,
                  boxShadow: `0 0 6px ${tint}`,
                  "--viz-blink-duration": `${1.8 + (i % 4) * 0.5}s`,
                  "--viz-blink-delay": `${i * 0.28}s`,
                } as React.CSSProperties
              }
            />
            <span className="block h-[3px] flex-1 rounded-full" style={{ background: `${tint}30` }} />
          </span>
        ))}
      </span>
    </div>
  )
}

/* ── 6 · Cyber-security pulse ────────────────────────────────────────────── */

function ShieldViz({ tint }: { tint: string }) {
  return (
    <div className={`${STRIP} flex items-center gap-3.5`} aria-hidden>
      <span className="relative block h-[46px] w-[46px] shrink-0">
        <svg viewBox="0 0 46 46" className="h-full w-full">
          {/* Expanding pulse rings */}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              className="viz-ring"
              cx="23"
              cy="23"
              r="15"
              fill="none"
              stroke={tint}
              strokeWidth="1.2"
              style={
                {
                  "--viz-ring-duration": "3.6s",
                  "--viz-ring-delay": `${i * 1.2}s`,
                } as React.CSSProperties
              }
            />
          ))}
          {/* Shield glyph */}
          <path
            d="M23 9 L34 14 V24 C34 31 29 35.5 23 37.5 C17 35.5 12 31 12 24 V14 Z"
            fill={`${tint}14`}
            stroke={tint}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M18.5 23.2 L21.8 26.5 L28 20" fill="none" stroke={tint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Encrypted stream */}
      <span className="flex flex-1 flex-col gap-[7px]">
        {[0, 1, 2].map((row) => (
          <span key={row} className="flex items-center gap-[3px]">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="viz-blink block h-[4px] flex-1 rounded-full"
                style={
                  {
                    background: (i + row) % 3 === 0 ? tint : `${tint}33`,
                    "--viz-blink-duration": `${2 + ((i + row) % 5) * 0.4}s`,
                    "--viz-blink-delay": `${((i * 2 + row) % 8) * 0.24}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        ))}
      </span>
    </div>
  )
}

/* ── Dispatcher ──────────────────────────────────────────────────────────── */

export function BenefitViz({ kind, tint }: { kind: VizKind; tint: string }) {
  switch (kind) {
    case "waveform":
      return <WaveformViz tint={tint} />
    case "nodes":
      return <NodesViz tint={tint} />
    case "meter":
      return <SpectrumMeterViz tint={tint} />
    case "signal":
      return <SignalViz tint={tint} />
    case "iot":
      return <IotViz tint={tint} />
    case "shield":
      return <ShieldViz tint={tint} />
  }
}

/* ── Per-card background decoration ──────────────────────────────────────── */

/**
 * A different static motif behind each card. Pure CSS gradients — no extra DOM
 * cost, no animation, and each one echoes its card's visualisation.
 */
export function BenefitMotif({ kind, tint }: { kind: VizKind; tint: string }) {
  const motifs: Record<VizKind, React.CSSProperties> = {
    // Concentric sound rings
    waveform: {
      backgroundImage: `repeating-radial-gradient(circle at 88% 8%, ${tint}1f 0px, ${tint}1f 1px, transparent 1px, transparent 13px)`,
    },
    // Mesh dot lattice
    nodes: {
      backgroundImage: `radial-gradient(${tint}2e 1px, transparent 1px)`,
      backgroundSize: "15px 15px",
    },
    // Vertical meter ticks — echoes the segmented columns, distinct from the
    // diagonal hatch it replaced.
    meter: {
      backgroundImage: `repeating-linear-gradient(90deg, ${tint}1a 0px, ${tint}1a 1px, transparent 1px, transparent 9px)`,
    },
    // Oscilloscope column rules
    signal: {
      backgroundImage: `repeating-linear-gradient(90deg, ${tint}1c 0px, ${tint}1c 1px, transparent 1px, transparent 18px)`,
    },
    // Cross-hatch telemetry grid
    iot: {
      backgroundImage: `linear-gradient(${tint}17 1px, transparent 1px), linear-gradient(90deg, ${tint}17 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
    },
    // Hex-ish security weave
    shield: {
      backgroundImage: `repeating-linear-gradient(60deg, ${tint}15 0px, ${tint}15 1px, transparent 1px, transparent 14px), repeating-linear-gradient(-60deg, ${tint}15 0px, ${tint}15 1px, transparent 1px, transparent 14px)`,
    },
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.55] transition-opacity duration-500 group-hover:opacity-100"
      style={{
        ...motifs[kind],
        maskImage: "radial-gradient(ellipse 75% 65% at 88% 4%, #000 0%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 88% 4%, #000 0%, transparent 72%)",
      }}
    />
  )
}
