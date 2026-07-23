"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { Pause, Play, SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * CardStack
 * A fanned, draggable deck: the active card sits forward and upright, the rest
 * splay out behind it on an arc.
 *
 * Two deviations from the source this was adapted from:
 *   · imports come from `motion/react` rather than `framer-motion`. Both are
 *     installed and `motion` re-exports framer-motion wholesale, but every
 *     other component in this codebase uses `motion/react` and mixing the two
 *     entry points in one tree risks two copies of the layout engine.
 *   · it uses the shared `cn` from `@/lib/utils` instead of shipping a private
 *     one.
 *
 * Depth is animated as motion's own `z` transform, not as a `translateZ` on an
 * inner wrapper. The wrapper approach the source used cannot work here: the
 * card needs `overflow-hidden` to clip its rounded corners, and per CSS
 * Transforms L2 any `overflow` other than visible/clip forces the used value
 * of `transform-style` to `flat` — which flattens the child's translateZ to
 * nothing. `z` is a first-class transform prop in motion, so there is no
 * conflict to work around.
 */

export type CardStackItem = {
  id: string | number
  title: string
  description?: string
  imageSrc?: string
  href?: string
  ctaLabel?: string
  tag?: string
}

export type CardStackProps<T extends CardStackItem> = {
  items: T[]
  /** Selected index on mount */
  initialIndex?: number
  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number
  /** Card sizing */
  cardWidth?: number
  cardHeight?: number
  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number
  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number
  /** 3D / depth feel */
  perspectivePx?: number
  depthPx?: number
  tiltXDeg?: number
  /** Active emphasis */
  activeLiftPx?: number
  activeScale?: number
  inactiveScale?: number
  /** Motion */
  springStiffness?: number
  springDamping?: number
  /** Behavior */
  loop?: boolean
  autoAdvance?: boolean
  intervalMs?: number
  pauseOnHover?: boolean
  /**
   * Headroom above the card, in px. The deck is bottom-aligned, so this is
   * the room the fan's lift and tilt need to breathe. Worth lowering on
   * narrow screens: with `maxVisible` down to 1 there is no fan to clear, and
   * the default just leaves a band of dead space.
   */
  stagePadPx?: number
  /** UI */
  showDots?: boolean
  className?: string
  /** Accessible label for the dot navigation */
  navLabel?: string
  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void
  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean; offset: number }) => React.ReactNode
}

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0
  return ((n % len) + len) % len
}

