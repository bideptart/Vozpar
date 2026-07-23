import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "9278.ai — Answer every call with AI voice agents that sound human"
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
          "radial-gradient(80% 60% at 50% 0%, rgba(220,38,38,0.30), rgba(15,23,42,0)) , linear-gradient(135deg, #0b1220 0%, #0f172a 60%, #0b1220 100%)",
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
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 26,
            color: "#ffffff",
          }}
        >
          9
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>9278.ai</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          Answer every call with AI that sounds human.
        </div>
        <div style={{ fontSize: 30, color: "#94a3b8", maxWidth: 980, lineHeight: 1.3 }}>
          Carrier-grade phone numbers · sub-second latency · live in an afternoon. Never miss a call again.
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
