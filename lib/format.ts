export function timeAgo(sec: number): string {
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

export function formatUptime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m}m`;
}

export function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function buildHistory(points: number, base: number, amplitude: number, rng: () => number): number[] {
  const arr: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += (rng() - 0.5) * amplitude;
    arr.push(Math.round(v * 10) / 10);
  }
  return arr;
}
