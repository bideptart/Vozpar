"use client"

import Link from "next/link"
import { Fragment, useRef } from "react"
import { ArrowRight, Clock, Sparkles } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { FeatureOrbit } from "@/components/animation/feature-orbit"
import { Magnetic } from "@/components/animation/magnetic"

/**
 * FeatureHero
 * The /features banner: copy left, orbiting voice core right, mirroring the
 * homepage's product-visual layout so the two pages read as siblings.
 *
 * Built as depth rather than decoration — the layers move at different rates
 * so it parallaxes instead of sitting flat:
 *
 *   1. aurora orbs       — slow autonomous drift + cursor tracking
 *   2. perspective floor — receding grid travelling toward the viewer
 *   3. conic beam        — slow sweep behind the orbit
 *   4. copy + visual     — leads on entry, lifts away on scroll
 *
 * The pointer position is normalised to -1..1 against the section box and
 * sprung once at the top, so every layer reads the same two motion values and
 * nothing re-renders React on mouse move.
 *
 * `isolate` on the section is load-bearing, not cosmetic. `position: relative`
 * with `z-index: auto` does NOT open a stacking context, so the `-z-10`
 * children would otherwise resolve into the root context and paint *behind*
 * the page's own opaque background — invisible. The sections further down the
 * page get away with the same pattern only because globals.css puts
 * `content-visibility: auto` on `main > section:not(:first-of-type)`, which
 * implies paint containment; this is the one section that rule skips.
 */

/** Split so the accent phrase can carry the animated gradient on its own. */
const HEAD_LEAD = ["Everything", "you", "need", "to", "ship", "a"]
const HEAD_ACCENT = "real-world voice agent."

const TRUST = [
  { icon: Sparkles, label: "No credit card to try" },
  { icon: Clock, label: "Live in an afternoon" },
]

// Status chips around the visual — live-telemetry cues that make the orbit
// read as a running system rather than art.
const HERO_CHIPS = [
  { label: "Call connected", tint: "var(--features-green)", pos: "-left-2 top-10 md:-left-6", dur: 4, delay: 0 },
  {
    label: "Booking confirmed",
    tint: "var(--features-blue)",
    pos: "-right-2 top-1/3 md:-right-6",
    dur: 5,
    delay: 0.8,
  },
  { label: "CRM synced", tint: "var(--features-amber)", pos: "bottom-12 left-2 md:left-0", dur: 4.6, delay: 1.4 },
] as const

