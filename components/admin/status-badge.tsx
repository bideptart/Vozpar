import { cn } from "@/lib/utils"
import { statusTone } from "@/lib/admin/format"

const toneClass: Record<ReturnType<typeof statusTone>, string> = {
  success: "bg-primary/15 text-primary",
  warning: "bg-amber-500/15 text-amber-300",
  danger: "bg-destructive/20 text-destructive-foreground",
  muted: "bg-muted text-muted-foreground",
}

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        toneClass[tone],
      )}
    >
      {status}
    </span>
  )
}
