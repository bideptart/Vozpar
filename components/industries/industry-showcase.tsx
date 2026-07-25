"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, MoveHorizontal, type LucideIcon } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { useRafMouse } from "@/lib/use-raf-mouse"
import { ScrollReveal, StaggerGroup } from "@/components/animation/scroll-reveal"
import { INDUSTRIES } from "@/lib/industries"
import { headingType, bodyType, monoStyle } from "@/lib/industries-typography"
import { industriesBody, industriesHeading } from "@/lib/industries-fonts"

/**
 * Hover-to-expand industry filmstrip — all 10 industries sit in one row as
 * solid cards; the active one flex-grows open (icon, name, description, Know
 * more link) while the rest collapse to an icon + vertical rotated label.
 * Width change is a plain CSS `flex` transition (not Framer Motion — flex-grow
 * interpolates natively and reliably; see the "flex" Tailwind arbitrary
 * transition-property class below). Replaces the CardStack fan carousel
 * tried previously, per a reference image showing this exact expanding-strip
 * layout. See industries-playbooks-section-layout memory for this section's
 * design history. Per-card accent colors (ACCENT_BY_SLUG below) were later
 * added at the user's explicit request, reusing the same hex values as the
 * feature grid in components/sections/industries.tsx — the black+blue-only
 * lock no longer applies to either of these two sections, only to the rest
 * of the page.
 */

type ShowcaseItem = {
  slug: string
  name: string
  short: string
  icon: LucideIcon
  href: string
  accent: string
}

/**
 * Per-card accent colors — same explicit, user-requested exception to the
 * page's black+blue lock as components/sections/industries.tsx (same hex
 * values reused for the 6 shared industries so the two sections agree), now
 * extended to this filmstrip. Only the active/expanded card shows its accent;
 * collapsed strips stay neutral gray, keeping the existing hover behavior.
 */
const ACCENT_BY_SLUG: Record<string, string> = {
  "real-estate": "#3b82f6",
  dental: "#2dd4bf",
  healthcare: "#ef4444",
  "home-services": "#f2a71b",
  restaurants: "#22c55e",
  automotive: "#8b5cf6",
  legal: "#6366f1",
  education: "#ec4899",
  ecommerce: "#f97316",
  fitness: "#84cc16",
}

const items: ShowcaseItem[] = INDUSTRIES.map((industry) => ({
  slug: industry.slug,
  name: industry.name,
  short: industry.short,
  icon: industry.icon,
  href: `/industries/${industry.slug}`,
  accent: ACCENT_BY_SLUG[industry.slug] ?? "#3b82f6",
}))

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

/** Shared easing — width, opacity, and color transitions stay in sync. */
const STRIP_EASE = "cubic-bezier(0.22, 1, 0.36, 1)" as const
const STRIP_MS = 650

