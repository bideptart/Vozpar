import { Inter, Archivo, Poppins } from "next/font/google"

/**
 * Typeface system originally built for the /industries page: Archivo
 * (weight 500/700, always negative tracking) for headings, Inter
 * (300/400/500/600) for body & UI text, plus a system ui-monospace stack
 * for uppercase eyebrow labels/tags (see industriesMono below — it's a
 * plain font-family string, not a webfont, so nothing to load for it).
 *
 * Superseded pairings, in order: Instrument Serif -> Plus Jakarta Sans ->
 * Playfair Display/DM Sans -> Fraunces/Inter -> this. Kept in its own
 * module (rather than app/layout.tsx) so it's opt-in per page rather than
 * applied site-wide. Originally imported only by industries-page files;
 * the homepage hero (components/sections/hero.tsx) now reuses it too, per
 * an explicit request to match the industries page's font style — this is
 * a shared typography module, not a page-scoped visual component, so
 * reuse across pages is expected. Any other page wanting this look should
 * import directly from here rather than duplicating the font loads.
 */
export const industriesBody = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
})

export const industriesHeading = Archivo({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
})

/**
 * Second heading face used only for the H2 role (the big per-industry
 * headline). Originally matched to a thin, wide-tracked reference (Jost);
 * swapped again to match a new reference image of a bold, round-terminal
 * geometric sans ("B2B Ecommerce Web Development Process"). Poppins is the
 * closest common Google Fonts match to that rounded-bold headline look —
 * treat it as a best visual match, not a confirmed exact identification.
 * H1/H3/H4 stay on Archivo since only this one heading role was asked to
 * change.
 */
export const industriesHeadingAlt = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
})

/**
 * System ui-monospace stack for eyebrow labels & tags — intentionally not a
 * loaded webfont (matches the spec's "system ui-monospace" note). Apply via
 * inline `style={{ fontFamily: industriesMono }}` since it has no
 * next/font `.className` to hand out.
 */
export const industriesMono =
  "ui-monospace, 'SF Mono', 'Cascadia Code', 'Roboto Mono', Menlo, Consolas, 'Liberation Mono', monospace"
