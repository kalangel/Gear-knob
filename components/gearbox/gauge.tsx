"use client";

import { useEffect, useId, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

const START = -120; // degrees
const SWEEP = 240;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  // rounded so SSR and client markup match bit-for-bit
  return {
    x: Math.round((cx + r * Math.cos(rad)) * 100) / 100,
    y: Math.round((cy + r * Math.sin(rad)) * 100) / 100,
  };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const s = polar(cx, cy, r, from);
  const e = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

interface GaugeProps {
  label: string;
  value: number; // 0..100
  unit?: string;
}

/** Tachometer-style skill gauge. Needle sweeps to value when scrolled into view. */
export function Gauge({ label, value, unit = "RPM ×100" }: GaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [progress, setProgress] = useState(0);
  const gradientId = useId();

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setProgress,
    });
    return () => controls.stop();
  }, [inView, value]);

  const display = Math.round(progress);
  // Needle rotates via the SVG transform attribute: framer's CSS rotate resolves
  // originX/originY against the group's own bbox, not the viewBox, so the pivot drifts.
  const needleDeg = Math.round((START + (SWEEP * progress) / 100) * 10) / 10;
  const ticks = Array.from({ length: 11 }, (_, i) => START + (SWEEP * i) / 10);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center rounded-2xl p-6 glass transition-colors duration-500 hover:border-white/20"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${value} of 100`}
    >
      <svg viewBox="0 0 160 130" className="w-full max-w-[190px]">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#2f333b" />
            <stop offset="1" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        {/* track */}
        <path
          d={arcPath(80, 78, 58, START, START + SWEEP)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* redline zone */}
        <path
          d={arcPath(80, 78, 58, START + SWEEP * 0.86, START + SWEEP)}
          fill="none"
          stroke="rgba(255,52,65,0.35)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* value arc */}
        <motion.path
          d={arcPath(80, 78, 58, START, START + SWEEP)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: value / 100 } : {}}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: "drop-shadow(0 0 6px var(--glow))" }}
        />
        {/* ticks */}
        {ticks.map((deg, i) => {
          const o = polar(80, 78, 48, deg);
          const inn = polar(80, 78, i % 5 === 0 ? 41 : 44, deg);
          return (
            <line
              key={deg}
              x1={o.x}
              y1={o.y}
              x2={inn.x}
              y2={inn.y}
              stroke={i >= 9 ? "rgba(255,52,65,0.7)" : "rgba(255,255,255,0.25)"}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}
        {/* needle */}
        <g transform={`rotate(${needleDeg} 80 78)`}>
          <line x1="80" y1="78" x2="80" y2="34" stroke="#e8eaee" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="78" x2="80" y2="34" stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
        </g>
        <circle cx="80" cy="78" r="7" fill="#1a1d22" stroke="rgba(255,255,255,0.25)" />
        <circle cx="80" cy="78" r="2.5" fill="var(--accent)" />
      </svg>

      <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-metal">{display}</div>
      <div className="mt-1 text-center text-sm font-semibold tracking-wide text-chrome">{label}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-muted">{unit}</div>
    </div>
  );
}
