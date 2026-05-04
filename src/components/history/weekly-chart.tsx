"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyPoint } from "@/lib/history/compute-stats";

interface WeeklyChartProps {
  data: WeeklyPoint[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div style={{ width: "100%", minWidth: 0, height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="m" />
          <Tooltip
            formatter={(value) => [
              `${typeof value === "number" ? value : Number(value)} min`,
              "Focus",
            ]}
          />
          <Line
            type="monotone"
            dataKey="focusMinutes"
            stroke="#397097"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
