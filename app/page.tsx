"use client";

import { useState, useEffect } from "react";
import { Thermometer, Droplet, Flame } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SystemStatusHero from "@/components/SystemStatusHero";
import SensorCard from "@/components/SensorCard";
import RealTimeMonitoring from "@/components/RealTimeMonitoring";
import AlertsPanel from "@/components/AlertsPanel";
import DeviceInfoCard from "@/components/DeviceInfoCard";
import SensorHealthPanel from "@/components/SensorHealthPanel";
import { StatusLevel } from "@/types/sensor";

export default function Home() {
  const [page, setPage] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Real ESP8266 datalarını saxlayan steyt
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    gasValue: 0,
    ipAddress: "Yüklənir...",
    lastCommunication: "Yüklənir..."
  });

  // Vercel API-dən real məlumatları çəkən funksiya
  const fetchSensorData = async () => {
    try {
      const res = await fetch("/api/sensors", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSensorData(data);
      }
    } catch (err) {
      console.error("API məlumatı oxunarkən xəta baş verdi:", err);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 3000); // Hər 3 saniyədən bir canlı yenilə
    return () => clearInterval(interval);
  }, []);

  // Statusların təyini (PPM 300-dən çoxdursa Xəbərdarlıq rejiminə keçir)
  const gStatus: StatusLevel = sensorData.gasValue > 300 ? "danger" : "safe";
  const overallStatus: StatusLevel = sensorData.gasValue > 300 ? "danger" : "safe";

  // Tarixçə və Alert panelləri üçün obyekt quruluşu
  const history = {
    temperature: Array(10).fill(sensorData.temperature),
    humidity: Array(10).fill(sensorData.humidity),
    gas: Array(10).fill(sensorData.gasValue)
  };

  const alerts = sensorData.gasValue > 300 ? [
    {
      id: "1",
      type: "danger" as const,
      title: "YÜKSƏK QAZ TƏHLÜKƏSİ",
      message: `Qaz səviyyəsi kritik həddi keçdi: ${sensorData.gasValue} PPM`,
      timestamp: new Date().toLocaleTimeString('az-AZ')
    }
  ] : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 min-w-0 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="mx-auto w-full max-w-[1180px] p-4 md:p-6 space-y-6">
          
          {/* ÜMUMİ STATUS HERO BANNERİ */}
          <SystemStatusHero
            overall={overallStatus}
            temp={{ current: sensorData.temperature }}
            humidity={{ current: sensorData.humidity }}
            gas={{ current: sensorData.gasValue }}
            deviceOnline={true}
            deviceStatus="online"
          />

          {/* SENSOR KARTLARI (CANLI DƏYƏRLƏR) */}
          <div className="grid gap-4 style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}">
            <SensorCard
              icon={Thermometer}
              label="Temperature"
              unit="°C"
              value={sensorData.temperature}
              history={history.temperature}
              prevValue={sensorData.temperature}
              color="#22D3EE"
            />
            <SensorCard
              icon={Droplet}
              label="Humidity"
              unit="%"
              value={sensorData.humidity}
              history={history.humidity}
              prevValue={sensorData.humidity}
              color="#3B82F6"
            />
            <SensorCard
              icon={Flame}
              label="Gas Level"
              unit="PPM"
              value={sensorData.gasValue}
              status={gStatus}
              history={history.gas}
              prevValue={sensorData.gasValue}
              color="#F59E0B"
            />
          </div>

          {/* QRAFİK VƏ BİLDİRİŞ PANELDƏRİ */}
          <div className="grid gap-4 style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}">
            <RealTimeMonitoring history={history} />
            <AlertsPanel alerts={alerts} />
          </div>

          {/* CİHAZ VƏ İP MƏLUMAT KARTLARI */}
          <div className="grid gap-4 style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}">
            <DeviceInfoCard deviceStatus="online" ipAddress={sensorData.ipAddress} lastComm={sensorData.lastCommunication} />
            <SensorHealthPanel sensors={[]} />
          </div>

        </main>
      </div>
    </div>
  );
}
