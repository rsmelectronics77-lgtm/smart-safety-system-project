"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export default function RealTimeChart({
  data,
  color,
  unit,
  height = 220,
}: {
  data: number[];
  color: string;
  unit: string;
  height?: number;
}) {
  const chartData = data.map((v, i) => ({ i, value: v }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="lineColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1C2530" vertical={false} />
        <XAxis dataKey="i" hide />
        <YAxis
          tick={{ fill: "#5A6A7A", fontSize: 10, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          width={34}
        />
        <Tooltip
          contentStyle={{ background: "#10151C", border: "1px solid #1C2530", borderRadius: 8, fontSize: 12 }}
          labelFormatter={() => ""}
          formatter={(value: number) => [`${value} ${unit}`, ""]}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={true} />
      </LineChart>
    </ResponsiveContainer>
  );
}
