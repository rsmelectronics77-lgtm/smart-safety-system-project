import { StatusLevel } from "@/types/sensor";

export const STATUS_COLOR: Record<StatusLevel, string> = {
  safe: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  info: "#22D3EE",
};

export const STATUS_DIM: Record<StatusLevel, string> = {
  safe: "#0F2A21",
  warning: "#2E250C",
  danger: "#351515",
  info: "#0B2730",
};

export const STATUS_LABEL: Record<StatusLevel, string> = {
  safe: "Normal",
  warning: "Warning",
  danger: "Danger",
  info: "Info",
};
