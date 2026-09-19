"use client";

import { Cpu } from "lucide-react";
import StatusDot from "./StatusDot";
import { DeviceInfo } from "@/types/sensor";
import { STATUS_COLOR } from "@/lib/statusColors";
import { formatUptime, timeAgo } from "@/lib/format";

export default function DeviceInfoCard({ device, secondsAgo }: { device: DeviceInfo; secondsAgo: number }) {
  const rows = [
    { label: "Status", value: device.status === "online" ? "Online" : "Offline", status: device.status === "online" ? ("safe" as const) : ("danger" as const) },
    { label: "Wi-Fi", value: device.wifi },
    { label: "IP Address", value: device.ip },
    { label: "Firmware", value: device.firmware },
    { label: "Uptime", value: formatUptime(device.uptimeSeconds + secondsAgo) },
    { label: "Last communication", value: timeAgo(secondsAgo) },
  ];

  return (
    <section className="bg-surface border border-border rounded-[14px] px-5 py-[18px] animate-fadeSlideIn">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-[34px] h-[34px] rounded-[9px] bg-info-dim flex items-center justify-center text-info">
          <Cpu size={17} />
        </div>
        <div>
          <div className="font-bold text-[14.5px]">{device.name}</div>
          <div className="font-mono text-[11px] text-text-faint">{device.location}</div>
        </div>
      </div>
      <div className="flex flex-col">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between py-2 border-b border-border-soft text-[12.5px]">
            <span className="text-text-faint">{r.label}</span>
            <span className="font-mono font-semibold flex items-center gap-1.5" style={{ color: r.status ? STATUS_COLOR[r.status] : "#E7EDF3" }}>
              {r.status && <StatusDot status={r.status} size={6} />}
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
