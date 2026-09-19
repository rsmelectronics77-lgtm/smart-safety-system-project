"use client";

import { AlertTriangle } from "lucide-react";
import StatusDot from "./StatusDot";
import { StatusLevel } from "@/types/sensor";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/statusColors";
import { tempStatus, humidityStatus, gasStatus } from "@/lib/thresholds";

export default function SystemStatusHero({
  overall,
  temp,
  humidity,
  gas,
  deviceOnline,
}: {
  overall: StatusLevel;
  temp: number;
  humidity: number;
  gas: number;
  deviceOnline: boolean;
}) {
  const isNormal = overall === "safe";
  const isDanger = overall === "danger";
  const title = isDanger ? "GAS DANGER" : overall === "warning" ? "GAS WARNING" : "SYSTEM NORMAL";
  const desc = isDanger
    ? "Gas level is critically high. Ventilate the area immediately."
    : overall === "warning"
    ? "Gas level is above the configured safety threshold."
    : "All sensors are operating normally.";

  const rows: { label: string; status: StatusLevel; override?: string }[] = [
    { label: "Temperature", status: tempStatus(temp) },
    { label: "Humidity", status: humidityStatus(humidity) },
    { label: "Gas", status: gasStatus(gas) },
    { label: "Device", status: deviceOnline ? "safe" : "danger", override: deviceOnline ? "Online" : "Offline" },
  ];

  return (
    <section
      className={`rounded-2xl p-6 relative overflow-hidden bg-gradient-to-b from-surface to-surface-2 border animate-fadeSlideIn`}
      style={{ borderColor: `${STATUS_COLOR[overall]}2E` }}
    >
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[11.5px] text-text-faint tracking-widest mb-2.5">SYSTEM STATUS</div>
          <div className="flex items-center gap-2.5 mb-2">
            <StatusDot status={overall} size={11} pulse={!isNormal} />
            <h1 className="m-0 font-extrabold tracking-tight text-[clamp(22px,3vw,30px)]" style={{ color: STATUS_COLOR[overall] }}>
              {title}
            </h1>
          </div>
          <p className="m-0 text-text-muted text-[14.5px] max-w-[440px] leading-relaxed">{desc}</p>
        </div>
        {!isNormal && (
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[13px] font-semibold shrink-0"
            style={{ background: `${STATUS_COLOR[overall]}14`, border: `1px solid ${STATUS_COLOR[overall]}44`, color: STATUS_COLOR[overall] }}
          >
            <AlertTriangle size={16} /> Action recommended
          </div>
        )}
      </div>

      <div className="grid gap-3 mt-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
        {rows.map((r) => (
          <div key={r.label} className="bg-white/[0.02] border border-border-soft rounded-[10px] px-3.5 py-2.5">
            <div className="text-[11.5px] text-text-faint mb-1.5">{r.label}</div>
            <div className="flex items-center gap-1.5">
              <StatusDot status={r.status} size={7} />
              <span className="font-mono text-[13px] font-semibold" style={{ color: STATUS_COLOR[r.status] }}>
                {r.override || STATUS_LABEL[r.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
