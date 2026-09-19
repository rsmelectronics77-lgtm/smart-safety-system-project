"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

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

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 min-w-0 flex flex-col">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="mx-auto w-full max-w-[1180px] p-6 space-y-6">
          <h1 className="text-2xl font-bold text-cyan-400">ESP8266 Canlı Panel</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-sm">Temperatur</p>
              <h2 className="text-3xl font-bold text-cyan-400">{sensorData.temperature} °C</h2>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-sm">Rütubət</p>
              <h2 className="text-3xl font-bold text-blue-500">{sensorData.humidity} %</h2>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <p className="text-slate-400 text-sm">Qaz Səviyyəsi</p>
              <h2 className="text-3xl font-bold text-amber-500">{sensorData.gasValue} PPM</h2>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
            <p className="text-slate-400 text-sm">Cihaz Statusu: <span className="text-green-400 font-bold">Online</span></p>
            <p className="text-slate-400 text-sm">ESP8266 IP Ünvanı: <span className="text-white font-mono">{sensorData.ipAddress}</span></p>
            <p className="text-slate-400 text-sm">Son Əlaqə: <span className="text-white">{sensorData.lastCommunication}</span></p>
          </div>
        </main>
      </div>
    </div>
  );
}