/** Minimal signed offset from the active index to i, wrapping when looping. */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active
  if (!loop || len <= 1) return raw
  const alt = raw > 0 ? raw - len : raw + len
  return Math.abs(alt) < Math.abs(raw) ? alt : raw
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  stagePadPx = 72,
  showDots = true,
  className,
  navLabel = "Cards",
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion()
  const len = items.length
  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len))
  const [hovering, setHovering] = React.useState(false)
  // WCAG 2.2.2: anything that auto-updates for more than five seconds needs a
  // mechanism to pause it. `pauseOnHover` is not that mechanism — it doesn't
  // exist on touch — so autoplay ships with a real button beside the dots.
  const [paused, setPaused] = React.useState(false)

  // Autoplay only runs while the deck is actually on screen. Without this the
  // interval ticks for the life of the page: it re-renders the consumer every
  // interval forever, and any `aria-live` readout wired to the index announces
  // a new card to a screen reader every few seconds from a section the user
  // scrolled past long ago.
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const [onScreen, setOnScreen] = React.useState(false)
  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Keep the active index in bounds if the item list changes underneath us.
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len))
  }, [len])

  const changeRef = React.useRef(onChangeIndex)
  React.useEffect(() => {
    changeRef.current = onChangeIndex
  })
  React.useEffect(() => {
    const item = items[active]
    if (item) changeRef.current?.(active, item)
    // Intentionally keyed on the index alone: firing on every `items` identity
    // change would re-notify on each parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2))
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)))
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0

  const canGoPrev = loop || active > 0
  const canGoNext = loop || active < len - 1

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return
    setActive((a) => wrapIndex(a - 1, len))
  }, [canGoPrev, len])

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return
    setActive((a) => wrapIndex(a + 1, len))
  }, [canGoNext, len])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    }
  }

  React.useEffect(() => {
    if (!autoAdvance || paused || reduceMotion || !len || !onScreen) return
    if (pauseOnHover && hovering) return
    // `active` is in the deps deliberately: the timer restarts on every index
    // change, so a manual drag or dot press buys a full fresh interval rather
    // than being yanked forward a moment later.
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next()
    }, Math.max(700, intervalMs))
    return () => window.clearInterval(id)
  }, [autoAdvance, paused, onScreen, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next])

  if (!len) return null
  const activeItem = items[active]

  return (
    <div
      ref={rootRef}
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        // Full-strength ring: at /60 over the navy canvas this composites to
        // ~2.1:1, under the 3:1 WCAG 1.4.11 floor for a focus indicator.
        className="relative w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ height: cardHeight + stagePadPx }}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={navLabel}
        onKeyDown={onKeyDown}
      >
        {/* Spotlight wash behind the deck */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/30 blur-3xl"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-end justify-center" style={{ perspective: `${perspectivePx}px` }}>
          {/* No AnimatePresence: none of these children declare `exit`, so it
              would add presence-context churn for no visual effect. Cards that
              scroll out of range unmount instantly either way. */}
          <>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop)
              const abs = Math.abs(off)
              if (abs > maxOffset) return null

              const rotateZ = off * stepDeg
              const x = off * cardSpacing
              const y = abs * 10
              const z = -abs * depthPx
              const isActive = off === 0
              const scale = isActive ? activeScale : inactiveScale
              const lift = isActive ? -activeLiftPx : 0
              const rotateX = isActive ? 0 : tiltXDeg
              const zIndex = 100 - abs

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    // Not gated on `reduceMotion`. Reduced motion is about
                    // content that moves on its own — a drag the user is
                    // physically performing is theirs to make, and gating it
                    // left those users with no way to advance the deck on
                    // touch at all.
                    onDragEnd: (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
                      const travel = info.offset.x
                      const v = info.velocity.x
                      const threshold = Math.min(160, cardWidth * 0.22)
                      if (travel > threshold || v > 650) prev()
                      else if (travel < -threshold || v < -650) next()
                    },
                  }
                : {}

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 overflow-hidden rounded-2xl border border-border shadow-xl shadow-black/40",
                    "select-none will-change-transform",
                    isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                  )}
                  style={{ width: cardWidth, height: cardHeight, zIndex }}
                  // `initial={false}` rather than a fade-up: motion serialises
                  // `initial` into the SSR markup, so an opacity-0 start shipped
                  // HTML with the whole deck invisible until hydration. It also
                  // removes the last branch on `useReducedMotion()`, which is
                  // null on the server and a real boolean on the client's first
                  // render — branching it here was a style-attribute mismatch.
                  initial={false}
                  // Opacity falls off with distance. With more items than
                  // `maxVisible`, the outermost card unmounts and a new one
                  // mounts on every advance — and `initial={false}` means the
                  // new one has no enter transition, so at full opacity it
                  // blinks into existence at the edge of the fan. Fading the
                  // extremities makes that swap almost invisible.
                  animate={{
                    opacity: isActive ? 1 : Math.max(0.3, 1 - abs * 0.3),
                    x,
                    y: y + lift,
                    z,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{ type: "spring", stiffness: springStiffness, damping: springDamping }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  {renderCard ? renderCard(item, { active: isActive, offset: off }) : <DefaultFanCard item={item} />}
                </motion.div>
              )
            })}
          </>
        </div>
      </div>

      {showDots ? (
        <div className="mt-4 flex items-center justify-center gap-1">
          <div className="flex items-center">
            {items.map((it, idx) => {
              const on = idx === active
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setActive(idx)}
                  // Narrower on phones. Seven dots plus the pause control at a
                  // full 44px each needs 356px against a 328px content box at
                  // 360px viewport, and flex would silently shrink them all.
                  className="flex h-11 w-8 items-center justify-center sm:w-11"
                  aria-label={`Go to ${it.title}`}
                  aria-current={on ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      on ? "bg-foreground" : "bg-foreground/30 hover:bg-foreground/50",
                    )}
                  />
                </button>
              )
            })}
          </div>
          {/* Gated on `autoAdvance` alone, never on `reduceMotion`.
              `useReducedMotion()` is null server-side and a real boolean on the
              client's first render, so branching the button's existence on it
              rendered it in the SSR HTML and removed it during hydration — a
              recoverable React error and a visible flash. For reduced-motion
              users autoplay isn't running anyway, so an inert control is a far
              smaller cost than a mismatched tree. */}
          {autoAdvance ? (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={paused ? "Resume automatic playback" : "Pause automatic playback"}
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          ) : null}

          {activeItem?.href ? (
            <Link
              href={activeItem.href}
              className="flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label={activeItem.ctaLabel ?? `Open ${activeItem.title}`}
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function DefaultFanCard({ item }: { item: CardStackItem }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        {item.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageSrc}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="truncate text-lg font-semibold text-white">{item.title}</div>
        {item.description ? <div className="mt-1 line-clamp-2 text-sm text-white/80">{item.description}</div> : null}
      </div>
    </div>
  )
}
