"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { BatteryCharging, Cpu, Flame, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useLang } from "@/components/language-context";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

const LIGHTS = [Zap, BatteryCharging, Flame, Cpu];

function DashLights() {
  const [ref, seen] = useInViewOnce<HTMLDivElement>("-20% 0px");
  return (
    <div ref={ref} className="flex gap-2" aria-hidden>
      {LIGHTS.map((Icon, i) => (
        <span
          key={i}
          className={cn(
            "reveal flex h-7 w-7 items-center justify-center rounded-md border border-accent/25 text-accent",
            seen && "reveal-in"
          )}
          style={{ "--ry": "0px", "--rs": "0.85", "--rd": `${0.3 + i * 0.22}s` } as React.CSSProperties}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}

const T_START = -120;
const T_SWEEP = 240;
const MAX_V = 5000; // px/s of scroll = redline
const IDLE_RPM = 800;
const RPM_PER_V = 2.6; // scroll sensitivity ×2
const DIAL_MAX_RPM = 8000; // the "8" digit on the dial × 1000

const dialDeg = (rpm: number) => Math.round((T_START + (T_SWEEP * rpm) / DIAL_MAX_RPM) * 10) / 10;

function tpolar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: Math.round((120 + r * Math.cos(rad)) * 100) / 100, y: Math.round((112 + r * Math.sin(rad)) * 100) / 100 };
}

function tarc(r: number, from: number, to: number) {
  const s = tpolar(r, from);
  const e = tpolar(r, to);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

function VelocityTach({
  label,
  hint,
  unit,
  ariaLabel,
}: {
  label: string;
  hint: string;
  unit: string;
  ariaLabel: string;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const magnitude = useTransform(velocity, (v) => Math.min(Math.abs(v), MAX_V));
  const smooth = useSpring(magnitude, { stiffness: 90, damping: 22, mass: 0.5 });
  const rpmValue = useTransform(smooth, (v) => IDLE_RPM + v * RPM_PER_V);
  const rpm = useTransform(rpmValue, (r) => String(Math.round(r)).padStart(4, "0"));
  const redGlow = useTransform(smooth, [MAX_V * 0.6, MAX_V], [0, 0.6]);

  // The needle turns with a CSS transform on a stable origin (transform-box:
  // view-box pins it to the viewBox, so the pivot cannot drift). One style
  // write per frame, no SVG geometry is recomputed and nothing re-renders.
  const needleRef = useRef<SVGGElement>(null);
  useMotionValueEvent(rpmValue, "change", (r) => {
    if (reduced) return;
    const el = needleRef.current;
    if (el) el.style.transform = `rotate(${dialDeg(r)}deg)`;
  });

  const ticks = Array.from({ length: 9 }, (_, i) => T_START + (T_SWEEP * i) / 8);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[340px]" role="img" aria-label={ariaLabel}>
        <svg viewBox="0 0 240 210" className="w-full" aria-hidden="true">
          <defs>
            <linearGradient id="vt-arc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#2f333b" />
              <stop offset="0.7" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--accent-red)" />
            </linearGradient>
          </defs>

          {/* dial face */}
          <circle cx="120" cy="112" r="97" fill="#0a0b0e" stroke="rgba(255,255,255,0.08)" />
          <circle cx="120" cy="112" r="90" fill="none" stroke="rgba(255,255,255,0.04)" />

          {/* track + redline */}
          <path d={tarc(80, T_START, T_START + T_SWEEP)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" strokeLinecap="round" />
          <path
            d={tarc(80, T_START + T_SWEEP * 0.82, T_START + T_SWEEP)}
            fill="none"
            stroke="rgba(255,52,65,0.45)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* ticks + digits 0..8 */}
          {ticks.map((deg, i) => {
            const o = tpolar(66, deg);
            const n = tpolar(52, deg);
            const inn = tpolar(58, deg);
            return (
              <g key={deg}>
                <line
                  x1={o.x}
                  y1={o.y}
                  x2={inn.x}
                  y2={inn.y}
                  stroke={i >= 7 ? "rgba(255,52,65,0.8)" : "rgba(255,255,255,0.35)"}
                  strokeWidth="2"
                />
                <text
                  x={n.x}
                  y={n.y + 3.5}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fill={i >= 7 ? "rgba(255,52,65,0.9)" : "var(--dial-mark)"}
                >
                  {i}
                </text>
              </g>
            );
          })}

          {/* redline bloom when pushed */}
          <motion.circle
            cx="120"
            cy="112"
            r="86"
            fill="none"
            stroke="var(--accent-red)"
            strokeWidth="2"
            style={{ opacity: reduced ? 0 : redGlow, filter: "blur(6px)" }}
          />

          {/* needle */}
          <g
            ref={needleRef}
            className="tach-needle"
            style={{
              transformBox: "view-box",
              transformOrigin: "120px 112px",
              transform: `rotate(${dialDeg(IDLE_RPM)}deg)`,
              willChange: "transform",
            }}
          >
            <line x1="120" y1="112" x2="120" y2="42" stroke="#e8eaee" strokeWidth="3" strokeLinecap="round" />
            <line x1="120" y1="112" x2="120" y2="42" stroke="var(--accent)" strokeWidth="1.2" opacity="0.8" />
            <line x1="120" y1="112" x2="120" y2="128" stroke="#e8eaee" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </g>
          <circle cx="120" cy="112" r="9" fill="#1a1d22" stroke="rgba(255,255,255,0.3)" />
          <circle cx="120" cy="112" r="3" fill="var(--accent)" />

          {/* ×1000 */}
          <text x="120" y="150" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="var(--etch)" letterSpacing="2">
            ×1000
          </text>
        </svg>

        {/* live RPM readout — the parked twin is swapped in by CSS, so a
            reduced-motion visitor never sees the digits move, not even once */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center"
        >
          <span className="font-mono text-3xl font-bold tabular-nums text-metal md:text-4xl">
            <motion.span className="rm-swap">{rpm}</motion.span>
            <span className="rm-only">0000</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-muted">{unit}</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="font-mono text-[11px] uppercase tracking-widest2 text-chrome">{label}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{hint}</div>
      </div>
    </div>
  );
}

function ProcessList({ title, steps }: { title: string; steps: { step: string; title: string; text: string }[] }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>("-15% 0px");
  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-muted">{title}</div>
      {steps.map((s, i) => (
        <div
          key={s.step}
          className={cn(
            "reveal group relative flex gap-4 rounded-xl border border-white/8 bg-black/30 p-4 hover:border-accent/40",
            seen && "reveal-in"
          )}
          style={{ "--rx": "-18px", "--ry": "0px", "--rd": `${0.25 + i * 0.14}s` } as React.CSSProperties}
        >
          <span className="font-mono text-[11px] font-bold leading-6 text-accent">{s.step}</span>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold tracking-wide text-metal md:text-base">
              {s.title}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-silver">{s.text}</p>
          </div>
          {/* progress tick on the left edge */}
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-accent/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
}

function Specs({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>("-15% 0px");
  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-muted">{title}</div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((r, i) => (
          <div
            key={r.label}
            className={cn("reveal rounded-xl border border-white/8 bg-black/30 p-4", seen && "reveal-in")}
            style={{ "--ry": "18px", "--rd": `${0.4 + i * 0.14}s` } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest2 text-muted">
              <span className="h-1 w-1 rounded-full bg-accent animate-pulse-led" />
              {r.label}
            </div>
            {/* words, not just numbers, since the price line became a sentence */}
            <div className="mt-1.5 text-balance font-display text-base font-bold leading-snug tracking-wide text-metal">
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Screw({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-20 h-2.5 w-2.5 rounded-full border border-white/15 bg-[#16181c] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] ${className}`}
    >
      <span className="absolute left-1/2 top-1/2 h-px w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white/25" />
    </span>
  );
}

export function Experience() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [finishRef, finishSeen] = useInViewOnce<HTMLDivElement>("-10% 0px");
  const [punchLead, punchTail] = t.experience.punchline.split(" — ");

  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pt-20 pb-12 md:pt-28 md:pb-16">
      <SectionHeading gear="4" eyebrow={t.experience.eyebrow} title={t.experience.title} />

      <Reveal>
        <div className="chrome-ring relative rounded-[28px] p-1">
          {/* underglow — neon beneath the chassis */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-12 -bottom-7 h-14 rounded-[50%] bg-[var(--glow)] opacity-30 blur-2xl"
          />
          {/* the in-car display */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#07080b]">
            {/* screen glass: subtle scanlines + top sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 opacity-[0.05]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 3px)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white/[0.04] to-transparent"
            />

            {/* machined corner bolts */}
            <Screw className="left-3 top-3" />
            <Screw className="right-3 top-3" />
            <Screw className="bottom-3 left-3" />
            <Screw className="bottom-3 right-3" />

            {/* status bar */}
            <div className="relative flex items-center justify-between border-b border-white/8 px-6 py-4 md:px-10">
              {/* redline sweep running along the bottom edge */}
              <div aria-hidden className="absolute inset-x-0 -bottom-px h-px overflow-hidden">
                {!reduced && (
                  <motion.div
                    className="h-full w-1/4 bg-gradient-to-r from-transparent via-accent/80 to-transparent"
                    animate={{ x: ["-120%", "520%"] }}
                    transition={{ duration: 3.4, repeat: Infinity, repeatDelay: 1.8, ease: "linear" }}
                  />
                )}
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-led" />
                {t.experience.board}
              </div>
              <div className="hidden font-mono text-[10px] uppercase tracking-widest2 text-silver sm:block">
                {t.experience.ready}
              </div>
              <DashLights />
            </div>

            {/* main display */}
            <div className="carbon relative grid gap-10 p-7 md:p-12 lg:grid-cols-[1fr_1.15fr_1fr] lg:items-center">
              <ProcessList title={t.experience.processTitle} steps={t.experience.process} />

              <VelocityTach
                label={t.experience.tach.label}
                hint={t.experience.tach.hint}
                unit={t.experience.tach.unit}
                ariaLabel={t.a11y.tach}
              />

              <Specs title={t.experience.specsTitle} items={t.experience.specs} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* finish line — inView on the wrapper, the line starts translated outside the overflow clip */}
      <div ref={finishRef} className="relative mt-14 md:mt-20">
        {/* speed hairlines flanking the statement */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 hidden h-px w-[16%] -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-accent/60 md:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-[16%] -translate-y-1/2 bg-gradient-to-l from-transparent via-white/15 to-accent/60 md:block"
        />

        <div className="overflow-hidden">
          <p
            className={cn(
              "rise text-center font-display text-3xl font-bold uppercase tracking-tight text-metal md:text-5xl",
              finishSeen && "rise-in"
            )}
          >
            {punchLead}
            {punchTail && (
              <>
                {" — "}
                <span className="text-accent-glow">{punchTail}</span>
              </>
            )}
          </p>
        </div>

        {/* speed streak */}
        <div
          aria-hidden
          className={cn(
            "reveal mx-auto mt-6 h-[3px] w-44 origin-left rounded-full bg-gradient-to-r from-accent via-accent to-transparent shadow-[0_0_18px_var(--glow)] md:w-60",
            finishSeen && "reveal-in"
          )}
          style={{ "--ry": "0px", "--rs": "0.001", "--rd": "0.35s" } as React.CSSProperties}
        />

        {/* checkered finish strip */}
        <div
          aria-hidden
          className={cn(
            "mx-auto mt-3 h-2 w-28 opacity-0 transition-opacity duration-700 [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] md:w-36",
            finishSeen && "!opacity-35"
          )}
          style={{
            backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.9) 0% 25%, transparent 0% 50%)",
            backgroundSize: "8px 8px",
            transitionDelay: "0.6s",
          }}
        />
      </div>
    </section>
  );
}
