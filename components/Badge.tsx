import { ReactNode } from "react";
import { StatusLevel } from "@/types/sensor";
import { STATUS_COLOR, STATUS_DIM } from "@/lib/statusColors";
import StatusDot from "./StatusDot";

export default function Badge({ status, children }: { status: StatusLevel; children: ReactNode }) {
  return (
    <span
      className="font-mono inline-flex items-center gap-1.5 text-[11.5px] font-semibold rounded-md px-2 py-1"
      style={{
        color: STATUS_COLOR[status],
        background: STATUS_DIM[status],
        border: `1px solid ${STATUS_COLOR[status]}33`,
      }}
    >
      <StatusDot status={status} size={6} /> {children}
    </span>
  );
}
