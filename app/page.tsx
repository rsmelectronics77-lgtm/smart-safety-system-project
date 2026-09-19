"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplet, Flame } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SystemStatusHero from "@/components/SystemStatusHero";
import SensorCard from "@/components/SensorCard";
import DeviceInfoCard from "@/components/DeviceInfoCard";

export default function Home() {
  const [page, setPage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    gasValue: 0,
    ipAddress: "192.168.100.143",
    lastCommunication: new Date().toISOString()
  });

  const fetchRealData = async () => {
    try {
      const res = await fetch("/api/sensors", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSensorData({
          temperature: data.temperature ?? 0,
          humidity: data.humidity ?? 0,
          gasValue: data.gasValue ?? 0,
          ipAddress: data.ipAddress || "192.168.100.143",
          lastCommunication: data.lastCommunication || new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchRealData();
    const interval = setInterval(fetchRealData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const gasStatus = sensorData.gasValue > 300 ? "danger" : "safe";
  const nowIso = new Date().toISOString();

  const fullDeviceData = {
    status: "online" as const,
    deviceStatus: "online" as const,
    ipAddress: sensorData.ipAddress,
    lastCommunication: sensorData.lastCommunication,
    lastComm: sensorData.lastCommunication,
    lastSeen: nowIso,
    updatedAt: nowIso,
    wifiSignal: "100%",
    firmware: "v1.0.0",
    uptime: "Aktiv"
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Sol Menü Hizalaması */}
      <div className="shrink-0">
        <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>
      
      {/* Ana İçerik Alanı */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="w-full max-w-[1200px] mx-auto p-4 md:p-6 space-y-6">
          
          <SystemStatusHero 
            overall={gasStatus}
            temp={{ current: sensorData.temperature, status: "safe" }}
            humidity={{ current: sensorData.humidity, status: "safe" }}
            gas={{ current: sensorData.gasValue, status: gasStatus }}
            deviceOnline={true}
            deviceStatus="online"
            lastSeen={nowIso}
          />

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <SensorCard 
              icon={Thermometer}
              label="Temperature"
              unit="°C"
              value={sensorData.temperature}
              status="safe"
              color="#22D3EE"
            />
            <SensorCard 
              icon={Droplet}
              label="Humidity"
              unit="%"
              value={sensorData.humidity}
              status="safe"
              color="#3B82F6"
            />
            <SensorCard 
              icon={Flame}
              label="Gas Level"
              unit="PPM"
              value={sensorData.gasValue}
              status={gasStatus}
              color="#F59E0B"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <DeviceInfoCard 
              device={fullDeviceData}
              deviceStatus="online" 
              ipAddress={sensorData.ipAddress} 
              lastComm={sensorData.lastCommunication} 
            />
          </div>

        </main>
      </div>
    </div>
  );
}
