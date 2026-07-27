import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, Geist_Mono, Archivo } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { SITE } from "@/lib/seo"
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/jsonld"
import { PageviewTracker } from "@/components/analytics/pageview-tracker"
import { ScrollProgressBar } from "@/components/animation/scroll-progress-bar"

// Vozpar typography (per the brand reference doc):
//   Archivo 500 — all headings, always with negative tracking
//   Inter 300/400/500/600 — body, paragraphs, nav, buttons, UI
//   Monospace — small uppercase eyebrow labels and tags
// Instrument Serif is kept for now because pages outside /features still
// reference `font-serif`; it can go once they're migrated too.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
})
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Answer every call with AI that sounds human`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "AI voice agent",
    "AI phone agent",
    "voice AI",
    "real-time voice AI",
    "AI receptionist",
    "AI cold caller",
    "AI sales agent",
    "voice bot",
    "SIP voice AI",
    "AI call center",
    "Vozpar",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  generator: "v0.app",
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Answer every call with AI that sounds human`,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
    title: `${SITE.name} — Answer every call with AI that sounds human`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    // The site renders the same true-black canvas regardless of the OS
    // preference (no toggle is wired up), so both entries match --background.
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black text-foreground" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${archivo.variable} ${instrumentSerif.variable} ${geistMono.variable} font-sans antialiased bg-black text-foreground`}
        suppressHydrationWarning
      >
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {/* Mounted once here so every route gets it — was previously added
            page-by-page (Home imported it directly, Industries used its own
            older version). See components/animation/scroll-progress-bar.tsx
            for what it does; components/industries/scroll-progress.tsx is
            the old per-page version this supersedes. */}
        <ScrollProgressBar />
        {/* next-themes' ThemeProvider used to wrap everything here. Removed:
            there's no theme toggle wired into the UI (theme-toggle.tsx is
            unused), no Toaster is mounted to consume it, and it defaulted to
            "light" anyway — which never applied the .dark class the CSS is
            built around, so it was doing nothing visually. It's also a
            known source of "state update on a component that hasn't mounted
            yet" dev warnings in React 18/19 strict mode, which is exactly
            what showed up in the console. If theming is wired up again
            later, re-add <ThemeProvider> from @/components/theme-provider
            here. */}
        <Suspense fallback={null}>
          <PageviewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
