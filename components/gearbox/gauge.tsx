"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useLang } from "@/components/language-context";
import { useInViewOnce } from "@/hooks/use-in-view-once";

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

const deg = (p: number) => Math.round((START + (SWEEP * p) / 100) * 10) / 10;

interface GaugeProps {
  label: string;
  value: number; // 0..100
  unit?: string;
}

/** Tachometer-style skill gauge. Needle sweeps to value when scrolled into view. */
export function Gauge({ label, value, unit = "RPM ×100" }: GaugeProps) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>("-15% 0px");
  const needle = useRef<SVGGElement>(null);
  const readout = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { t } = useLang();

  useEffect(() => {
    // The sweep writes straight to the DOM: six gauges re-rendering React on
    // every frame is exactly the kind of thing a mid-range Android feels.
    const paint = (p: number) => {
      if (needle.current) needle.current.style.transform = `rotate(${deg(p)}deg)`;
      if (readout.current) readout.current.textContent = String(Math.round(p));
    };

    // Reduced motion: the gauge is simply already at its value — no sweep,
    // and no snap when it scrolls into view either.
    if (reduced) {
      paint(value);
      return;
    }
    if (!inView) return;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / 1600);
      paint(ease(t) * value);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center rounded-2xl p-6 glass transition-colors duration-500 hover:border-white/20"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t.a11y.gauge.replace("{label}", label).replace("{value}", String(value))}
    >
      <svg viewBox="0 0 160 130" className="w-full max-w-[190px]" aria-hidden="true">
        <defs>
          <linearGradient id="gauge-arc" x1="0" y1="1" x2="1" y2="0">
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
        {/* value arc — pathLength="1" normalises the dash maths, so the fill is
            a plain CSS transition on stroke-dashoffset */}
        <path
          d={arcPath(80, 78, 58, START, START + SWEEP)}
          fill="none"
          stroke="url(#gauge-arc)"
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{
            filter: "drop-shadow(0 0 6px var(--glow))",
            strokeDashoffset: inView || reduced ? 1 - value / 100 : 1,
            transition: reduced ? "none" : "stroke-dashoffset 1.6s var(--ease)",
          }}
        />
        {/* ticks */}
        {Array.from({ length: 11 }, (_, i) => START + (SWEEP * i) / 10).map((d, i) => {
          const o = polar(80, 78, 48, d);
          const inn = polar(80, 78, i % 5 === 0 ? 41 : 44, d);
          return (
            <line
              key={d}
              x1={o.x}
              y1={o.y}
              x2={inn.x}
              y2={inn.y}
              stroke={i >= 9 ? "rgba(255,52,65,0.7)" : "rgba(255,255,255,0.25)"}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}
        {/* needle — CSS rotation on a viewBox-pinned origin, never a re-render */}
        <g
          ref={needle}
          style={{
            transformBox: "view-box",
            transformOrigin: "80px 78px",
            transform: `rotate(${deg(0)}deg)`,
          }}
        >
          <line x1="80" y1="78" x2="80" y2="34" stroke="#e8eaee" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="78" x2="80" y2="34" stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
        </g>
        <circle cx="80" cy="78" r="7" fill="#1a1d22" stroke="rgba(255,255,255,0.25)" />
        <circle cx="80" cy="78" r="2.5" fill="var(--accent)" />
      </svg>

      <div
        ref={readout}
        aria-hidden="true"
        className="mt-1 font-mono text-3xl font-bold tabular-nums text-metal"
      >
        0
      </div>
      <div className="mt-1 text-center text-sm font-semibold tracking-wide text-chrome">{label}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-muted">{unit}</div>
    </div>
  );
}
