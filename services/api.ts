import { AlertItem, DeviceInfo, SensorHealth, SensorSnapshot } from "@/types/sensor";
import { clamp } from "@/lib/thresholds";

/**
 * services/api.ts
 * ----------------------------------------------------------------
 * This is the ONLY file that should change when you connect the
 * real ESP8266 API. Every component calls the functions below —
 * none of them know or care whether the data is mocked or real.
 *
 * Expected real response shape from GET /api/sensors:
 * {
 *   "temperature": 27.4,
 *   "humidity": 56,
 *   "gas": 238,
 *   "deviceStatus": "online",
 *   "timestamp": "2026-09-19T20:42:00"
 * }
 * ----------------------------------------------------------------
 */

const USE_MOCK = true; // flip to false once your ESP8266 is posting real readings
// app/api/sensors/route.ts lives in THIS same app, so API_BASE can stay
// empty ("" = same origin). Only set NEXT_PUBLIC_API_BASE_URL if you ever
// move the API to a different host.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function fetchSensorSnapshot(prevGas?: number): Promise<SensorSnapshot> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/sensors`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch sensor snapshot: ${res.status}`);
    return res.json();
  }

  // ---- mock implementation below ----
  await new Promise((r) => setTimeout(r, 120));
  const t = 27.4 + (Math.random() - 0.5) * 0.6;
  const h = 56 + (Math.random() - 0.5) * 1.5;
  let g = (prevGas ?? 238) + (Math.random() - 0.5) * 14;
  g = clamp(g, 180, 900);
  return {
    temperature: Math.round(t * 10) / 10,
    humidity: Math.round(h),
    gas: Math.round(g),
    deviceStatus: "online",
    timestamp: new Date().toISOString(),
  };
}

export async function fetchDeviceInfo(): Promise<DeviceInfo> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/device`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch device info: ${res.status}`);
    return res.json();
  }
  return {
    name: "ESP8266",
    location: "Living Room",
    status: "online",
    wifi: "Connected",
    ip: "192.168.1.105",
    firmware: "v1.0.0",
    uptimeSeconds: 9240,
  };
}

export async function fetchSensorHealth(): Promise<SensorHealth[]> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/sensor-health`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch sensor health: ${res.status}`);
    return res.json();
  }
  return [
    { id: "dht22", name: "DHT22", role: "Temp / Humidity", status: "operational" },
    { id: "mq4", name: "MQ-4", role: "Gas", status: "operational" },
    { id: "esp8266", name: "ESP8266", role: "Controller", status: "connected" },
  ];
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE}/api/alerts`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch alerts: ${res.status}`);
    return res.json();
  }
  return [
    { id: 1, level: "warning", message: "Gas level exceeded threshold", time: "Today, 20:42" },
    { id: 2, level: "safe", message: "Temperature returned to normal", time: "Today, 20:35" },
    { id: 3, level: "safe", message: "ESP8266 connected", time: "Today, 20:30" },
    { id: 4, level: "info", message: "Firmware check completed — up to date", time: "Today, 18:02" },
    { id: 5, level: "safe", message: "Humidity returned to normal", time: "Yesterday, 23:11" },
  ];
}
