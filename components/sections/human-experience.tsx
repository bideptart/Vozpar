"use client"

import { Waves, Hand, Infinity as InfinityIcon, Zap, Shield, BarChart3 } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/animation/scroll-reveal"

const FEATURES = [
  {
    icon: Waves,
    title: "Zero-lag conversations",
    description:
      "Native audio-to-audio modeling delivers natural warmth and real-time fluidity. No robotic dead air, no pipeline delays.",
    tint: "#2d98f1",
    size: "large", // spans 2 cols on desktop
  },
  {
    icon: Hand,
    title: "Smart interruptions",
    description:
      "Customers can cut in at any moment. The agent stops, listens, and responds the way a real human would.",
    tint: "#046bd2",
    size: "small",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited capacity",
    description:
      "Scale from one call to thousands simultaneously. No busy signals, no queue time.",
    tint: "#2d98f1",
    size: "small",
  },
  {
    icon: Zap,
    title: "Sub-300ms latency",
    description:
      "End-to-end audio processing in under 300ms. Callers feel instant presence — not a bot catching up.",
    tint: "#046bd2",
    size: "small",
  },
  {
    icon: Shield,
    title: "Self-hosted control",
    description:
      "Your data never leaves your stack. Deploy on your infra, your cloud, your rules.",
    tint: "#2d98f1",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    description:
      "Live call dashboards, sentiment tracking, intent detection — all in one control panel.",
    tint: "#046bd2",
    size: "small",
  },
]

