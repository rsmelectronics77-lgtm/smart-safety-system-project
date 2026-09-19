export const THRESHOLDS = {
  gasWarning: 400,
  gasDanger: 650,
  tempWarnLow: 10,
  tempWarnHigh: 35,
  humidityWarnLow: 20,
  humidityWarnHigh: 70,
};

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function gasStatus(g: number) {
  if (g >= THRESHOLDS.gasDanger) return "danger" as const;
  if (g >= THRESHOLDS.gasWarning) return "warning" as const;
  return "safe" as const;
}

export function tempStatus(t: number) {
  if (t < THRESHOLDS.tempWarnLow - 5 || t > THRESHOLDS.tempWarnHigh + 5) return "danger" as const;
  if (t < THRESHOLDS.tempWarnLow || t > THRESHOLDS.tempWarnHigh) return "warning" as const;
  return "safe" as const;
}

export function humidityStatus(h: number) {
  if (h < THRESHOLDS.humidityWarnLow - 10 || h > THRESHOLDS.humidityWarnHigh + 15) return "danger" as const;
  if (h < THRESHOLDS.humidityWarnLow || h > THRESHOLDS.humidityWarnHigh) return "warning" as const;
  return "safe" as const;
}
