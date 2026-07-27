"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowDown, Zap, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  FloatingAccents,
  ParticleField,
  FloatingIconBadges,
} from "@/components/industries/industries-fx"

export function PricingHero3D() {
  return (
    <div
      className="relative overflow-hidden border-b border-white/10 bg-black pt-20 pb-12 md:pt-24 md:pb-16"
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

      {/* 3D Grid Canvas with Perspective */}
      <div className="absolute inset-0 -z-10 overflow-hidden" style={{ perspective: "1000px" }}>
        <div
          className="absolute inset-[-30%] bg-grid bg-[size:50px_50px] opacity-15 pointer-events-none"
        />

        {/* Ambient Glowing Orbs */}
        <motion.div
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] left-[20%] h-[500px] w-[500px] rounded-full bg-sky-500/25 blur-[120px]"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[15%] h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[130px]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center md:px-6">
        {/* Animated Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-sky-300">
            Transparent Voice Pricing
          </span>
        </motion.div>

        {/* Main Animated Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-balance font-heading text-[2.6rem] font-medium leading-[1.07] tracking-[-0.035em] text-white sm:text-5xl md:text-[3rem] lg:text-[3.25rem]"
        >
          Pricing built for{" "}
          <span className="relative inline-block bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            real conversations.
            <motion.span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 mx-auto max-w-3xl font-sans text-base leading-relaxed text-slate-300 md:text-xl"
        >
          Every plan comes with <span className="font-semibold text-white">per-second voice billing</span>,{" "}
          <span className="font-semibold text-sky-300">included minutes</span>, and a{" "}
          <span className="font-semibold text-white">phone number</span>. With{" "}
          <span className="font-semibold text-emerald-400">no setup fees or hidden markups</span>, you can get started in seconds.
        </motion.p>

        {/* Floating Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-white">
            <Clock className="h-4 w-4 text-sky-400 transition-transform duration-300 group-hover:scale-110" />
            <span>Per-Second Precision Billing</span>
          </div>

          <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-white">
            <Zap className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
            <span>Sub-Second Latency</span>
          </div>

          <div className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
            <span>Phone Number Included</span>
          </div>
        </motion.div>

        {/* Scroll CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Button
            asChild
            size="lg"
            className="group relative rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-7 py-6 text-sm font-semibold text-white shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(56,189,248,0.55)]"
          >
            <a href="#plans">
              <span>View Plans & Pricing</span>
              <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
