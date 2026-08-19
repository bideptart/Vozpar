// Route through the installed CJS bundle directly to avoid Turbopack
// resolution issues with the package entrypoints in this environment.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Motion = require("../node_modules/framer-motion/dist/cjs/index.js")

export const motion = Motion.motion
export const AnimatePresence = Motion.AnimatePresence
export const animate = Motion.animate
export const useInView = Motion.useInView
export const useMotionTemplate = Motion.useMotionTemplate
export const useMotionValue = Motion.useMotionValue
export const useReducedMotion = Motion.useReducedMotion
export const useScroll = Motion.useScroll
export const useSpring = Motion.useSpring
export const useTransform = Motion.useTransform

export type Variants = Record<string, unknown>
