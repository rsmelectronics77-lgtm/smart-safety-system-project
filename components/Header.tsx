"use client";

import { Menu } from "lucide-react";
import StatusDot from "./StatusDot";
import { timeAgo } from "@/lib/format";

export default function Header({
  setMobileOpen,
  secondsAgo,
  connected,
}: {
  setMobileOpen: (v: boolean) => void;
  secondsAgo: number;
  connected: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md border-b border-border pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-3.5 px-5 py-3.5 flex-wrap">
        <button onClick={() => setMobileOpen(true)} className="bg-transparent border-none text-text md:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div>
          <div className="font-bold text-[15px]">Dashboard</div>
          <div className="font-mono text-[11.5px] text-text-faint">ESP8266 • Living Room</div>
        </div>
        <div className="ml-auto flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <StatusDot status={connected ? "safe" : "danger"} pulse={connected} />
            <span className={`font-mono text-xs font-semibold ${connected ? "text-safe" : "text-danger"}`}>
              {connected ? "Online" : "Offline"}
            </span>
          </div>
          <div className="font-mono text-[11.5px] text-text-faint">Last updated: {timeAgo(secondsAgo)}</div>
        </div>
      </div>
    </header>
  );
}
