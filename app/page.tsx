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
      console.error("Xəta:", err);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Status tiplərini xətasız müəyyən edirik
  const safeStatus: StatusLevel = "safe";
  const gasStatus: StatusLevel = sensorData.gasValue > 300 ? "danger" : "safe";

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 min-w-0 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="mx-auto w-full max-w-[1180px] p-4 md:p-6 space-y-6">
          
          <SystemStatusHero 
            overall={gasStatus}
            temp={{ current: sensorData.temperature, status: safeStatus }}
            humidity={{ current: sensorData.humidity, status: safeStatus }}
            gas={{ current: sensorData.gasValue, status: gasStatus }}
            deviceOnline={true}
            deviceStatus="online"
          />

          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <SensorCard 
              icon={Thermometer}
              label="Temperature"
              unit="°C"
              value={sensorData.temperature}
              status={safeStatus}
              color="#22D3EE"
            />
            <SensorCard 
              icon={Droplet}
              label="Humidity"
              unit="%"
              value={sensorData.humidity}
              status={safeStatus}
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
