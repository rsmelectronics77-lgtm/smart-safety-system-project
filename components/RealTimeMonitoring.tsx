"use client";

import { useState } from "react";
import RealTimeChart from "./charts/RealTimeChart";
import { HistorySeries } from "@/types/sensor";

const RANGE_OPTIONS = [
  { id: "1h", label: "Last 1 hour" },
  { id: "6h", label: "Last 6 hours" },
  { id: "24h", label: "Last 24 hours" },
  { id: "7d", label: "Last 7 days" },
];

const METRIC_OPTIONS = [
  { id: "temperature", label: "Temperature", unit: "°C", color: "#22D3EE" },
  { id: "humidity", label: "Humidity", unit: "%", color: "#38BDF8" },
  { id: "gas", label: "Gas", unit: "ppm", color: "#FBBF24" },
] as const;

export default function RealTimeMonitoring({ history }: { history: HistorySeries }) {
  const [metric, setMetric] = useState<"temperature" | "humidity" | "gas">("temperature");
  const [range, setRange] = useState("1h");
  const meta = METRIC_OPTIONS.find((m) => m.id === metric)!;
  const data = history[metric];

  return (
    <section className="bg-surface border border-border rounded-[14px] px-5 pt-[18px] pb-2.5 animate-fadeSlideIn">
      <div className="flex justify-between items-center gap-3 flex-wrap mb-3.5">
        <div>
          <div className="font-bold text-[15px]">Real-Time Monitoring</div>
          <div className="font-mono text-[11px] text-text-faint">Live sensor trend · mock stream</div>
        </div>
        <div className="flex gap-1 bg-surface-2 p-1 rounded-[9px] border border-border-soft overflow-x-auto">
          {METRIC_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`px-2.5 py-1.5 rounded-md text-[12.5px] font-semibold whitespace-nowrap ${
                metric === m.id ? "bg-border text-text" : "bg-transparent text-text-muted"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <RealTimeChart data={data} color={meta.color} unit={meta.unit} />

      <div className="flex gap-1.5 py-2.5 pb-4 overflow-x-auto">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap border"
            style={{
              borderColor: range === r.id ? "#22D3EE" : "#1C2530",
              background: range === r.id ? "#0B2730" : "transparent",
              color: range === r.id ? "#22D3EE" : "#4B5A6A",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>
    </section>
  );
}
