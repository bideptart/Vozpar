"use client"

import type React from "react"
import { motion, type Variants } from "@/lib/motion"
import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i },
  }),
}

export function ScrollReveal({ children, className, delay = 0, y = 24 }: ScrollRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      variants={{
        hidden: { opacity: 0, y },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i },
        }),
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

type StaggerProps = {
  children: React.ReactNode
  className?: string
  /** Delay between each direct child */
  stagger?: number
}

export function StaggerGroup({ children, className, stagger = 0.08 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={variants} className={cn(className)}>
      {children}
    </motion.div>
  )
}
