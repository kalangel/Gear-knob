"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/** Soft headlight that follows the cursor across the whole page. */
export function CursorGlow() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const x = useSpring(mx, { stiffness: 120, damping: 24, mass: 0.6 });
  const y = useSpring(my, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduced]);

  const background = useMotionTemplate`radial-gradient(560px circle at ${x}px ${y}px, rgba(77,162,255,0.055), transparent 65%)`;

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{ background }}
    />
  );
}
