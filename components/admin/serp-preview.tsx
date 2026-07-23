import { SITE } from "@/lib/seo"

export function SerpPreview({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) {
  const breadcrumb = `${SITE.domain}${path === "/" ? "" : ` › ${path.slice(1).split("/").join(" › ")}`}`
  return (
    <div className="rounded-md border border-border/50 bg-card/30 p-3">
      <div className="text-[11px] text-muted-foreground">{breadcrumb}</div>
      <div className="mt-1 text-base font-medium text-primary/90">{title}</div>
      <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{description}</div>
    </div>
  )
}
