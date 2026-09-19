export type StatusLevel = "safe" | "warning" | "danger" | "info";

export interface SensorSnapshot {
  temperature: number; // °C
  humidity: number; // %
  gas: number; // ppm (mock unit)
  deviceStatus: "online" | "offline";
  timestamp: string; // ISO 8601
}

export interface DeviceInfo {
  name: string;
  location: string;
  status: "online" | "offline";
  wifi: string;
  ip: string;
  firmware: string;
  uptimeSeconds: number;
}

export type SensorHealthStatus = "operational" | "connected" | "unavailable";

export interface SensorHealth {
  id: string;
  name: string;
  role: string;
  status: SensorHealthStatus;
}

export interface AlertItem {
  id: number;
  level: StatusLevel;
  message: string;
  time: string;
}

export interface HistorySeries {
  temperature: number[];
  humidity: number[];
  gas: number[];
}