function FilmstripCard({ item, active }: { item: ShowcaseItem; active: boolean }) {
  const Icon = item.icon
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--card-accent) 28%, transparent), transparent 70%)`

  const onPointer = useRafMouse((clientX, clientY) => {
    const el = ref.current
    if (!el || !active) return
    const rect = el.getBoundingClientRect()
    mouseX.set(clientX - rect.left)
    mouseY.set(clientY - rect.top)
  })

  return (
    <div
      ref={ref}
      onMouseMove={active ? (e) => onPointer(e.clientX, e.clientY) : undefined}
      className={cn(
        "group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border",
        "transition-[border-color,background-color,box-shadow] ease-[var(--strip-ease)]",
        active
          ? "border-[color:var(--card-accent)]/50 bg-[#0b1220] shadow-[0_12px_40px_-15px_var(--card-accent)]"
          : "border-white/10 bg-[#08080a] hover:border-white/20 hover:bg-white/[0.03]",
      )}
      style={
        {
          "--card-accent": item.accent,
          "--strip-ease": STRIP_EASE,
          transitionDuration: `${STRIP_MS}ms`,
        } as React.CSSProperties
      }
    >
      {active && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      {/* soft glow around active card edge */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl transition-opacity ease-[var(--strip-ease)]",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60",
        )}
        style={{
          transitionDuration: `${STRIP_MS}ms`,
          boxShadow: "0 0 50px -20px var(--card-accent)",
        }}
      />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-[3px] origin-left transition-[opacity,transform] ease-[var(--strip-ease)]",
          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
        )}
        style={{ background: "var(--card-accent)", transitionDuration: `${STRIP_MS}ms` }}
      />

      {/* Both layouts stay mounted; opacity crossfade avoids the hard swap on hover. */}
      <div className="relative z-10 h-full min-w-0">
        <div
          aria-hidden={active}
          className={cn(
            "absolute inset-0 flex h-full min-w-[300px] flex-col p-5 ease-[var(--strip-ease)] sm:p-7 md:p-8",
            "transition-[opacity,transform]",
            active
              ? "pointer-events-auto translate-y-0 opacity-100 delay-150"
              : "pointer-events-none translate-y-1 opacity-0 delay-0",
          )}
          style={{ transitionDuration: `${STRIP_MS}ms` }}
        >
          <span
            className="relative flex size-12 flex-none items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-105 sm:size-14 md:size-[68px]"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, color-mix(in oklch, var(--card-accent) 65%, white 35%), var(--card-accent))",
              boxShadow: "0 10px 26px -8px var(--card-accent)",
            }}
          >
            <Icon className="size-6 sm:size-7 md:size-9" aria-hidden />
          </span>
          <h3
            className={cn(
              industriesHeading.className,
              "mt-4 text-lg font-medium leading-[1.25] tracking-[-0.021em] text-white sm:mt-5 sm:text-xl md:mt-6 md:text-[28px]",
            )}
          >
            {item.name}
          </h3>
          <p
            className={cn(
              industriesBody.className,
              "mt-2.5 text-pretty text-[13px] font-light leading-[1.55] text-muted-foreground sm:mt-3 sm:text-[15px] md:text-[18px] md:leading-[1.65]",
            )}
          >
            {item.short}
          </p>
          <Link
            href={item.href}
            tabIndex={active ? undefined : -1}
            className={cn(
              industriesBody.className,
              "group/link relative mt-auto inline-flex w-fit items-center gap-2 pt-4 text-sm font-medium transition-opacity hover:opacity-80 sm:pt-6 sm:text-base md:text-[17px]",
            )}
            style={{ color: "var(--card-accent)" }}
          >
            Know more
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover/link:translate-x-1 md:size-[18px]"
              aria-hidden
            />
          </Link>
        </div>

        <div
          aria-hidden={!active}
          className={cn(
            "flex h-full flex-col items-center gap-6 py-8 ease-[var(--strip-ease)]",
            "transition-[opacity,transform]",
            active
              ? "pointer-events-none -translate-y-0.5 opacity-0 delay-0"
              : "pointer-events-auto translate-y-0 opacity-100 delay-100",
          )}
          style={{ transitionDuration: `${active ? 280 : STRIP_MS}ms` }}
        >
          <span className="relative flex size-14 flex-none items-center justify-center rounded-full bg-white/5 text-white/50 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white/80 group-hover:scale-110">
            <Icon className="size-6" aria-hidden />
          </span>
          <span
            className="flex-1 whitespace-nowrap uppercase text-white/45 transition-colors duration-300 group-hover:text-white/70"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              ...monoStyle.strongLabel,
              fontSize: "15px",
              letterSpacing: "2px",
            }}
          >
            {item.name}
          </span>
        </div>
      </div>
    </div>
  )
}

const AUTO_ADVANCE_MS = 7000

export function IndustryShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  // Below `md` there's no mouse to hover with, and the desktop flex-grow
  // ratios (`4.5fr` active / `1fr` × 9 collapsed) just squeeze all ten cards
  // into the viewport width with nothing to scroll — the vertical labels on
  // the collapsed ones end up a few pixels wide. Below this breakpoint the
  // row switches to a fixed-width, horizontally scrollable filmstrip
  // instead. Read via matchMedia in an effect (not at render time) so the
  // server-rendered markup always matches the client's first paint — it
  // just switches over a frame after mount rather than risking a hydration
  // mismatch from evaluating `window` during render.
  const [isMobile, setIsMobile] = useState(false)
  const reduced = useReducedMotion()
  const rowRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  // Distinguishes the row's own `scrollTo` calls (auto-advance) from an
  // actual finger swipe. Without this, the `onScroll` handler that pauses
  // auto-advance on manual interaction would also catch the auto-advance's
  // own scroll and immediately pause itself after one move.
  const programmaticScrollRef = useRef(false)
  // Which of the two things caused `active` to change — a tap, or the timer.
  // A tapped card grows from a 64px strip to 300px the instant it becomes
  // active, so checking "is it fully visible" *after* that resize almost
  // always says no (the wider card now overflows the viewport) and the row
  // would auto-scroll to chase it — which is exactly the "jumps forward on
  // tap" behaviour reported. Tracking intent directly instead of inferring
  // it from post-resize geometry: only the timer is allowed to move the
  // scroll position; a tap always expands in place, full stop.
  const changeSourceRef = useRef<"auto" | "manual">("auto")

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    setIsMobile(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  // Auto-advance — phone only. Desktop already has an always-available
  // reveal mechanism (hover), so looping it there too would fight whatever
  // card the visitor is actually reading.
  useEffect(() => {
    if (!isMobile || paused || reduced) return
    const id = setTimeout(() => {
      changeSourceRef.current = "auto"
      setActive((a) => (a + 1) % items.length)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [active, isMobile, paused, reduced])

  // Keep the active card scrolled into view — same container-relative
  // scrollLeft technique used on the mobile nav rails elsewhere on this
  // site, not `scrollIntoView` (which would also drag the whole page).
  //
  // Deliberately NOT centered. Centering split the leftover space evenly, so
  // advancing forward looked identical to sliding backward — half the
  // remaining width went to the already-seen strip on the left and half to
  // what's next on the right, with barely a sliver of the upcoming card
  // peeking in. Pinning the active card near the left edge instead (with
  // just enough gap to show one collapsed strip behind it) hands almost all
  // the remaining width to what's coming up next, so each advance visibly
  // reveals more of the filmstrip moving forward.
  //
  // Only runs for auto-advance. A manual tap always expands its card right
  // where it is — see `changeSourceRef` above for why "is it visible after
  // resizing" isn't a safe test for that.
  useEffect(() => {
    if (!isMobile || changeSourceRef.current === "manual") return
    const container = rowRef.current
    const activeEl = itemRefs.current[active]
    if (!container || !activeEl) return
    const elLeft = activeEl.offsetLeft
    const leadingGap = active === 0 ? 0 : 72 // room for one collapsed strip behind, so it reads as "coming from" rather than snapping to a hard edge
    const target = elLeft - leadingGap
    programmaticScrollRef.current = true
    container.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" })
    const clear = setTimeout(() => {
      programmaticScrollRef.current = false
    }, 700)
    return () => clearTimeout(clear)
  }, [active, isMobile, reduced])

  return (
    <section id="playbooks" className="relative overflow-hidden border-t border-border/40 bg-black py-24 md:py-32">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="ai-pill-cyan" style={monoStyle.sectionTag}>
            Industry playbooks
          </span>
          <h2 className={cn("mt-5 text-balance text-white", headingType.h2)}>Ten playbooks, one platform.</h2>
          <p className={cn("mt-4 text-pretty text-muted-foreground", bodyType.intro)}>
            <span className="md:hidden">Tap any industry below — it also cycles on its own.</span>
            <span className="hidden md:inline">Hover any industry below to see exactly what your agent handles from day one.</span>
          </p>
        </div>

        {/* Explicit "this scrolls" affordance for phone — the row's own
            right-edge cutoff wasn't registering as an invitation to swipe
            on its own. A right-edge fade (masks the last ~2rem to
            transparent, so the cut-off collapsed card visually reads as
            "more here" rather than "the row ends here") plus a one-time
            animated hint chip that fades out the moment the user taps or
            scrolls anything themselves. */}
        {isMobile && !paused && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/60 md:hidden">
            <motion.span
              aria-hidden
              animate={reduced ? {} : { x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="flex"
            >
              <MoveHorizontal className="h-3.5 w-3.5" />
            </motion.span>
            Swipe to explore
          </div>
        )}

        <ScrollReveal className="mt-6 md:mt-16">
          <div
            ref={rowRef}
            onMouseLeave={() => {
              if (!isMobile) setActive(0)
            }}
            onScroll={() => {
              if (isMobile && !programmaticScrollRef.current) setPaused(true)
            }}
            className={cn(
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              isMobile && "[mask-image:linear-gradient(90deg,#000_calc(100%-2rem),transparent)]",
            )}
            style={{ overflowX: isMobile ? "auto" : "visible" }}
          >
            <StaggerGroup
              className="flex h-[360px] gap-2 snap-x snap-mandatory sm:h-[400px] md:h-[480px] md:snap-none md:gap-3"
              stagger={0.05}
            >
              {items.map((item, i) => (
                <motion.div
                  key={item.slug}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  variants={itemVariants}
                  className="flex h-full min-w-0 snap-start overflow-hidden transition-[flex] ease-[var(--strip-ease)]"
                  style={
                    {
                      "--strip-ease": STRIP_EASE,
                      transitionDuration: `${STRIP_MS}ms`,
                      flex: isMobile
                        ? active === i
                          ? "0 0 min(300px, 82vw)"
                          : "0 0 64px"
                        : active === i
                          ? "4.5 4.5 0%"
                          : "1 1 0%",
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => {
                    if (!isMobile) setActive(i)
                  }}
                  onClick={() => {
                    if (isMobile) {
                      changeSourceRef.current = "manual"
                      setActive(i)
                      setPaused(true)
                    }
                  }}
                >
                  <FilmstripCard item={item} active={active === i} />
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
