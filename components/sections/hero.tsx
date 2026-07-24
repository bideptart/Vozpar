"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, PhoneCall, Sparkles } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import { HeroOrbs, HeroParticles, HeroIconBadges, HeroLightSweep } from "@/components/sections/hero-fx"
import { HeroVoiceOrb } from "@/components/sections/hero-orb"
import { industriesHeading, industriesBody, industriesMono } from "@/lib/industries-fonts"

/**
 * Second full redesign of the homepage hero, per explicit request for a
 * "completely different, unique, and animated" treatment. Replaces the
 * previous two-column copy/dashboard-panel layout with a single centered
 * column: a clip-path "wipe" headline reveal (rather than word-by-word
 * blur-in), cursor-tracked parallax on the background orbs/particles, a
 * scroll-linked fade/parallax exit as the section scrolls past, and a new
 * centerpiece — HeroVoiceOrb (hero-orb.tsx), a circular radial-waveform +
 * pulsing AI orb visualization with floating transcript/stat chips —
 * replacing the old rectangular "dashboard mockup" panel entirely. Still
 * solid black + hero-fx.tsx ambient accents, still page-scoped (no imports
 * from components/industries/). Also now reuses the /industries page's
 * font system (industriesHeading = Archivo, industriesBody = Inter,
 * industriesMono for the eyebrow) per explicit request — see the updated
 * note in lib/industries-fonts.ts; this is a shared typography module, not
 * a page-scoped visual component, so reusing it across pages is intentional
 * and doesn't conflict with the industries-only-components convention.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)

  const sectionRef = useRef<HTMLElement>(null)

  // Cursor-tracked parallax on the background layers
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const parallaxSpring = { stiffness: 60, damping: 20, mass: 0.6 }
  const psx = useSpring(px, parallaxSpring)
  const psy = useSpring(py, parallaxSpring)
  const orbsX = useTransform(psx, [-0.5, 0.5], [-24, 24])
  const orbsY = useTransform(psy, [-0.5, 0.5], [-18, 18])
  const particlesX = useTransform(psx, [-0.5, 0.5], [12, -12])
  const particlesY = useTransform(psy, [-0.5, 0.5], [9, -9])

  function handleSectionMove(e: React.MouseEvent<HTMLElement>) {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleSectionLeave() {
    px.set(0)
    py.set(0)
  }

  // Scroll-linked exit parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const scrollOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2])
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -60])

  useEffect(() => {
    const audio = new Audio("/hpvoice.mp3")
    audio.preload = "auto"
    audio.load()
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  const playHoverAudio = () => {
    if (hasPlayedRef.current) return
    const audio = audioRef.current
    if (!audio) return
    hasPlayedRef.current = true
    audio.currentTime = 0
    audio.play().catch(() => {
      hasPlayedRef.current = false
    })
  }

  const lineReveal: Variants = {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } },
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      {/* Layered background — solid black, no grid (per explicit request, matching /industries) */}
      <motion.div style={reduced ? undefined : { x: orbsX, y: orbsY }} className="absolute inset-0">
        <HeroOrbs />
      </motion.div>
      <motion.div style={reduced ? undefined : { x: particlesX, y: particlesY }} className="absolute inset-0">
        <HeroParticles />
      </motion.div>
      <HeroIconBadges />
      {!reduced && <HeroLightSweep />}

      <motion.div
        style={reduced ? undefined : { opacity: scrollOpacity, y: scrollY }}
        className={`relative z-10 mx-auto w-full max-w-4xl px-4 py-24 text-center md:px-6 ${industriesBody.className}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="ai-pill-cyan mx-auto"
          style={{ fontFamily: industriesMono }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Live
          <span className="h-3 w-px bg-white/20" />
          v9278.audio-1
          <span className="h-3 w-px bg-white/20" />
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Native audio · Sub-second latency · Self-hosted
        </motion.div>

        {/* Headline — clip-path "wipe" reveal, one line at a time */}
        <h1
          className={`mt-7 text-balance font-normal leading-[1.03] tracking-tight text-white ${industriesHeading.className}`}
        >
          <motion.div initial="hidden" animate="visible" variants={lineReveal} className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px]">
            AI voice agents that
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={lineReveal}
            transition={{ delay: 0.25 }}
            className="mt-1 text-4xl italic text-primary sm:text-5xl md:text-6xl lg:text-[68px]"
          >
            actually sound human.
          </motion.div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base font-light leading-relaxed text-muted-foreground"
        >
          Build, launch, and scale voice agents on a self-hosted control panel. Native audio, real interruptions, and
          your own phone numbers — production-ready in an afternoon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <div className="group/btn relative overflow-hidden rounded-full">
            <Button
              size="lg"
              className="group relative h-12 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-7 text-white shadow-[0_10px_30px_-10px_var(--primary)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-12px_var(--primary)]"
            >
              <span className="relative z-10">Build your first agent</span>
              <ArrowRight
                className="relative z-10 ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-140%", "340%"] }}
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "easeInOut" }}
            />
          </div>
          <Button
            size="lg"
            variant="outline"
            onPointerEnter={playHoverAudio}
            className="group h-12 rounded-full border-white/15 bg-white/[0.03] px-7 backdrop-blur-md hover:border-primary/50 hover:bg-white/[0.06]"
          >
            <PhoneCall className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
            Try the live demo
          </Button>
        </motion.div>

        {/* Centerpiece: circular voice orb visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 md:mt-20"
        >
          <HeroVoiceOrb />
        </motion.div>

        {/* Trust stats — inline ticker under the orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mx-auto mt-2 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-6"
        >
          <div>
            <p className="text-xl font-semibold tracking-tight text-primary">&lt;300ms</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Sub-second latency</p>
          </div>
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <div>
            <p className="text-xl font-semibold tracking-tight text-primary">Self-hosted</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Your data, your stack</p>
          </div>
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <div>
            <p className="text-xl font-semibold tracking-tight text-primary">Unlimited</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Concurrent calls</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Carrier trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/50 py-5"
      >
        <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Connect your carrier account in two clicks
        </p>
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-muted-foreground/90">
          Phone numbers, SIP trunks, and inbound routing flow through the carrier you already know and trust — your
          numbers, your billing, unchanged.
        </p>
      </motion.div>
    </section>
  )
}
