"use client";

import { useMemo, useState } from "react";
import { Thermometer, Droplet, Flame } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SystemStatusHero from "@/components/SystemStatusHero";
import SensorCard from "@/components/SensorCard";
import RealTimeMonitoring from "@/components/RealTimeMonitoring";
import AlertsPanel from "@/components/AlertsPanel";
import DeviceInfoCard from "@/components/DeviceInfoCard";
import SensorHealthPanel from "@/components/SensorHealthPanel";
import ComingSoon from "@/components/ComingSoon";
import { useSensorPolling } from "@/hooks/useSensorPolling";
import { gasStatus, tempStatus, humidityStatus } from "@/lib/thresholds";
import { StatusLevel } from "@/types/sensor";

export default function Home() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [simulateWarning, setSimulateWarning] = useState(false);

  const { snapshot, prev, history, secondsAgo, device, sensors, alerts } = useSensorPolling(simulateWarning);

  const tStatus = tempStatus(snapshot.temperature);
  const hStatus = humidityStatus(snapshot.humidity);
  const gStatus = gasStatus(snapshot.gas);

  const overall: StatusLevel = useMemo(() => {
    const order: Record<StatusLevel, number> = { safe: 0, info: 0, warning: 1, danger: 2 };
    return [gStatus, tStatus, hStatus].reduce<StatusLevel>((a, b) => (order[b] > order[a] ? b : a), "safe");
  }, [gStatus, tStatus, hStatus]);

  return (
    <div className="flex min-h-full">
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 md:ml-[232px]">
        <Header setMobileOpen={setMobileOpen} secondsAgo={secondsAgo} connected={snapshot.deviceStatus === "online"} />
        <main className="px-5 pt-5 pb-[60px] max-w-[1180px] mx-auto flex flex-col gap-[18px]">
          {page === "dashboard" && (
            <>
              <SystemStatusHero
                overall={overall}
                temp={snapshot.temperature}
                humidity={snapshot.humidity}
                gas={snapshot.gas}
                deviceOnline={snapshot.deviceStatus === "online"}
              />

              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                <SensorCard
                  icon={Thermometer}
                  label="Temperature"
                  value={snapshot.temperature}
                  unit="°C"
                  status={tStatus}
                  history={history.temperature}
                  prevValue={prev?.temperature}
                  color="#22D3EE"
                />
                <SensorCard
                  icon={Droplet}
                  label="Humidity"
                  value={snapshot.humidity}
                  unit="%"
                  status={hStatus}
                  history={history.humidity}
                  prevValue={prev?.humidity}
                  color="#38BDF8"
                />
                <SensorCard icon={Flame} label="Gas Level" value={snapshot.gas} status={gStatus} isGas color="#FBBF24" />
              </div>

              <div className="grid gap-4 items-stretch lg:grid-cols-[2fr_1fr] grid-cols-1">
                <RealTimeMonitoring history={history} />
                <AlertsPanel alerts={alerts} />
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                {device && <DeviceInfoCard device={device} secondsAgo={secondsAgo} />}
                <SensorHealthPanel sensors={sensors} />
              </div>

              <div className="flex items-center gap-2.5 text-[11.5px] text-text-faint border border-dashed border-border rounded-[10px] px-3.5 py-2.5 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={simulateWarning} onChange={(e) => setSimulateWarning(e.target.checked)} />
                  Simulate gas warning (dev preview — shows how the status hero reacts live)
                </label>
              </div>
            </>
          )}
          {page === "sensors" && <ComingSoon title="Sensors" />}
          {page === "analytics" && <ComingSoon title="Analytics" />}
          {page === "alerts" && <ComingSoon title="Alerts" />}
          {page === "devices" && <ComingSoon title="Devices" />}
          {page === "settings" && <ComingSoon title="Settings" />}
        </main>
      </div>
    </div>
  );
}
