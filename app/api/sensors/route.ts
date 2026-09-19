import { NextRequest, NextResponse } from "next/server";
import { SensorSnapshot } from "@/types/sensor";

/**
 * app/api/sensors/route.ts
 * ----------------------------------------------------------------
 * This IS the real API now — hosted in the same Next.js app that
 * serves the dashboard, so no separate backend is needed.
 *
 *   GET  /api/sensors   -> dashboard polls this for the latest reading
 *   POST /api/sensors   -> ESP8266 pushes a new reading here
 *
 * NOTE: this uses a simple in-memory variable. That's fine for a
 * hobby project, but on serverless hosts (Vercel) each request can
 * hit a different, "cold" instance, so the value can occasionally
 * reset or look stale. If that becomes a problem, swap `latest`
 * for a tiny persistent store (Vercel KV / Upstash Redis) — the
 * GET/POST logic below stays exactly the same.
 * ----------------------------------------------------------------
 */

let latest: SensorSnapshot = {
  temperature: 27.4,
  humidity: 56,
  gas: 238,
  deviceStatus: "online",
  timestamp: new Date().toISOString(),
};

// Optional shared-secret check so random people on the internet can't
// spam your endpoint. Set SENSOR_API_KEY in Vercel's project settings,
// and send the same value from the ESP8266 as the "x-api-key" header.
function isAuthorized(req: NextRequest): boolean {
  const required = process.env.SENSOR_API_KEY;
  if (!required) return true; // no key configured yet -> allow (dev mode)
  return req.headers.get("x-api-key") === required;
}

export async function GET() {
  return NextResponse.json(latest);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Partial<SensorSnapshot>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (typeof body.temperature !== "number" || typeof body.humidity !== "number" || typeof body.gas !== "number") {
    return NextResponse.json({ error: "temperature, humidity and gas must be numbers" }, { status: 400 });
  }

  latest = {
    temperature: body.temperature,
    humidity: body.humidity,
    gas: body.gas,
    deviceStatus: "online",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, saved: latest });
}
