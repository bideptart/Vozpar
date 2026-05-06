"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function RevenueChart({ data }: { data: { date: string; cents: number }[] }) {
  const series = data.map((d) => ({ date: d.date, revenue: (d.cents ?? 0) / 100 }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.16 195)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="oklch(0.78 0.16 195)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.012 240)" />
        <XAxis
          dataKey="date"
          stroke="oklch(0.7 0.02 240)"
          fontSize={11}
          tickFormatter={(d) =>
            new Date(d as string).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
          minTickGap={24}
        />
        <YAxis
          stroke="oklch(0.7 0.02 240)"
          fontSize={11}
          tickFormatter={(v) => `$${v}`}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.2 0.012 240)",
            border: "1px solid oklch(0.28 0.012 240)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "oklch(0.97 0 0)" }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
          labelFormatter={(d) =>
            new Date(d as string).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="oklch(0.78 0.16 195)"
          strokeWidth={2}
          fill="url(#rev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
