"use client"

import { motion } from "motion/react"

export function PricingHeroBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Primary Blue Sphere */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] left-[10%] h-[380px] w-[380px] rounded-full bg-primary/20 blur-[90px]"
      />
      {/* Accent Blue Sphere */}
      <motion.div
        animate={{
          y: [0, 25, 0],
          scale: [1, 1.12, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-[15%] right-[12%] h-[320px] w-[320px] rounded-full bg-primary/10 blur-[100px]"
      />
    </div>
  )
}
