"use client"

import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Clock, Sparkles } from "lucide-react"
import {
  FloatingAccents,
  ParticleField,
  FloatingIconBadges,
} from "@/components/industries/industries-fx"

export function ContactHero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12])

  const spotlightX = useTransform(springX, [-0.5, 0.5], [20, 80])
  const spotlightY = useTransform(springY, [-0.5, 0.5], [20, 80])

  const spotlight = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(650px circle at ${x}% ${y}%, rgba(4, 107, 210, 0.22), transparent 70%)`
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden border-b border-white/10 bg-black pt-24 pb-16 md:pt-32 md:pb-24"
      suppressHydrationWarning
    >
      <FloatingAccents />
      <ParticleField />
      <FloatingIconBadges />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      {/* 3D Dynamic Cursor Spotlight */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-100 transition-opacity duration-500"
        style={{ background: spotlight }}
      />

      {/* Ambient 3D Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.5, 0.35],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[15%] left-[25%] h-[450px] w-[450px] rounded-full bg-sky-500/15 blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] right-[20%] h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[120px]"
        />

        {/* 3D Perspective Grid */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="absolute inset-[-30%] bg-grid bg-[size:55px_55px] opacity-15 pointer-events-none"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> WE'D LOVE TO HEAR FROM YOU
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-balance font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3rem] lg:text-[3.25rem]"
        >
          Get in <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">touch.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-pretty font-sans text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl max-w-2xl mx-auto"
        >
          Whether you have a question about pricing, want to see a live demo, or need help with your AI voice agents — the Vozpar team is here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-md text-xs font-medium text-slate-300 shadow-lg"
        >
          <Clock className="h-4 w-4 text-sky-400 animate-pulse" />
          <span>Mon–Sat, 9 AM – 7 PM IST · <strong className="text-white font-semibold">Critical support 24/7</strong></span>
        </motion.div>
      </div>
    </div>
  )
}
