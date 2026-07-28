"use client"

import type React from "react"
import { memo, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { useRafMouse } from "@/lib/use-raf-mouse"

/**
 * Home hero — immersive industrial background.
 *
 * Design notes
 * ────────────
 * • Base stays pure #000 (the rest of the page is black; a hard slate base
 *   would leave a visible seam where the hero meets <Benefits/>). The slate
 *   palette — #020617 / #0B1220 / #111827 / #1E293B — is painted *on top* as
 *   large mesh-gradient washes, then dissolved back to black at the bottom
 *   edge. Same atmosphere, no seam.
 *
 * • Every animation is a CSS keyframe on transform/opacity (see globals.css),
 *   so the scene composites on the GPU and costs no main-thread work. The only
 *   JS that runs continuously is the RAF-coalesced pointer read for parallax,
 *   and that writes two custom properties on one element — the whole parallax
 *   stack derives from it.
 *
 * • Detail is deliberately concentrated in the lower band and the outer
 *   margins. The headline/CTA column sits over a dark radial scrim with almost
 *   nothing behind it, which is what keeps the copy readable.
 *
 * • No people, no vehicles, no logos, no raster images — every element is
 *   hand-authored SVG geometry or a CSS gradient.
 */

const CYAN = "#2d98f1"
const BLUE = "#046bd2"
const ICE = "#60b8ff"

/* ── Layer 1 · mesh gradient washes ─────────────────────────────────────── */

const MESH = [
  {
    color: "rgba(4,107,210,0.05)",
    size: 780,
    left: "58%",
    top: "-22%",
    duration: 24,
    delay: 0,
    driftX: "26px",
    driftY: "22px",
    breatheMin: 0.5,
    breatheMax: 0.9,
  },
  {
    color: "rgba(45,152,241,0.035)",
    size: 620,
    left: "-14%",
    top: "6%",
    duration: 28,
    delay: 2.5,
    driftX: "-20px",
    driftY: "26px",
    breatheMin: 0.35,
    breatheMax: 0.7,
  },
  {
    color: "rgba(5,6,10,0.9)",
    size: 900,
    left: "8%",
    top: "42%",
    duration: 32,
    delay: 1.2,
    driftX: "22px",
    driftY: "-18px",
    breatheMin: 0.45,
    breatheMax: 0.8,
  },
  {
    color: "rgba(2,3,6,0.95)",
    size: 700,
    left: "68%",
    top: "48%",
    duration: 26,
    delay: 3.4,
    driftX: "-24px",
    driftY: "-20px",
    breatheMin: 0.4,
    breatheMax: 0.75,
  },
  {
    color: "rgba(96,184,255,0.03)",
    size: 460,
    left: "34%",
    top: "22%",
    duration: 21,
    delay: 4.6,
    driftX: "18px",
    driftY: "20px",
    breatheMin: 0.25,
    breatheMax: 0.55,
  },
]

function MeshGradients() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {MESH.map((m, i) => (
        <span
          key={i}
          // Only the first two washes survive below md. A 60px blur on a
          // 900px box is one of the most expensive things a mobile GPU can
          // be asked to composite every frame, and five of them stacked is
          // what makes a budget phone drop frames on this section. The two
          // that remain carry the colour; the rest were depth nuance that
          // is invisible at phone size anyway.
          className={`hero-mesh-drift absolute rounded-full ${i > 1 ? "hidden md:block" : ""}`}
          style={
            {
              width: m.size,
              height: m.size,
              left: m.left,
              top: m.top,
              background: `radial-gradient(circle at 50% 50%, ${m.color} 0%, transparent 68%)`,
              // Blur is set via a custom property so the mobile override in
              // globals.css can drop it to a much cheaper radius.
              filter: "blur(var(--hero-mesh-blur, 60px))",
              "--hero-mesh-x": m.driftX,
              "--hero-mesh-y": m.driftY,
              "--hero-mesh-duration": `${m.duration}s`,
              "--hero-mesh-delay": `${m.delay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="hero-breathe absolute inset-0 rounded-full"
            style={
              {
                background: `radial-gradient(circle at 50% 50%, ${m.color} 0%, transparent 62%)`,
                "--hero-breathe-min": m.breatheMin,
                "--hero-breathe-max": m.breatheMax,
                "--hero-breathe-duration": `${m.duration * 0.42}s`,
                "--hero-breathe-delay": `${m.delay * 0.5}s`,
              } as React.CSSProperties
            }
          />
        </span>
      ))}
    </div>
  )
}

/* ── Layer 2 · hex grid + blueprint lines ───────────────────────────────── */

function GridLayer() {
  return (
    <div
      aria-hidden
      className="hero-parallax pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--hero-depth": 2 } as React.CSSProperties}
    >
      {/* Blueprint rule lines — CSS gradients are cheaper than an SVG pattern
          for pure orthogonal lines. */}
      <div
        className="hero-grid-drift absolute -inset-24 opacity-[0.05]"
        style={
          {
            backgroundImage: `
              linear-gradient(to right, rgba(45,152,241,0.55) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(45,152,241,0.55) 1px, transparent 1px)
            `,
            backgroundSize: "140px 140px",
            "--hero-grid-x": "16px",
            "--hero-grid-y": "12px",
            "--hero-grid-duration": "34s",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, #000 20%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, #000 20%, transparent 78%)",
          } as React.CSSProperties
        }
      />

      {/* Hexagonal lattice — desktop only. An SVG <pattern> tiled across the
          full hero and then masked is rasterised on the CPU; at 5.5% opacity
          it contributes almost nothing visually on a phone. */}
      <svg
        className="hero-grid-drift absolute -inset-16 hidden h-[calc(100%+8rem)] w-[calc(100%+8rem)] opacity-[0.055] md:block"
        style={
          {
            "--hero-grid-x": "-14px",
            "--hero-grid-y": "10px",
            "--hero-grid-duration": "42s",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 62%, #000 10%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 62%, #000 10%, transparent 72%)",
          } as React.CSSProperties
        }
        aria-hidden
      >
        <defs>
          <pattern id="vz-hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.62)">
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke={CYAN}
              strokeWidth="1.4"
            />
            <path d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34" fill="none" stroke={CYAN} strokeWidth="1.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vz-hex)" />
      </svg>

      {/* Fine engineering dot matrix — carried over from the original hero. */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.65) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  )
}

/* ── Layer 3 · AI neural connections (upper band) ───────────────────────── */

const NEURAL_NODES = [
  { x: 92, y: 62 },
  { x: 268, y: 132 },
  { x: 186, y: 226 },
  { x: 452, y: 58 },
  { x: 566, y: 178 },
  { x: 742, y: 92 },
  { x: 918, y: 196 },
  { x: 1046, y: 64 },
  { x: 1192, y: 158 },
  { x: 1338, y: 84 },
  { x: 1266, y: 244 },
]

const NEURAL_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [5, 7],
  [7, 8],
  [8, 9],
  [8, 10],
  [6, 10],
]

function NeuralLayer() {
  return (
    <div
      aria-hidden
      className="hero-parallax pointer-events-none absolute inset-x-0 top-0 h-[46%] overflow-hidden"
      style={
        {
          "--hero-depth": 7,
          maskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
        } as React.CSSProperties
      }
    >
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMin slice"
        className="h-full w-full opacity-[0.5]"
        aria-hidden
      >
        <g stroke={BLUE} strokeWidth="1" opacity="0.34">
          {NEURAL_EDGES.map(([a, b], i) => (
            <line key={i} x1={NEURAL_NODES[a].x} y1={NEURAL_NODES[a].y} x2={NEURAL_NODES[b].x} y2={NEURAL_NODES[b].y} />
          ))}
        </g>

        {/* Charge travelling between neurons — only a few, kept sparse. */}
        <g stroke={ICE} strokeWidth="1.6" strokeLinecap="round" fill="none">
          {NEURAL_EDGES.filter((_, i) => i % 3 === 0).map(([a, b], i) => (
            <line
              key={i}
              className="hero-circuit-pulse"
              pathLength={100}
              x1={NEURAL_NODES[a].x}
              y1={NEURAL_NODES[a].y}
              x2={NEURAL_NODES[b].x}
              y2={NEURAL_NODES[b].y}
              style={
                {
                  "--hero-circuit-duration": `${5.5 + i * 1.4}s`,
                  "--hero-circuit-delay": `${i * 1.9}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>

        <g fill={CYAN}>
          {NEURAL_NODES.map((n, i) => (
            <circle
              key={i}
              className="hero-node-pulse"
              cx={n.x}
              cy={n.y}
              r="2.2"
              style={
                {
                  "--hero-node-duration": `${3.6 + (i % 5) * 0.8}s`,
                  "--hero-node-delay": `${(i % 7) * 0.55}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

/* ── Layer 4 · industrial scene (lower band) ────────────────────────────── */

const CONVEYOR_BOXES = [250, 400, 550, 700]
const RACKS = [1088, 1178, 1268]

function IndustrialScene() {
  return (
    <div
      aria-hidden
      className="hero-parallax pointer-events-none absolute inset-x-0 bottom-0 h-[54%] overflow-hidden"
      style={
        {
          "--hero-depth": 4,
          maskImage: "linear-gradient(to top, #000 0%, #000 38%, rgba(0,0,0,0.4) 72%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, #000 0%, #000 38%, rgba(0,0,0,0.4) 72%, transparent 100%)",
        } as React.CSSProperties
      }
    >
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full opacity-[0.42]"
        aria-hidden
      >
        <defs>
          <clipPath id="vz-belt-clip">
            <rect x="400" y="288" width="360" height="56" />
          </clipPath>
          <linearGradient id="vz-struct" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.55" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* ── Digital factory silhouette ── */}
        <g fill="none" stroke="url(#vz-struct)" strokeWidth="1.5">
          {/* Main hall + sawtooth roof */}
          <path d="M40 300 H220 V392 H40 Z" />
          <path d="M40 300 L85 274 L85 300 M85 300 L130 274 L130 300 M130 300 L175 274 L175 300 M175 300 L220 274 L220 300" />
          {/* Window bank */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={54 + i * 28} y={330} width="14" height="18" />
          ))}
          {/* Exhaust stack */}
          <path d="M240 214 H262 V392 H240 Z" />
          <path d="M236 208 H266" />
          {/* Control tower */}
          <path d="M286 250 H340 V392 H286 Z" />
          <path d="M286 288 H340 M286 326 H340 M286 364 H340" />
          <path d="M313 250 V216" />
        </g>
        <circle
          className="hero-node-pulse"
          cx="313"
          cy="212"
          r="3.4"
          fill={ICE}
          style={{ "--hero-node-duration": "3.2s" } as React.CSSProperties}
        />

        {/* ── Conveyor system ── */}
        <g fill="none" stroke="url(#vz-struct)" strokeWidth="1.5">
          <path d="M400 330 H760 M400 346 H760" />
          <path d="M420 346 V392 M560 346 V392 M700 346 V392" />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={412 + i * 38} cy={338} r="5" />
          ))}
        </g>
        <g clipPath="url(#vz-belt-clip)" fill="none" stroke={CYAN} strokeWidth="1.5" opacity="0.75">
          {CONVEYOR_BOXES.map((x, i) => (
            <g
              key={i}
              className="hero-conveyor"
              style={
                {
                  "--hero-conveyor-distance": "150px",
                  "--hero-conveyor-duration": "11s",
                } as React.CSSProperties
              }
            >
              <rect x={x} y={302} width="30" height="26" rx="2" />
              <path d={`M${x} 315 H${x + 30}`} opacity="0.5" />
            </g>
          ))}
        </g>

        {/* ── Robotic automation arm ── */}
        <g fill="none" stroke="url(#vz-struct)" strokeWidth="1.5">
          <rect x="856" y="364" width="68" height="28" rx="4" />
          <path d="M878 364 V306 H902 V364" />
        </g>
        <g
          className="hero-arm-swing"
          style={
            {
              transformBox: "view-box",
              transformOrigin: "890px 306px",
              "--hero-arm-from": "-5deg",
              "--hero-arm-to": "6deg",
              "--hero-arm-duration": "13s",
            } as React.CSSProperties
          }
        >
          <path d="M890 306 L968 258" fill="none" stroke={CYAN} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          <circle cx="890" cy="306" r="8" fill="none" stroke={CYAN} strokeWidth="1.5" />
          <g
            className="hero-arm-swing"
            style={
              {
                transformBox: "view-box",
                transformOrigin: "968px 258px",
                "--hero-arm-from": "9deg",
                "--hero-arm-to": "-7deg",
                "--hero-arm-duration": "9s",
                "--hero-arm-delay": "1.4s",
              } as React.CSSProperties
            }
          >
            <path d="M968 258 L1032 292" fill="none" stroke={CYAN} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
            <circle cx="968" cy="258" r="7" fill="none" stroke={CYAN} strokeWidth="1.5" />
            {/* Gripper */}
            <path d="M1032 292 L1046 284 M1032 292 L1044 302" stroke={ICE} strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        </g>

        {/* ── Cloud infrastructure + server racks ── */}
        <g fill="none" stroke="url(#vz-struct)" strokeWidth="1.5">
          <path d="M1120 196 H1256 A30 30 0 0 0 1262 137 A42 42 0 0 0 1182 123 A32 32 0 0 0 1120 196 Z" />
          {RACKS.map((x, i) => (
            <g key={i}>
              <rect x={x} y={300} width="64" height="92" rx="3" />
              <path d={`M${x} 322 H${x + 64} M${x} 344 H${x + 64} M${x} 366 H${x + 64}`} opacity="0.6" />
            </g>
          ))}
          {/* Cloud ⇄ rack uplinks */}
          <path d="M1188 196 V240 H1120 V300" />
          <path d="M1188 196 V300" />
          <path d="M1188 196 V240 H1300 V300" />
        </g>
        <g stroke={ICE} strokeWidth="2" strokeLinecap="round" fill="none">
          {["M1188 196 V240 H1120 V300", "M1188 196 V300", "M1188 196 V240 H1300 V300"].map((d, i) => (
            <path
              key={i}
              className="hero-circuit-pulse"
              d={d}
              pathLength={100}
              style={
                {
                  "--hero-circuit-duration": `${4.2 + i * 0.9}s`,
                  "--hero-circuit-delay": `${i * 1.1}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
        {/* Rack status LEDs */}
        {RACKS.map((x, i) => (
          <circle
            key={i}
            className="hero-node-pulse"
            cx={x + 52}
            cy={311}
            r="2.6"
            fill={ICE}
            style={
              {
                "--hero-node-duration": `${2.8 + i * 0.6}s`,
                "--hero-node-delay": `${i * 0.7}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* ── IoT devices ── */}
        {[
          { x: 372, y: 300 },
          { x: 788, y: 322 },
          { x: 1010, y: 336 },
        ].map((d, i) => (
          <g key={i}>
            <rect
              x={d.x}
              y={d.y}
              width="22"
              height="22"
              rx="3"
              fill="none"
              stroke="url(#vz-struct)"
              strokeWidth="1.5"
            />
            <path d={`M${d.x + 11} ${d.y} V${d.y - 14}`} stroke="url(#vz-struct)" strokeWidth="1.5" fill="none" />
            <circle
              className="hero-node-pulse"
              cx={d.x + 11}
              cy={d.y - 17}
              r="2.4"
              fill={CYAN}
              style={
                {
                  "--hero-node-duration": `${3 + i * 0.9}s`,
                  "--hero-node-delay": `${i * 0.8}s`,
                } as React.CSSProperties
              }
            />
          </g>
        ))}

        {/* ── Glowing circuit traces tying the plant together ── */}
        <g fill="none" stroke={BLUE} strokeWidth="1.2" opacity="0.4">
          <path d="M40 406 H360 V380 H420" />
          <path d="M760 406 H840 V392 H1400" />
          <path d="M220 392 H286" />
        </g>
        <g stroke={ICE} strokeWidth="1.8" strokeLinecap="round" fill="none">
          {["M40 406 H360 V380 H420", "M760 406 H840 V392 H1400"].map((d, i) => (
            <path
              key={i}
              className="hero-circuit-pulse"
              d={d}
              pathLength={100}
              style={
                {
                  "--hero-circuit-duration": `${7 + i * 2}s`,
                  "--hero-circuit-delay": `${i * 2.6}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

/* ── Layer 5 · holographic particles ────────────────────────────────────── */

const PARTICLE_COUNT = 22

const PARTICLES = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  left: (i * 41 + 7) % 100,
  top: (i * 29 + 11) % 100,
  size: 1.5 + (i % 3) * 0.8,
  duration: 10 + (i % 6) * 2.5,
  delay: (i % 9) * 0.9,
  driftX: `${((i % 5) - 2) * 7}px`,
  driftY: `${-18 - (i % 4) * 10}px`,
  peak: 0.3 + (i % 4) * 0.12,
  color: i % 3 === 0 ? ICE : CYAN,
}))

function ParticleLayer() {
  return (
    <div
      aria-hidden
      className="hero-parallax pointer-events-none absolute inset-0 overflow-hidden"
      style={
        {
          "--hero-depth": 11,
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0.35) 0%, #000 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0.35) 0%, #000 70%)",
        } as React.CSSProperties
      }
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="hero-particle absolute rounded-full"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
              "--hero-particle-duration": `${p.duration}s`,
              "--hero-particle-delay": `${p.delay}s`,
              "--hero-particle-x": p.driftX,
              "--hero-particle-y": p.driftY,
              "--hero-particle-peak": p.peak,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

/* ── Root ───────────────────────────────────────────────────────────────── */

function HeroIndustrialBgImpl() {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [parallaxOn, setParallaxOn] = useState(false)

  // Parallax is pointer-driven, so it is pointless (and a battery cost) on
  // touch devices — and it is skipped outright under prefers-reduced-motion.
  useEffect(() => {
    if (reduced) {
      setParallaxOn(false)
      return
    }
    const mq = window.matchMedia("(pointer: fine)")
    setParallaxOn(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setParallaxOn(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [reduced])

  // Normalised to −1…1 about the viewport centre. Deliberately measured
  // against the viewport rather than the element: it needs no
  // getBoundingClientRect, so the per-frame handler triggers zero forced
  // layout. The hero fills the viewport, so the two agree closely anyway.
  const onPointer = useRafMouse((clientX, clientY) => {
    const el = rootRef.current
    if (!el) return
    const w = window.innerWidth
    const h = window.innerHeight
    if (!w || !h) return
    const px = Math.max(-1, Math.min(1, (clientX - w / 2) / (w / 2)))
    const py = Math.max(-1, Math.min(1, (clientY - h / 2) / (h / 2)))
    el.style.setProperty("--hero-px", String(px))
    el.style.setProperty("--hero-py", String(py))
  })

  // The layer stack is pointer-events-none (it must never intercept clicks on
  // the CTAs), which means it can't receive mousemove itself — so the listener
  // lives on window. It is passive and RAF-coalesced to one write per frame.
  useEffect(() => {
    if (!parallaxOn) return

    const handleMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY)
    const handleLeave = () => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--hero-px", "0")
      el.style.setProperty("--hero-py", "0")
    }

    window.addEventListener("mousemove", handleMove, { passive: true })
    document.addEventListener("mouseleave", handleLeave)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseleave", handleLeave)
    }
  }, [parallaxOn, onPointer])

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ "--hero-px": 0, "--hero-py": 0 } as React.CSSProperties}
    >
      {/* Pure-black depth wash — was a slate navy ramp (#020617 → #0B1220 →
          #111827 → #1E293B); the whole hero read as a blue-toned panel
          rather than matching the black canvas every other Home section
          uses. Collapsed to near-black stops so only the mesh/scene accents
          carry color, same as the rest of the page. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 72% 8%, #0a0c10 0%, transparent 58%),
            radial-gradient(ellipse 100% 70% at 12% 26%, #060708 0%, transparent 62%),
            radial-gradient(ellipse 140% 90% at 50% 96%, #030405 0%, transparent 66%),
            linear-gradient(180deg, #000000 0%, #000000 55%, #000000 100%)
          `,
        }}
      />

      <MeshGradients />
      <GridLayer />

      {/* Below md these three are display:none, so the browser never paints
          or composites them at all. Together they are ~40 animated SVG nodes
          (neural charges, conveyor, robot arm, circuit pulses) plus 22
          glowing particles — detail that is essentially unreadable on a
          phone-width canvas but costs a budget device real frame time. */}
      <div className="hidden md:contents">
        <NeuralLayer />
        <IndustrialScene />
        <ParticleLayer />
      </div>

      {/* Wide, very low-opacity light sweep — the "alive" cue you notice only
          after a few seconds. Hidden below md: a 48px blur combined with
          mix-blend-screen forces an expensive offscreen compositing pass. */}
      <div
        className="hero-scan-sweep absolute inset-y-0 left-0 hidden w-[38%] opacity-[0.05] mix-blend-screen md:block"
        style={
          {
            background: `linear-gradient(90deg, transparent, ${ICE}, transparent)`,
            filter: "blur(48px)",
            "--hero-scan-duration": "20s",
            "--hero-scan-delay": "6s",
          } as React.CSSProperties
        }
      />

      {/* Readability scrim — a soft radial pool of darkness under the copy
          column and a matching one under the 3D carousel. This is what keeps
          the headline at full contrast over the scene. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 46% 52% at 26% 48%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 45%, transparent 80%),
            radial-gradient(ellipse 40% 46% at 76% 50%, rgba(0,0,0,0.7) 0%, transparent 76%),
            linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.45) 100%)
          `,
        }}
      />

      {/* Edge vignette + fades into the black sections above and below. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 18%),
            linear-gradient(0deg, #000 0%, rgba(0,0,0,0.65) 12%, transparent 32%),
            radial-gradient(ellipse 90% 90% at 50% 50%, transparent 42%, rgba(0,0,0,0.55) 100%)
          `,
        }}
      />
    </div>
  )
}

/**
 * Memoised: <Hero/> re-renders every 2.6s to advance the rotating headline
 * word. Without this, that timer would reconcile the entire background tree —
 * ~40 SVG nodes and 22 particles — several times a minute for no reason. The
 * component takes no props, so it never needs to re-render at all.
 */
export const HeroIndustrialBg = memo(HeroIndustrialBgImpl)
