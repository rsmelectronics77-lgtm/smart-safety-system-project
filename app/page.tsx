"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplet, Flame } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SystemStatusHero from "@/components/SystemStatusHero";
import SensorCard from "@/components/SensorCard";
import DeviceInfoCard from "@/components/DeviceInfoCard";
import { StatusLevel } from "@/types/sensor";

export default function Home() {
  const [page, setPage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ESP8266-dan gələn real verilənlər
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    gasValue: 0,
    ipAddress: "Yüklənir...",
    lastCommunication: "Yüklənir..."
  });

  const fetchRealData = async () => {
    try {
      const res = await fetch("/api/sensors", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSensorData(data);
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

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center text-white">
        <p className="text-lg">Yüklənir...</p>
      </div>
    );
  }

  // Status təyinləri
  const safeStatus: StatusLevel = "safe";
  const gasStatus: StatusLevel = sensorData.gasValue > 300 ? "danger" : "safe";

  // Obyekt strukturları
  const deviceObj = {
    status: "online" as const,
    deviceStatus: "online" as const,
    ipAddress: sensorData.ipAddress,
    lastCommunication: sensorData.lastCommunication,
    lastComm: sensorData.lastCommunication,
    firmware: "v1.0.0",
    uptime: "Aktiv"
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 min-w-0 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="mx-auto w-full max-w-[1180px] p-4 md:p-6 space-y-6">
          
          {/* ÜMUMİ STATUS HERO */}
          <SystemStatusHero 
            overall={gasStatus}
            temp={{ current: sensorData.temperature, status: safeStatus }}
            humidity={{ current: sensorData.humidity, status: safeStatus }}
            gas={{ current: sensorData.gasValue, status: gasStatus }}
            deviceOnline={true}
            deviceStatus="online"
          />

          {/* SENSOR KARTLARI */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <SensorCard 
              icon={Thermometer}
              label="Temperature"
              unit="°C"
              value={sensorData.temperature}
              status={safeStatus}
              history={[sensorData.temperature]}
              prevValue={sensorData.temperature}
              color="#22D3EE"
            />
            <SensorCard 
              icon={Droplet}
              label="Humidity"
              unit="%"
              value={sensorData.humidity}
              status={safeStatus}
              history={[sensorData.humidity]}
              prevValue={sensorData.humidity}
              color="#3B82F6"
            />
            <SensorCard 
              icon={Flame}
              label="Gas Level"
              unit="PPM"
              value={sensorData.gasValue}
              status={gasStatus}
              history={[sensorData.gasValue]}
              prevValue={sensorData.gasValue}
              color="#F59E0B"
            />
          </div>

          {/* CİHAZ MƏLUMAT KARTI */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <DeviceInfoCard 
              device={deviceObj}
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