export function FeatureHero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement | null>(null)

  // ---- pointer parallax ------------------------------------------------
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 70, damping: 22, mass: 0.6 })
  const py = useSpring(my, { stiffness: 70, damping: 22, mass: 0.6 })

  const visualX = useTransform(px, [-1, 1], [-18, 18])
  const visualY = useTransform(py, [-1, 1], [-12, 12])

  // ---- scroll exit -----------------------------------------------------
  // Reduced motion is folded into the output RANGE rather than swapping the
  // `style` prop out. `useReducedMotion()` is null on the server and a real
  // boolean on the client's first render, so gating `style` would emit the
  // attribute on one and omit it on the other — a hydration diff. Flattening
  // the range keeps the attribute identical and the element still.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0])

  return (
    <section
      ref={sectionRef}
      id="features-hero"
      className="features-hero-dark relative isolate flex items-center overflow-hidden border-t border-border lg:min-h-[calc(100svh-4rem)]"
      style={{ background: "var(--features-hero-bg)" }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return
        const el = sectionRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
        my.set(((e.clientY - r.top) / r.height) * 2 - 1)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {/* Aurora orbs, flat grid, perspective floor, and the brief top-of-page
          vignette all removed — the vignette read as an obvious blue wash
          rather than the near-invisible tint the /industries reference has,
          so the canvas is back to flat #000 throughout. Any colour comes only
          from the content on top (orbit visual, chips, accents), never the
          page itself. */}

      <motion.div
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-12 lg:gap-8 lg:py-0"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* ---------------- LEFT — copy ---------------- */}
        <div className="lg:col-span-6">
          <motion.span
            className="ai-pill-blue"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="pulse-ring relative h-1 w-1 rounded-full bg-current" />
            Features
          </motion.span>

          {/* Word-by-word blur-up. Two things that are easy to get wrong:
              · the inter-word space is a sibling of the span, not inside it —
                trailing whitespace at the end of an inline-block is trimmed,
                so putting it inside runs every word together.
              · the accent phrase animates from a WRAPPER, not per word.
                `background-clip: text` paints the gradient on that element's
                own background box, and a transformed descendant is promoted to
                its own layer — staggering words inside would clip them out of
                the gradient entirely, i.e. render them invisible. */}
          <h1 className="mt-5 text-balance font-heading text-[2rem] font-medium leading-[1.07] tracking-[-0.035em] text-foreground sm:text-4xl md:mt-6 md:text-5xl lg:text-6xl">
            {HEAD_LEAD.map((w, i) => (
              <Fragment key={w + i}>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>{" "}
              </Fragment>
            ))}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
              animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
              transition={{
                duration: 0.85,
                delay: 0.1 + HEAD_LEAD.length * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-aurora-blue">{HEAD_ACCENT}</span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-5 max-w-xl text-pretty text-[15px] font-light leading-relaxed text-muted-foreground md:mt-6 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Real-time audio, carrier-grade telephony, live tool calls, and full observability — production-ready, all
            in one platform. No stitching six vendors together.
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <Magnetic strength={0.3} className="w-full sm:w-auto">
              <Link
                href="/get-started"
                className="btn-ai group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[filter,box-shadow] duration-300 sm:w-auto"
              >
                Start building
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </Magnetic>

            <Magnetic strength={0.22} className="w-full sm:w-auto">
              <Link
                href="#features"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-foreground transition-colors duration-300 hover:border-white/40 hover:bg-white/10 sm:w-auto"
              >
                Browse all 12 features
              </Link>
            </Magnetic>
          </motion.div>

          <motion.p
            className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {TRUST.map((t) => {
              const Icon = t.icon
              return (
                <span key={t.label} className="inline-flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" style={{ color: "var(--features-blue)" }} aria-hidden />
                  {t.label}
                </span>
              )
            })}
          </motion.p>
        </div>

        {/* ---------------- RIGHT — orbit visual ---------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:col-span-6 lg:max-w-none"
        >
          {/* Parallax is a separate wrapper from the entrance scale above:
              both would write `transform` on one node and the later one wins.
              The inner box is pinned to the orbit's own 420px cap so the
              chips stay pinned to the ring — the
              lg column is ~600px wide, and positioning them against that
              instead leaves them floating ~90px clear of it. */}
          <motion.div className="relative mx-auto max-w-[420px]" style={{ x: visualX, y: visualY }}>
            {/* Conic beam removed — flat black canvas, no glow behind the orbit. */}

            <FeatureOrbit />

            {HERO_CHIPS.map((c) => (
              <motion.div
                key={c.label}
                aria-hidden
                className={`absolute ${c.pos} hidden items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md sm:flex`}
                animate={reduced ? undefined : { y: [0, -9, 0] }}
                transition={{ duration: c.dur, delay: c.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: c.tint }} />
                {c.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue — a packet running down a hairline, so the affordance
          points somewhere instead of just blinking. Desktop only: the section
          isn't full-height on phones, so there's nothing to cue. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 hidden flex-col items-center gap-2 lg:flex"
        style={{ opacity: contentOpacity }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/50">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute left-0 block h-4 w-px"
            style={{ background: "var(--features-blue)", boxShadow: "0 0 8px var(--features-blue)" }}
            initial={{ y: -16 }}
            animate={reduced ? { y: 12 } : { y: 44 }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeIn" }}
          />
        </span>
      </motion.div>
    </section>
  )
}
