"use client";

import { useEffect, useRef, useState } from "react";
import { GEARS, type Gear } from "@/lib/data";

/**
 * Watches which gear-section crosses the vertical center of the viewport.
 * Returns "N" while in the hero / between sections above the first one.
 */
export function useActiveGear(): Gear {
  const [gear, setGear] = useState<Gear>("N");
  const ticking = useRef(false);

  useEffect(() => {
    const measure = () => {
      ticking.current = false;
      const mid = window.innerHeight * 0.5;
      let current: Gear = "N";
      for (const s of GEARS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          current = s.gear;
          break;
        }
      }
      setGear(current);
    };
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return gear;
}

/**
 * Engage a gear = scroll to its section. `null` (or "N") goes back to idle,
 * i.e. the top of the page. Smooth scrolling is itself motion, so it is off
 * when the system asks for less of it.
 */
export function scrollToGear(gear: Gear | null) {
  const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  if (!gear || gear === "N") {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const target = GEARS.find((g) => g.gear === gear);
  if (!target) return;
  document.getElementById(target.id)?.scrollIntoView({ behavior });
}
