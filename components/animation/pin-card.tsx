"use client"

import { useRef, type ReactNode } from "react"
import { motion } from "motion/react"

/** 3D "pin" glass card shell, in the spirit of the Aceternity/21st.dev
 * "3D Pin" and "Glass Card" components. Third pass: the first version leaned
 * on static/ambient glows that bled past the card edges onto neighbouring
 * elements, so those got cut. What's left needed more life on its own —
 * this adds a cursor-tracking spotlight (the actual signature of the
 * "glass card" reference, contained strictly inside the card via
 * overflow-hidden), a two-layer counter-rotating ring instead of one flat
 * sweep, and a drop-in entrance so the card itself arrives like the pin is
 * placing it. The spotlight position updates via a direct CSS-variable
 * write on the DOM node in the mousemove handler rather than React state,
 * so tracking the cursor doesn't trigger a re-render on every pixel of
 * movement. Shared by `HowItWorks` and `HumanExperience`; `accent` keeps
 * each card's own colour. */
export function PinCard({
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
    <div className="relative flex h-full flex-col pb-16" style={{ perspective: "1200px" }}>
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: -18, rotateX: 20, scale: 0.94 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        whileHover={reduced ? undefined : { rotateX: 12, rotateY: -10, y: -10, scale: 1.03 }}
        className="group relative flex-1 [transform-style:preserve-3d]"
      >
        {/* Two counter-rotating rings instead of one flat sweep — a bright
            fast inner arc and a dimmer, slower outer one running the other
            direction, both clipped tight to the card so nothing spills onto
            whatever sits next to it (the step connector arrows, mainly). */}
        <div className="absolute -inset-px overflow-hidden rounded-2xl">
          {!reduced && (
            <>
              <motion.div
                className="absolute inset-[-60%]"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, ${accent} 30deg, transparent 90deg, transparent 360deg)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-[-60%] opacity-50"
                style={{
                  background: `conic-gradient(from 180deg, transparent 0deg, color-mix(in oklch, ${accent} 55%, transparent) 50deg, transparent 140deg, transparent 360deg)`,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </>
          )}
        </div>

        {/* Frosted glass body. Cursor spotlight + diagonal shine both live
            inside this overflow-hidden layer, so neither can bleed past the
            card's own rounded corners. */}
        <div
          ref={glassRef}
          onMouseMove={handleMove}
          className="relative h-full m-px overflow-hidden rounded-[15px] backdrop-blur-xl transition-[background] duration-500"
          style={{
            background: "linear-gradient(165deg, rgba(255,255,255,0.06), rgba(9,11,15,0.75) 45%, rgba(9,11,15,0.9))",
            ["--mx" as string]: "50%",
            ["--my" as string]: "50%",
          }}
        >
          {!reduced && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(240px circle at var(--mx) var(--my), color-mix(in oklch, ${accent} 22%, transparent), transparent 70%)`,
              }}
            />
          )}

          {/* Diagonal shine sweep on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-y-4 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent opacity-0 transition-all duration-500 group-hover:left-[130%] group-hover:opacity-100"
          />

          {children}
        </div>
      </motion.div>

      {/* The pin: beam + glowing tip (with a soft radar ping) + a landed
          glow on the ground. Idles with a gentle bob so it still reads as
          alive at rest. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
        <motion.div
          className="w-px origin-top"
          style={{ height: 44, background: `linear-gradient(to bottom, ${accent}, transparent)` }}
          initial={reduced ? undefined : { scaleY: 0, opacity: 0 }}
          whileInView={reduced ? undefined : { scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        />
        <motion.span
          className="relative -mt-0.5 flex h-2 w-2 items-center justify-center"
          animate={reduced ? undefined : { y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          {!reduced && (
            <motion.span
              className="absolute h-full w-full rounded-full"
              style={{ background: accent }}
              animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
            />
          )}
          <motion.span
            className="relative h-2 w-2 rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px 2px ${accent}` }}
            animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.span>
        <div className="mt-1 h-2 w-16 rounded-full blur-md" style={{ background: accent, opacity: 0.35 }} />
      </div>
    </div>
  )
}