function WaveformVisual({ tint, reduced }: { tint: string; reduced: boolean }) {
  const bars = [0.4, 0.65, 0.5, 1, 0.6, 0.85, 0.45, 0.75, 0.55, 0.9, 0.4, 0.7]
  return (
    <div className="flex h-16 items-center justify-center gap-[4px]" aria-hidden>
      {bars.map((f, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full"
          style={{
            height: 44 * f,
            background: `linear-gradient(to top, ${tint}50, ${tint})`,
          }}
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.5, 0.9, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

function InterruptVisual({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <div className="flex h-16 flex-col justify-center gap-2.5 px-2" aria-hidden>
      {/* Agent speaking */}
      <motion.div
        className="flex items-center gap-2"
        animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 1] }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-white/20" />
        <span className="h-1.5 flex-1 rounded-full bg-white/15" />
        <span className="h-1.5 w-1/3 rounded-full bg-white/10" />
      </motion.div>
      {/* Caller cuts in */}
      <div className="flex items-center justify-end gap-2">
        <motion.span
          className="h-1.5 w-2/3 rounded-full"
          style={{ transformOrigin: "right", background: `${tint}60` }}
          animate={reduced ? undefined : { scaleX: [0, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.4, ease: "easeOut" }}
        />
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: tint }} />
      </div>
    </div>
  )
}

function ScaleVisual({ tint, reduced }: { tint: string; reduced: boolean }) {
  const values = [40, 65, 55, 80, 70, 95, 75]
  return (
    <div className="flex h-16 items-end justify-center gap-2 px-2" aria-hidden>
      {values.map((h, i) => (
        <motion.span
          key={i}
          className="block w-3 rounded-t-sm"
          style={{ background: `linear-gradient(to top, ${tint}40, ${tint})` }}
          initial={{ height: 0 }}
          animate={reduced ? { height: h * 0.6 } : { height: [h * 0.4, h * 0.6] }}
          transition={reduced ? { duration: 0.5, delay: i * 0.08 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15, repeatType: "reverse" }}
        />
      ))}
    </div>
  )
}

export function HumanExperience() {
  const reduced = useReducedMotion()

  return (
    <section id="experience" className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(50%_50%_at_50%_0%,rgba(4,107,210,0.08),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
        {/* Section header */}
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#046bd2]/30 bg-[#046bd2]/[0.08] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d98f1]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2d98f1]" />
            The human experience
          </span>
          <h2 className="mt-5 text-balance font-heading text-4xl font-medium leading-[1.04] tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
            Sounds human on call one.
            <br />
            <span className="bg-gradient-to-r from-[#2d98f1] to-[#046bd2] bg-clip-text text-transparent">
              No tuning period required.
            </span>
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-white/40">
            A single audio-native engine — no transcription pipeline, no synthetic relay, no weeks of prompt-tweaking before it's ready to answer.
          </p>
        </ScrollReveal>

        {/* Bento grid */}
        <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Large featured card — Zero-lag */}
          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080A0F] lg:col-span-1"
            >
              {/* Blue top line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2d98f1]/60 to-transparent" />
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                style={{ background: "radial-gradient(40% 50% at 50% 0%, rgba(45,152,241,0.08), transparent)" }}
              />
              <div className="relative flex h-full flex-col p-6">
                {/* Visual */}
                <div className="mb-5 overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
                  <WaveformVisual tint="#2d98f1" reduced={Boolean(reduced)} />
                </div>
                {/* Icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#2d98f1]/25 bg-[#2d98f1]/10">
                  <Waves className="h-5 w-5 text-[#2d98f1]" />
                </div>
                <h3 className="font-heading text-xl font-medium tracking-[-0.02em] text-white">
                  Zero-lag conversations
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  Native audio-to-audio modeling delivers natural warmth and real-time fluidity. No robotic dead air, no pipeline delays.
                </p>
                {/* Tag */}
                <div className="mt-auto pt-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2d98f1]/60">
                    &lt;300ms end-to-end
                  </span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>

          {/* Smart interruptions */}
          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080A0F]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#046bd2]/60 to-transparent" />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                style={{ background: "radial-gradient(40% 50% at 50% 0%, rgba(4,107,210,0.08), transparent)" }}
              />
              <div className="relative flex h-full flex-col p-6">
                <div className="mb-5 overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
                  <InterruptVisual tint="#046bd2" reduced={Boolean(reduced)} />
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#046bd2]/25 bg-[#046bd2]/10">
                  <Hand className="h-5 w-5 text-[#2d98f1]" />
                </div>
                <h3 className="font-heading text-xl font-medium tracking-[-0.02em] text-white">Smart interruptions</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  Customers can cut in at any moment. The agent stops, listens, and responds the way a real human would.
                </p>
                <div className="mt-auto pt-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2d98f1]/60">Natural turn-taking</span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>

          {/* Unlimited capacity */}
          <StaggerItem>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080A0F]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2d98f1]/60 to-transparent" />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                style={{ background: "radial-gradient(40% 50% at 50% 0%, rgba(45,152,241,0.08), transparent)" }}
              />
              <div className="relative flex h-full flex-col p-6">
                <div className="mb-5 overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
                  <ScaleVisual tint="#2d98f1" reduced={Boolean(reduced)} />
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#2d98f1]/25 bg-[#2d98f1]/10">
                  <InfinityIcon className="h-5 w-5 text-[#2d98f1]" />
                </div>
                <h3 className="font-heading text-xl font-medium tracking-[-0.02em] text-white">Unlimited capacity</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  Scale from one call to thousands simultaneously. No busy signals, no queue time.
                </p>
                <div className="mt-auto pt-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2d98f1]/60">∞ concurrent calls</span>
                </div>
              </div>
            </motion.div>
          </StaggerItem>

          {/* Bottom row — wide stat cards */}
          {[
            { icon: Zap, label: "Sub-300ms latency", value: "<300ms", desc: "End-to-end audio processing. Callers feel instant presence.", tint: "#046bd2" },
            { icon: Shield, label: "Self-hosted", value: "Your infra", desc: "Your data never leaves your stack. Your cloud, your rules.", tint: "#2d98f1" },
            { icon: BarChart3, label: "Real-time analytics", value: "Live", desc: "Call dashboards, sentiment, intent detection in one panel.", tint: "#046bd2" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <StaggerItem key={item.label}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080A0F] p-6"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
                    style={{ backgroundImage: `linear-gradient(to right, transparent, ${item.tint}60, transparent)` }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl"
                    style={{ background: `radial-gradient(40% 50% at 50% 0%, ${item.tint}10, transparent)` }}
                  />
                  <div className="relative flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                      style={{ borderColor: `${item.tint}30`, background: `${item.tint}12` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: item.tint }} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-heading text-2xl font-medium leading-none tracking-[-0.02em]"
                        style={{ color: item.tint }}
                      >
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{item.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/35">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
