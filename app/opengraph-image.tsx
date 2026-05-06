import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "9278.ai — AI voice agents that actually sound human"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "radial-gradient(80% 60% at 50% 0%, rgba(56,189,248,0.28), rgba(15,23,42,0)) , linear-gradient(135deg, #0b1220 0%, #0f172a 60%, #0b1220 100%)",
        color: "#f8fafc",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 26,
            color: "#0b1220",
          }}
        >
          9
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>9278.ai</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          AI voice agents that actually sound human.
        </div>
        <div style={{ fontSize: 30, color: "#94a3b8", maxWidth: 980, lineHeight: 1.3 }}>
          Carrier-grade phone numbers. Sub-second latency. Pay-as-you-go from $0.10 / minute.
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 12, color: "#94a3b8", fontSize: 22 }}>
          <span>9278.ai</span>
          <span>·</span>
          <span>Real-time voice AI for sales, support & operations</span>
        </div>
        <div
          style={{
            border: "1px solid rgba(148,163,184,0.4)",
            borderRadius: 999,
            padding: "10px 18px",
            color: "#e2e8f0",
            fontSize: 22,
          }}
        >
          Get started →
        </div>
      </div>
    </div>,
    size,
  )
}
