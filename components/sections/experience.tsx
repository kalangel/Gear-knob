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
import { EASE } from "@/lib/motion";

/* ---------- dash indicators: flicker on like a real dash check ---------- */

const LIGHTS = [Zap, BatteryCharging, Flame, Cpu];

function DashLights() {
  return (
    <div className="flex gap-2" aria-hidden>
      {LIGHTS.map((Icon, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.15 }}
          whileInView={{ opacity: [0.15, 1, 0.25, 1, 0.5, 1] }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.1, delay: 0.3 + i * 0.22, ease: "easeOut" }}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-accent/25 text-accent"
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
        </motion.span>
      ))}
    </div>
  );
}

/* ---------- the star: a tachometer driven by live scroll velocity ---------- */

const T_START = -120;
const T_SWEEP = 240;
const MAX_V = 5000; // px/s of scroll = redline
const IDLE_RPM = 800;
const RPM_PER_V = 2.6; // чувствительность к скроллу ×2
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

function VelocityTach({ label, hint, unit }: { label: string; hint: string; unit: string }) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const magnitude = useTransform(velocity, (v) => Math.min(Math.abs(v), MAX_V));
  const smooth = useSpring(magnitude, { stiffness: 90, damping: 22, mass: 0.5 });
  const rpmValue = useTransform(smooth, (v) => IDLE_RPM + v * RPM_PER_V);
  const rpm = useTransform(rpmValue, (r) => String(Math.round(r)).padStart(4, "0"));
  const redGlow = useTransform(smooth, [MAX_V * 0.6, MAX_V], [0, 0.6]);

  // Needle rotates via the SVG transform attribute: framer's CSS rotate resolves
  // originX/originY against the group's own bbox, not the viewBox, so the pivot drifts.
  const needleRef = useRef<SVGGElement>(null);
  useMotionValueEvent(rpmValue, "change", (r) => {
    if (reduced) return;
    needleRef.current?.setAttribute("transform", `rotate(${dialDeg(r)} 120 112)`);
  });

  const ticks = Array.from({ length: 9 }, (_, i) => T_START + (T_SWEEP * i) / 8);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[340px]">
        <svg viewBox="0 0 240 210" className="w-full" aria-hidden>
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
                  fill={i >= 7 ? "rgba(255,52,65,0.85)" : "#5d626c"}
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
          <g ref={needleRef} transform={`rotate(${dialDeg(reduced ? 2400 : IDLE_RPM)} 120 112)`}>
            <line x1="120" y1="112" x2="120" y2="42" stroke="#e8eaee" strokeWidth="3" strokeLinecap="round" />
            <line x1="120" y1="112" x2="120" y2="42" stroke="var(--accent)" strokeWidth="1.2" opacity="0.8" />
            <line x1="120" y1="112" x2="120" y2="128" stroke="#e8eaee" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </g>
          <circle cx="120" cy="112" r="9" fill="#1a1d22" stroke="rgba(255,255,255,0.3)" />
          <circle cx="120" cy="112" r="3" fill="var(--accent)" />

          {/* ×1000 */}
          <text x="120" y="150" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="#5d626c" letterSpacing="2">
            ×1000
          </text>
        </svg>

        {/* live RPM readout */}
        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center">
          <motion.span className="font-mono text-3xl font-bold tabular-nums text-metal md:text-4xl">
            {reduced ? "2400" : rpm}
          </motion.span>
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

/* ---------- project process, styled like trip stages on a car display ---------- */

function ProcessList({ title, steps }: { title: string; steps: { step: string; title: string; text: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-muted">{title}</div>
      {steps.map((s, i) => (
        <motion.div
          key={s.step}
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.25 + i * 0.14 }}
          className="group relative flex gap-4 rounded-xl border border-white/8 bg-black/30 p-4 transition-colors duration-300 hover:border-accent/40"
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
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- hard facts, styled like vehicle specs ---------- */

function Specs({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-muted">{title}</div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.4 + i * 0.14 }}
            className="rounded-xl border border-white/8 bg-black/30 p-4"
          >
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest2 text-muted">
              <span className="h-1 w-1 rounded-full bg-accent animate-pulse-led" />
              {r.label}
            </div>
            <div className="mt-1.5 font-display text-base font-bold tracking-wide text-metal md:text-lg">
              {r.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- chassis screw: tiny machined bolt for the display corners ---------- */

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

/* ---------- section ---------- */

export function Experience() {
  const { t } = useLang();
  const reduced = useReducedMotion();
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
              />

              <Specs title={t.experience.specsTitle} items={t.experience.specs} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* finish line — inView on the wrapper, the line starts translated outside the overflow clip */}
      <motion.div
        className="relative mt-14 md:mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
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
          <motion.p
            key={t.experience.punchline}
            variants={{ hidden: { y: "110%" }, visible: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-center font-display text-3xl font-bold uppercase tracking-tight text-metal md:text-5xl"
          >
            {punchLead}
            {punchTail && (
              <>
                {" — "}
                <span className="text-accent-glow">{punchTail}</span>
              </>
            )}
          </motion.p>
        </div>

        {/* speed streak */}
        <motion.div
          aria-hidden
          variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1 } }}
          transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          className="mx-auto mt-6 h-[3px] w-44 origin-left rounded-full bg-gradient-to-r from-accent via-accent to-transparent shadow-[0_0_18px_var(--glow)] md:w-60"
        />

        {/* checkered finish strip */}
        <motion.div
          aria-hidden
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.35 } }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-3 h-2 w-28 [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] md:w-36"
          style={{
            backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.9) 0% 25%, transparent 0% 50%)",
            backgroundSize: "8px 8px",
          }}
        />
      </motion.div>
    </section>
  );
}
