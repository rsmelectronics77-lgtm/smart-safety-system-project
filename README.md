# Smart Safety — IoT Monitoring Dashboard

A dark, premium monitoring dashboard for a DIY IoT Smart Safety System
(ESP8266 + DHT22 + MQ-4). Built with Next.js 14 (App Router), TypeScript,
Tailwind CSS, Recharts and lucide-react. Currently wired to realistic mock
sensor data — structured so a real API is a one-file swap.

## Quick start

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Project structure

\`\`\`
app/
  layout.tsx          Root layout, fonts, global styles
  page.tsx             Dashboard page — wires state + layout together
  globals.css
components/
  Sidebar.tsx, Header.tsx
  SystemStatusHero.tsx
  SensorCard.tsx
  RealTimeMonitoring.tsx
  AlertsPanel.tsx
  DeviceInfoCard.tsx
  SensorHealthPanel.tsx
  ComingSoon.tsx
  StatusDot.tsx, Badge.tsx
  charts/
    Sparkline.tsx      Small SVG trend line (no chart lib needed)
    GasGauge.tsx        Radial SVG gauge for the gas card
    RealTimeChart.tsx   Recharts line chart for the main monitoring panel
hooks/
  useSensorPolling.ts  Polls the API on an interval, owns "live" state
services/
  api.ts               ★ THE FILE TO EDIT when you connect the real ESP8266 API
lib/
  thresholds.ts         Safety thresholds + status logic (safe/warning/danger)
  statusColors.ts        Shared color tokens per status
  format.ts               timeAgo / uptime formatting + mock history generator
types/
  sensor.ts               Shared TypeScript interfaces
\`\`\`

## Connecting your real ESP8266 API

Everything data-related goes through `services/api.ts`. To switch from mock
data to your real API:

1. Set `USE_MOCK = false` at the top of `services/api.ts`.
2. Set `NEXT_PUBLIC_API_BASE_URL` in a `.env.local` file (or leave empty for
   same-origin requests), e.g.:
   \`\`\`
   NEXT_PUBLIC_API_BASE_URL=http://192.168.1.50
   \`\`\`
3. Make sure your backend/API returns JSON shaped like:
   \`\`\`json
   {
     "temperature": 27.4,
     "humidity": 56,
     "gas": 238,
     "deviceStatus": "online",
     "timestamp": "2026-09-19T20:42:00"
   }
   \`\`\`
   for `GET /api/sensors`, plus matching endpoints for `/api/device`,
   `/api/sensor-health` and `/api/alerts` (see the type definitions in
   `types/sensor.ts` for the exact shapes expected).

No component needs to change — `useSensorPolling` and every UI component only
ever calls the functions exported from `services/api.ts`.

## Notes

- Safety thresholds (gas warning/danger, temp/humidity ranges) live in
  `lib/thresholds.ts` — tune these to match your MQ-4 calibration.
- The "Simulate gas warning" checkbox on the dashboard is a dev-only toggle
  to preview how the System Status hero reacts to a danger state; remove it
  from `app/page.tsx` whenever you like.
- Sensors / Analytics / Alerts / Devices / Settings are stub pages
  (`ComingSoon`) — the Dashboard page is the fully built one.

---

## Qısa qeyd (Azərbaycanca)

1. `npm install`, sonra `npm run dev` — layihə `http://localhost:3000`-da açılır.
2. Real API-a qoşmaq üçün yalnız **`services/api.ts`** faylını dəyişmək
   kifayətdir: `USE_MOCK = false` et və ESP8266-nın backend/API ünvanını
   `.env.local`-da `NEXT_PUBLIC_API_BASE_URL` kimi ver.
3. GitHub-a yükləmək üçün: `git init`, `git add .`, `git commit -m "init"`,
   sonra GitHub-da boş repo yarat və `git remote add origin ...` + `git push`.
