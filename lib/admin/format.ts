export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format((cents ?? 0) / 100)
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function planLabel(planId: string | null | undefined): string {
  switch (planId) {
    case "starter":
      return "Starter"
    case "growth":
      return "Growth"
    case "scale":
      return "Scale"
    default:
      return "—"
  }
}

export function statusTone(status: string): "success" | "warning" | "danger" | "muted" {
  switch (status) {
    case "paid":
      return "success"
    case "pending":
      return "warning"
    case "failed":
      return "danger"
    case "refunded":
      return "muted"
    case "active":
      return "success"
    case "canceled":
      return "muted"
    default:
      return "muted"
  }
}
