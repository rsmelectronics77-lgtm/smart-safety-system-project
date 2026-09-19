import { StatusLevel } from "@/types/sensor";
import { STATUS_COLOR } from "@/lib/statusColors";

export default function GasGauge({
  value,
  max = 900,
  status,
}: {
  value: number;
  max?: number;
  status: StatusLevel;
}) {
  const size = 128;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = c * (1 - pct);
  const color = STATUS_COLOR[status];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#1C2530" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
      />
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="font-mono" fontSize="26" fontWeight="700" fill="#E7EDF3">
        {value}
      </text>
      <text x="50%" y="63%" textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fill="#7C8B9C" letterSpacing="0.5">
        ppm (mock)
      </text>
    </svg>
  );
}
