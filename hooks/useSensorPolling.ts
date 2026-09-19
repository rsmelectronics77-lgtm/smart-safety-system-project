"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAlerts, fetchDeviceInfo, fetchSensorHealth, fetchSensorSnapshot } from "@/services/api";
import { AlertItem, DeviceInfo, HistorySeries, SensorHealth, SensorSnapshot } from "@/types/sensor";
import { buildHistory, makeRng } from "@/lib/format";
import { clamp } from "@/lib/thresholds";

const HISTORY_LENGTH = 60;
const POLL_INTERVAL_MS = 4000;

function initialHistory(): HistorySeries {
  return {
    temperature: buildHistory(HISTORY_LENGTH, 27, 0.6, makeRng(11)),
    humidity: buildHistory(HISTORY_LENGTH, 55, 1.4, makeRng(22)),
    gas: buildHistory(HISTORY_LENGTH, 230, 8, makeRng(33)),
  };
}

/**
 * Polls the mock/real sensor API on an interval and keeps a rolling
 * history buffer for the charts. This is the single place that owns
 * "live" state — swap services/api.ts for real endpoints and nothing
 * here needs to change.
 */
export function useSensorPolling(simulateWarning: boolean) {
  const [snapshot, setSnapshot] = useState<SensorSnapshot>({
    temperature: 27.4,
    humidity: 56,
    gas: 238,
    deviceStatus: "online",
    timestamp: new Date().toISOString(),
  });
  const [prev, setPrev] = useState<SensorSnapshot | null>(null);
  const [history, setHistory] = useState<HistorySeries>(initialHistory());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [sensors, setSensors] = useState<SensorHealth[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const gasRef = useRef(238);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    fetchDeviceInfo().then(setDevice);
    fetchSensorHealth().then(setSensors);
    fetchAlerts().then(setAlerts);
  }, []);

  const poll = useCallback(async () => {
    const next = await fetchSensorSnapshot(gasRef.current);
    let gas = next.gas;
    if (simulateWarning) gas = clamp(gas + 260, 0, 999);
    gasRef.current = gas;

    setPrev(snapshotRef.current);
    setSnapshot({ ...next, gas });
    setSecondsAgo(0);
    setHistory((h) => ({
      temperature: [...h.temperature.slice(1), next.temperature],
      humidity: [...h.humidity.slice(1), next.humidity],
      gas: [...h.gas.slice(1), gas],
    }));
  }, [simulateWarning]);

  useEffect(() => {
    const iv = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [poll]);

  useEffect(() => {
    const iv = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  return { snapshot, prev, history, secondsAgo, device, sensors, alerts };
}
