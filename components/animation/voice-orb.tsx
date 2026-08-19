"use client"

import { motion } from "@/lib/motion"

/**
 * VoiceOrb
 * Layered, glowing orb with orbiting waveform rings + a central
 * audio-style equaliser. Pure CSS / SVG animations driven by motion.
 */
export function VoiceOrb() {
  // Bar config for the equaliser
  const bars = [0.55, 0.85, 1, 0.7, 0.95, 0.5, 0.8]

  return (
    <div
      className="pointer-events-none relative mx-auto h-[320px] w-[320px] md:h-[420px] md:w-[420px]"
      aria-hidden="true"
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Orbiting rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/30"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [0.6, 1.4], opacity: [0.5, 0] }}
          transition={{
            duration: 3.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
            delay: i * 1.05,
          }}
        />
      ))}

      {/* Slow rotating ring with dashes */}
      <motion.div
        className="absolute inset-6 rounded-full border border-dashed border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-14 rounded-full border border-primary/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Core orb */}
      <motion.div
        className="absolute inset-[22%] rounded-full bg-gradient-to-br from-primary/40 via-primary/20 to-background shadow-[0_0_80px_-10px_oklch(0.78_0.16_195/0.6)]"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-transparent to-primary/30" />
      </motion.div>

      {/* Equaliser bars */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 items-center gap-1.5 md:h-20 md:gap-2">
          {bars.map((peak, idx) => (
            <motion.span
              key={idx}
              className="block w-1.5 rounded-full bg-primary md:w-2"
              initial={{ scaleY: 0.3 }}
              animate={{ scaleY: [0.3, peak, 0.4, peak * 0.8, 0.3] }}
              transition={{
                duration: 1.4 + idx * 0.07,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: idx * 0.06,
              }}
              style={{ height: "100%", transformOrigin: "center" }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
