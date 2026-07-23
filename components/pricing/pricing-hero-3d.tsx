"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"

export function PricingHero3D() {
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springCfg = { stiffness: 80, damping: 20, mass: 1.2 }
  const sx = useSpring(mouseX, springCfg)
  const sy = useSpring(mouseY, springCfg)

  // Subtle 3D perspective rotation values
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8])

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="absolute inset-0 -z-20 overflow-hidden bg-background"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Tilted Grid */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-[-30%] opacity-20 bg-grid bg-[size:45px_45px] pointer-events-none"
      />

      {/* Floating 3D Glowing Orbs */}
      <motion.div
        animate={{
          y: [0, -35, 0],
          scale: [1, 1.12, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[15%] left-[15%] h-[450px] w-[450px] rounded-full bg-primary/20 blur-[100px]"
      />
      <motion.div
        animate={{
          y: [0, 35, 0],
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[25%] right-[10%] h-[380px] w-[380px] rounded-full bg-primary/10 blur-[110px]"
      />
    </div>
  )
}
