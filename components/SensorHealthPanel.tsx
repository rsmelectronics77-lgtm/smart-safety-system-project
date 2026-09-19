"use client";

import Badge from "./Badge";
import { SensorHealth } from "@/types/sensor";

const LABEL: Record<string, string> = {
  operational: "Operational",
  connected: "Connected",
  unavailable: "Sensor unavailable",
};

export default function SensorHealthPanel({ sensors }: { sensors: SensorHealth[] }) {
  const statusFor = (s: string) => (s === "unavailable" ? "danger" : "safe") as const;
  return (
    <section className="bg-surface border border-border rounded-[14px] px-5 py-[18px] animate-fadeSlideIn">
      <div className="font-bold text-[15px] mb-3.5">Sensor Health</div>
      <div className="flex flex-col gap-2.5">
        {sensors.map((s) => (
          <div key={s.id} className="flex justify-between items-center">
            <div>
              <div className="text-[13px] font-semibold">{s.name}</div>
              <div className="font-mono text-[10.5px] text-text-faint">{s.role}</div>
            </div>
            <Badge status={statusFor(s.status)}>{LABEL[s.status]}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
