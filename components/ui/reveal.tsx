"use client";

import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  /** seconds */
  delay?: number;
  /** travel distance in px */
  y?: number;
  className?: string;
}

/** Fade + rise once when scrolled into view. CSS transition, no JS animation. */
export function Reveal({ children, delay = 0, y = 36, className }: RevealProps) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("reveal", seen && "reveal-in", className)}
      style={{ "--ry": `${y}px`, "--rd": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
