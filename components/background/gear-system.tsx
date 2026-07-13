"use client";

/**
 * Blueprint gear-train background.
 *
 * Purely decorative (aria-hidden, pointer-events: none). Driven by ONE
 * source of truth — the normalized page scroll progress. Each frame only
 * the `transform` attribute of the pre-rendered <g> groups changes;
 * paths are generated once in gear-config and never recomputed.
 */

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll } from "framer-motion";
import { GEARS, TOTAL_ROTATION } from "./gear-config";

const RAD2DEG = 180 / Math.PI;

/** engineering center-line dash: long–short alternating */
const CENTERLINE_DASH = "22 7 5 7";

export function GearSystem() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const [small, setSmall] = useState(false);
  const groupRefs = useRef(new Map<string, SVGGElement>());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setSmall(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const apply = (master: number) => {
      for (const g of GEARS) {
        const el = groupRefs.current.get(g.id);
        if (!el) continue;
        const angle = (g.k * master + g.phase) * RAD2DEG;
        el.setAttribute("transform", `rotate(${angle.toFixed(3)})`);
      }
    };

    // seat everything at the correct phase immediately (also the
    // static pose for prefers-reduced-motion)
    apply(scrollYProgress.get() * TOTAL_ROTATION);
    if (reduced) return;

    let current = scrollYProgress.get() * TOTAL_ROTATION;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(now - last, 64);
      last = now;
      const target = scrollYProgress.get() * TOTAL_ROTATION;
      if (target === current) return; // idle — skip DOM writes
      // critically-damped ease toward the scroll position (inertia)
      current += (target - current) * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - current) < 1e-4) current = target;
      apply(current);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress, reduced, small]);

  const visible = small ? GEARS.filter((g) => g.mobile) : GEARS;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio={small ? "xMaxYMid slice" : "xMidYMid slice"}
        fill="none"
      >
        {visible.map((g) => {
          const stroke = g.accent ? "rgba(77,162,255,0.20)" : "rgba(255,255,255,0.09)";
          const faint = "rgba(255,255,255,0.045)";
          const axis = g.shape.tipRadius * 1.14;
          return (
            <g key={g.id} transform={`translate(${g.x} ${g.y})`}>
              {/* drawing furniture: pitch circle + center lines (static) */}
              <circle
                r={g.shape.pitchRadius}
                stroke={faint}
                strokeDasharray="6 10"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1={-axis}
                x2={axis}
                stroke={faint}
                strokeDasharray={CENTERLINE_DASH}
                vectorEffect="non-scaling-stroke"
              />
              <line
                y1={-axis}
                y2={axis}
                stroke={faint}
                strokeDasharray={CENTERLINE_DASH}
                vectorEffect="non-scaling-stroke"
              />
              <circle r={2.5} fill={faint} />
              {/* the rotating wheel — only this group's transform changes */}
              <g
                ref={(el) => {
                  if (el) groupRefs.current.set(g.id, el);
                  else groupRefs.current.delete(g.id);
                }}
                style={{ willChange: "transform" }}
              >
                <path
                  d={g.shape.d}
                  fillRule="evenodd"
                  stroke={stroke}
                  strokeWidth={g.accent ? 1.4 : 1.2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
