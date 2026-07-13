import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#08090a",
        carbon: "#0d0e11",
        graphite: "#15171b",
        steel: "#1d2026",
        gunmetal: "#282c34",
        chrome: "#d3d7de",
        silver: "#a9afba",
        muted: "#7e8592",
        accent: {
          DEFAULT: "#4da2ff",
          dim: "rgba(77,162,255,0.14)",
          red: "#ff3441",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.35em",
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "spin-slow": "spin 24s linear infinite",
        "pulse-led": "pulse-led 2.4s ease-in-out infinite",
        floaty: "floaty 7s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-led": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 12px 2px var(--glow)" },
          "50%": { opacity: "0.45", boxShadow: "0 0 4px 0 var(--glow)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
