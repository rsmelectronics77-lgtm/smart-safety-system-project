"use client";

import {
  LayoutDashboard,
  Radio,
  BarChart3,
  AlertTriangle,
  HardDrive,
  Settings,
  Flame,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sensors", label: "Sensors", icon: Radio },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "devices", label: "Devices", icon: HardDrive },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  page,
  setPage,
  mobileOpen,
  setMobileOpen,
}: {
  page: string;
  setPage: (p: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/55 z-40 md:hidden" />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-[232px] bg-surface border-r border-border flex flex-col z-50 transition-transform duration-200 pt-[env(safe-area-inset-top)]
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="px-5 py-[22px] pb-[18px] flex items-center gap-2.5 border-b border-border-soft">
          <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-info to-[#0891B2] flex items-center justify-center shrink-0">
            <Flame size={17} className="text-[#04121a]" />
          </div>
          <div>
            <div className="font-extrabold text-[14.5px] tracking-tight">SMART SAFETY</div>
            <div className="font-mono text-[10.5px] text-text-faint">v1.0 monitoring</div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto bg-transparent border-none text-text-muted md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = page === item.id;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-[11px] px-3 py-2.5 rounded-lg text-left w-full text-[13.5px] transition-colors
                border-l-2 ${active ? "border-info bg-surface-2 text-text font-semibold" : "border-transparent text-text-muted font-medium hover:bg-surface-2"}`}
              >
                <ItemIcon size={18} className={active ? "text-info" : "text-text-faint"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-soft">
          <div className="flex items-center gap-2.5 px-[11px] py-2.5 bg-surface-2 rounded-[9px] border border-border-soft">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulseDot shrink-0" />
            <div className="text-[11.5px] leading-tight">
              <div className="text-text font-semibold">ESP8266</div>
              <div className="font-mono text-text-faint">Living Room</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
