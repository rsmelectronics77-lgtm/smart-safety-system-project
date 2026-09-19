import { StatusLevel } from "@/types/sensor";
import { STATUS_COLOR } from "@/lib/statusColors";

export default function StatusDot({
  status,
  size = 8,
  pulse = false,
}: {
  status: StatusLevel;
  size?: number;
  pulse?: boolean;
}) {
  return (
    <span
      className={pulse ? "animate-pulseDot" : ""}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: STATUS_COLOR[status],
        flexShrink: 0,
      }}
    />
  );
}
