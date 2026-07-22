import { industriesBody, industriesHeading, industriesHeadingAlt, industriesMono } from "@/lib/industries-fonts"

/**
 * Typography role scale for the /industries page, matching the provided
 * spec (Archivo 500 headings / Inter 300–600 body / monospace eyebrows).
 * Each element on the page is mapped to the closest-fitting role below
 * rather than styled ad hoc, so the page reads as one consistent system.
 *
 * className constants (headingType, bodyType) already include the font's
 * `.className` — apply them directly, no need to also add
 * industriesHeading/industriesBody.className again.
 *
 * monoStyle entries are plain style objects (font-family here is a raw
 * string, not a next/font className) — spread them into a `style` prop.
 * They don't set `textTransform`; add Tailwind's `uppercase` at the call
 * site alongside color/layout classes.
 */

// Archivo, always negative tracking (H1 bumped to 700/weight for a bolder,
// bigger agency-style hero statement — onething.design reference redesign).
export const headingType = {
  /** H1 — hero */
  h1: `${industriesHeading.className} font-bold text-[68px] leading-[1.04] tracking-[-2.2px]`,
  /** H2 — section headline (swapped to industriesHeadingAlt per reference image; see industries-fonts.ts) */
  h2: `${industriesHeadingAlt.className} font-bold text-[56px] leading-[1.05] tracking-[-1.4px]`,
  /** H3 */
  h3: `${industriesHeading.className} font-medium text-[30px] leading-[1.2] tracking-[-0.75px]`,
  /** H4 / card title */
  h4: `${industriesHeading.className} font-medium text-[24px] leading-[1.2] tracking-[-0.5px]`,
} as const

// Inter, 300–600, always normal tracking.
export const bodyType = {
  /** Paragraph copy */
  paragraph: `${industriesBody.className} font-light text-[15px] leading-[1.6] tracking-normal`,
  /** Intro / subhead (e.g. hero subheading) */
  intro: `${industriesBody.className} font-light text-[18px] leading-[1.5] tracking-normal`,
  /** Plain links & nav-style text */
  linkNav: `${industriesBody.className} font-normal text-[16px] leading-[1.5] tracking-normal`,
  /** Buttons and button-like pills/links */
  button: `${industriesBody.className} font-medium text-[15px] leading-[1.5] tracking-normal`,
  /** List items */
  listItem: `${industriesBody.className} font-normal text-[14px] leading-[1.4] tracking-normal`,
  /** Small print */
  smallPrint: `${industriesBody.className} font-normal text-[12px] leading-[1.4] tracking-normal`,
  /** Labels / emphasis */
  labelEmphasis: `${industriesBody.className} font-semibold text-[14px] leading-[1.4] tracking-normal`,
} as const

// System ui-monospace, uppercase eyebrow labels & tags.
export const monoStyle = {
  sectionTag: {
    fontFamily: industriesMono,
    fontWeight: 400,
    fontSize: "11px",
    letterSpacing: "1.6px",
    lineHeight: 1.2,
  },
  tinyLabel: {
    fontFamily: industriesMono,
    fontWeight: 400,
    fontSize: "8px",
    letterSpacing: "0.4px",
    lineHeight: 1.2,
  },
  strongLabel: {
    fontFamily: industriesMono,
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.55px",
    lineHeight: 1.2,
  },
} as const
