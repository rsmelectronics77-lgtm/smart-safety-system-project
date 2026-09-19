"use client";

import { LucideIcon, ChevronUp, ChevronDown } from "lucide-react";
import Badge from "./Badge";
import Sparkline from "./charts/Sparkline";
import GasGauge from "./charts/GasGauge";
import { StatusLevel } from "@/types/sensor";
import { STATUS_LABEL } from "@/lib/statusColors";
import { timeAgo } from "@/lib/format";

function TrendPill({ current, previous }: { current: number; previous?: number }) {
  if (previous == null) return null;
  const diff = Math.round((current - previous) * 10) / 10;
  if (Math.abs(diff) < 0.05) {
    return <span className="font-mono text-[11px] text-text-faint">steady</span>;
  }
  const up = diff > 0;
  return (
    <span className={`font-mono text-[11px] inline-flex items-center gap-0.5 ${up ? "text-warn" : "text-info"}`}>
      {up ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      {Math.abs(diff)}
    </span>
  );
}

export default function SensorCard({
  icon: IconEl,
  label,
  value,
  unit,
  status,
  history,
  prevValue,
  color,
  isGas,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit?: string;
  status: StatusLevel;
  history?: number[];
  prevValue?: number;
  color: string;
  isGas?: boolean;
}) {
  return (
    <div className="bg-surface border border-border rounded-[14px] px-[18px] pt-[18px] pb-4 flex flex-col gap-1 transition-all hover:-translate-y-0.5 hover:border-[#2A3746] animate-fadeSlideIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center" style={{ background: `${color}18`, color }}>
            <IconEl size={17} />
          </div>
          <span className="text-[13.5px] text-text-muted font-medium">{label}</span>
        </div>
        <Badge status={status}>{STATUS_LABEL[status]}</Badge>
      </div>

      {isGas ? (
        <div className="flex justify-center py-2">
          <GasGauge value={value} status={status} />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="font-mono text-[34px] font-bold tracking-tight">{value}</span>
            <span className="font-mono text-[15px] text-text-faint">{unit}</span>
            <TrendPill current={value} previous={prevValue} />
          </div>
          {history && (
            <div className="mt-1.5">
              <Sparkline data={history} color={color} />
            </div>
          )}
        </>
      )}
      <div className="font-mono text-[10.5px] text-text-faint mt-1">Updated {timeAgo(0)}</div>
    </div>
  );
}
