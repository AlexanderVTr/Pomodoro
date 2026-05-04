"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyPoint } from "@/lib/history/compute-stats";

interface DailyChartProps {
  data: DailyPoint[];
}

export function DailyChart({ data }: DailyChartProps) {
  return (
    <div style={{ width: "100%", minWidth: 0, height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="m" />
          <Tooltip
            formatter={(value) => [
              `${typeof value === "number" ? value : Number(value)} min`,
              "Focus",
            ]}
          />
          <Bar dataKey="focusMinutes" fill="#ba4949" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
