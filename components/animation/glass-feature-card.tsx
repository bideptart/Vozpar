"use client"

import { useRef, type ReactNode } from "react"
import { motion } from "motion/react"

/** Glass feature card — deliberately a different silhouette from `PinCard`.
 * `PinCard` (used for the "How it works" steps) reads as a sequence: a pin
 * dropping into place, energy rings orbiting a waypoint. This one reads as
 * a live instrument panel instead — a glowing icon medallion, a pulsing
 * "LIVE" indicator instead of a step number, a static gradient border with
 * corner brackets rather than a rotating ring, and the feature's demo
 * visual sits inside its own inset "screen" with a faint scanline texture.
 * Keeps the cursor-spotlight interaction (contained, not bleeding) since
 * that one's just good, but nothing else is shared between the two shells
 * so the two sections don't read as the same component reskinned. */
export function GlassFeatureCard({
  accent,
  reduced,
  children,
}: {
  accent: string
  reduced: boolean
  children: ReactNode
}) {
  const glassRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !glassRef.current) return
    const rect = glassRef.current.getBoundingClientRect()
    glassRef.current.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`)
    glassRef.current.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 28, scale: 0.96 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="group relative h-full rounded-2xl p-px transition-[background] duration-500"
      style={{
        background: `linear-gradient(150deg, color-mix(in oklch, ${accent} 45%, transparent) 0%, rgba(255,255,255,0.08) 50%, color-mix(in oklch, ${accent} 25%, transparent) 100%)`,
      }}
    >
      <div
        ref={glassRef}
        onMouseMove={handleMove}
        className="relative h-full overflow-hidden rounded-[15px] backdrop-blur-xl"
        style={{
          background: "linear-gradient(165deg, rgba(255,255,255,0.05), rgba(9,11,15,0.82) 45%, rgba(9,11,15,0.94))",
          ["--mx" as string]: "50%",
          ["--my" as string]: "50%",
        }}
      >
        {/* Cursor spotlight */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(260px circle at var(--mx) var(--my), color-mix(in oklch, ${accent} 18%, transparent), transparent 70%)`,
            }}
          />
        )}

        {/* Corner brackets — a static, quieter accent than a rotating
            ring; brighten on hover instead of always animating. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-2 top-2 h-3 w-3 rounded-tl-[3px] border-l border-t opacity-40 transition-opacity duration-500 group-hover:opacity-90"
          style={{ borderColor: accent }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-tr-[3px] border-r border-t opacity-40 transition-opacity duration-500 group-hover:opacity-90"
          style={{ borderColor: accent }}
        />

        {/* LIVE indicator, top-right, in place of a step number */}
        <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            {!reduced && (
              <motion.span
                className="absolute h-full w-full rounded-full"
                style={{ background: accent }}
                animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
              />
            )}
            <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Live</span>
        </div>

        {children}
      </div>
    </motion.div>
  )
}

/** Wraps a feature's demo visual in an inset "screen" — a slightly recessed
 * panel with a hairline border and a faint scanline texture, so it reads as
 * a live readout rather than floating loose in the card body. Fixed height
 * with the content centered, rather than sizing to whatever the visual
 * happened to need — the three visuals are very different shapes (a bar
 * row, two tall bars + labels, a small ring cluster), so left to their own
 * height they produced three differently-sized screens, and the smallest
 * one (the expanding rings) looked lost in a mostly-empty box. */
export function FeatureScreen({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <div
      className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border"
      style={{ borderColor: "color-mix(in oklch, white 8%, transparent)", background: "rgba(0,0,0,0.35)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-8 opacity-30"
        style={{ background: `linear-gradient(to bottom, color-mix(in oklch, ${accent} 30%, transparent), transparent)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-4">{children}</div>
    </div>
  )
}
