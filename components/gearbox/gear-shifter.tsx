"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Gear } from "@/lib/data";

/** Top-down H-pattern gate, SVG user units. */
const SLOT: Record<Gear, { x: number; y: number }> = {
  "1": { x: 62, y: 74 },
  "2": { x: 62, y: 266 },
  "3": { x: 150, y: 74 },
  "4": { x: 150, y: 266 },
  "5": { x: 238, y: 74 },
  R: { x: 238, y: 266 },
  N: { x: 150, y: 170 },
};

const NEUTRAL_Y = 170;
const SLOT_W = 30;

interface GearShifterProps {
  active: Gear;
  onShift?: (gear: Gear) => void;
  className?: string;
  labelled?: boolean;
}

export function GearShifter({ active, onShift, className, labelled = true }: GearShifterProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(SLOT[active].x);
  const y = useMotionValue(SLOT[active].y);
  const prev = useRef<Gear>(active);
  const [shifting, setShifting] = useState(false);

  useEffect(() => {
    if (prev.current === active) return;
    prev.current = active;
    const to = SLOT[active];

    if (reduced) {
      x.set(to.x);
      y.set(to.y);
      return;
    }

    // Start from the knob's ACTUAL position (mid-flight interruptions stay smooth,
    // no teleporting back to the previous slot).
    const cx = x.get();
    const cy = y.get();

    // Route through the H-gate: rise to the neutral row, slide across, drop into the slot.
    const pts: { x: number; y: number }[] =
      Math.abs(cx - to.x) < 0.5
        ? [
            { x: cx, y: cy },
            { x: to.x, y: to.y },
          ]
        : [
            { x: cx, y: cy },
            { x: cx, y: NEUTRAL_Y },
            { x: to.x, y: NEUTRAL_Y },
            { x: to.x, y: to.y },
          ];

    // Already (almost) there — just snap the last fraction of a pixel.
    let total = 0;
    const acc: number[] = [0];
    for (let i = 1; i < pts.length; i++) {
      total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      acc.push(total);
    }
    if (total < 1) {
      x.set(to.x);
      y.set(to.y);
      return;
    }

    setShifting(true);
    // Keyframe timing proportional to segment length = constant lever speed.
    const times = acc.map((d) => d / total);
    const duration = Math.min(0.7, Math.max(0.28, total / 520));

    const ax = animate(x, pts.map((p) => p.x), { duration, times, ease: [0.65, 0, 0.35, 1] });
    const ay = animate(y, pts.map((p) => p.y), {
      duration,
      times,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setShifting(false),
    });
    return () => {
      ax.stop();
      ay.stop();
    };
  }, [active, reduced, x, y]);

  return (
    <div className={cn("relative select-none", className)}>
      <svg
        viewBox="0 0 300 340"
        className="h-auto w-full"
        role="group"
        aria-label={`Gear selector, current gear ${active}`}
      >
        <defs>
          <linearGradient id="gs-plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b1e23" />
            <stop offset="1" stopColor="#0c0d10" />
          </linearGradient>
          <linearGradient id="gs-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7d838d" />
            <stop offset="0.25" stopColor="#2a2d34" />
            <stop offset="0.55" stopColor="#b8bdc6" />
            <stop offset="0.8" stopColor="#33363d" />
            <stop offset="1" stopColor="#8a9099" />
          </linearGradient>
          <radialGradient id="gs-knob" cx="0.35" cy="0.3" r="0.9">
            <stop offset="0" stopColor="#f2f4f7" />
            <stop offset="0.35" stopColor="#a7adb7" />
            <stop offset="0.7" stopColor="#4c515a" />
            <stop offset="1" stopColor="#24272d" />
          </radialGradient>
          <radialGradient id="gs-knob-core" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#3a3e46" />
            <stop offset="1" stopColor="#101216" />
          </radialGradient>
          <pattern id="gs-carbon" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#0b0c0f" />
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.05)" />
            <circle cx="6" cy="6" r="1" fill="rgba(255,255,255,0.03)" />
          </pattern>
          <filter id="gs-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bezel + plate */}
        <rect x="6" y="16" width="288" height="308" rx="34" fill="url(#gs-rim)" opacity="0.9" />
        <rect x="9" y="19" width="282" height="302" rx="31" fill="url(#gs-plate)" />
        <rect x="9" y="19" width="282" height="302" rx="31" fill="url(#gs-carbon)" opacity="0.55" />
        <rect
          x="9.5"
          y="19.5"
          width="281"
          height="301"
          rx="31"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
        />

        {/* Bezel screws — machined corner fasteners */}
        {[
          { cx: 34, cy: 44, rot: -24 },
          { cx: 266, cy: 44, rot: 38 },
          { cx: 34, cy: 296, rot: 74 },
          { cx: 266, cy: 296, rot: 12 },
        ].map((s, i) => (
          <g key={`screw-${i}`} transform={`rotate(${s.rot} ${s.cx} ${s.cy})`}>
            <circle cx={s.cx} cy={s.cy} r="7" fill="url(#gs-knob)" stroke="rgba(0,0,0,0.65)" />
            <circle cx={s.cx} cy={s.cy} r="7" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
            <line
              x1={s.cx - 4.2}
              y1={s.cy}
              x2={s.cx + 4.2}
              y2={s.cy}
              stroke="#14161a"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Etched plate marking */}
        <text
          x="150"
          y="317"
          textAnchor="middle"
          fontSize="6.5"
          fontFamily="var(--font-mono)"
          fill="#4a4f58"
          letterSpacing="3"
        >
          PRECISION 6-SPEED
        </text>

        {/* H gate — recessed slots */}
        <g>
          {[62, 150, 238].map((cx) => (
            <rect
              key={cx}
              x={cx - SLOT_W / 2}
              y={74 - SLOT_W / 2}
              width={SLOT_W}
              height={266 - 74 + SLOT_W}
              rx={SLOT_W / 2}
              fill="#050608"
              stroke="rgba(0,0,0,0.9)"
            />
          ))}
          <rect
            x={62 - SLOT_W / 2}
            y={NEUTRAL_Y - SLOT_W / 2}
            width={238 - 62 + SLOT_W}
            height={SLOT_W}
            rx={SLOT_W / 2}
            fill="#050608"
          />
          {/* reverse lockout ring */}
          <circle
            cx={SLOT.R.x}
            cy={SLOT.R.y}
            r="21"
            fill="none"
            stroke="var(--accent-red)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            opacity="0.3"
          />
          {/* inner slot highlight */}
          {[62, 150, 238].map((cx) => (
            <rect
              key={`hl-${cx}`}
              x={cx - SLOT_W / 2 + 1}
              y={74 - SLOT_W / 2 + 1}
              width={SLOT_W - 2}
              height={266 - 74 + SLOT_W - 2}
              rx={(SLOT_W - 2) / 2}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
            />
          ))}
        </g>

        {/* Gear labels */}
        {labelled &&
          (Object.keys(SLOT) as Gear[])
            .filter((g) => g !== "N")
            .map((g) => {
              const s = SLOT[g];
              const isTop = s.y < NEUTRAL_Y;
              const isActive = active === g;
              return (
                <text
                  key={g}
                  x={s.x}
                  y={isTop ? s.y - 28 : s.y + 40}
                  textAnchor="middle"
                  fontSize="19"
                  fontWeight="700"
                  fontFamily="var(--font-mono)"
                  fill={isActive ? (g === "R" ? "var(--accent-red)" : "var(--accent)") : "#5d626c"}
                  filter={isActive ? "url(#gs-glow)" : undefined}
                  style={{ transition: "fill 0.4s" }}
                >
                  {g}
                </text>
              );
            })}

        {/* Click targets */}
        {onShift &&
          (Object.keys(SLOT) as Gear[])
            .filter((g) => g !== "N")
            .map((g) => (
              <circle
                key={`hit-${g}`}
                cx={SLOT[g].x}
                cy={SLOT[g].y}
                r="30"
                fill="transparent"
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Shift to gear ${g}`}
                onClick={() => onShift(g)}
                onKeyDown={(e) => e.key === "Enter" && onShift(g)}
              />
            ))}

        {/* Lever knob (top-down) */}
        <motion.g style={{ x, y }}>
          <motion.circle
            r="32"
            fill={active === "R" ? "var(--accent-red)" : "var(--accent)"}
            animate={{ opacity: shifting ? 0.22 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ filter: "blur(12px)" }}
          />
          <ellipse cx="3" cy="7" rx="26" ry="24" fill="rgba(0,0,0,0.55)" />
          <motion.g animate={{ scale: shifting ? 1.07 : 1 }} transition={{ duration: 0.25 }}>
            <circle r="25" fill="url(#gs-knob)" />
            <circle r="21.3" fill="none" stroke="rgba(16,18,22,0.5)" strokeWidth="3" strokeDasharray="1.6 2.1" />
            <circle r="17.5" fill="url(#gs-knob-core)" />
            <circle r="17.5" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
            <circle
              r="4.5"
              fill={active === "R" ? "var(--accent-red)" : "var(--accent)"}
              filter="url(#gs-glow)"
              opacity={shifting ? 1 : 0.85}
              style={{ transition: "fill 0.4s" }}
            />
            <ellipse cx="-8" cy="-10" rx="9" ry="5.5" fill="rgba(255,255,255,0.35)" transform="rotate(-32)" />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
