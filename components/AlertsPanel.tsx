"use client";

import { Check, AlertTriangle, Cpu } from "lucide-react";
import { AlertItem } from "@/types/sensor";
import { STATUS_COLOR, STATUS_DIM } from "@/lib/statusColors";

const ALERT_ICON = { warning: AlertTriangle, danger: AlertTriangle, safe: Check, info: Cpu } as const;

export default function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <section className="bg-surface border border-border rounded-[14px] px-5 py-[18px] flex flex-col h-full animate-fadeSlideIn">
      <div className="flex justify-between items-center mb-3.5">
        <div className="font-bold text-[15px]">Alerts</div>
        <button className="bg-transparent border-none text-info text-[12.5px] font-semibold">View all alerts</button>
      </div>
      <div className="flex flex-col overflow-y-auto">
        {alerts.map((a) => {
          const AlertIcon = ALERT_ICON[a.level] ?? Cpu;
          const color = STATUS_COLOR[a.level] ?? STATUS_COLOR.info;
          return (
            <div key={a.id} className="flex gap-2.5 py-2.5 px-1 border-b border-border-soft">
              <div
                className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                style={{ background: STATUS_DIM[a.level] ?? STATUS_DIM.info, color }}
              >
                <AlertIcon size={14} />
              </div>
              <div>
                <div className="text-[13px] text-text leading-snug">{a.message}</div>
                <div className="font-mono text-[11px] text-text-faint mt-0.5">{a.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
