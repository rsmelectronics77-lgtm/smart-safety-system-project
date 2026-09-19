import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0E14",
        surface: "#10151C",
        "surface-2": "#141A22",
        border: "#1C2530",
        "border-soft": "#161D26",
        text: "#E7EDF3",
        "text-muted": "#7C8B9C",
        "text-faint": "#4B5A6A",
        safe: "#34D399",
        "safe-dim": "#0F2A21",
        warn: "#FBBF24",
        "warn-dim": "#2E250C",
        danger: "#F87171",
        "danger-dim": "#351515",
        info: "#22D3EE",
        "info-dim": "#0B2730",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        fadeSlideIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
        fadeSlideIn: "fadeSlideIn 0.4s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
