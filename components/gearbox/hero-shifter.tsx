"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GearShifter } from "./gear-shifter";
import { usePerf } from "@/components/perf-context";
import type { Gear } from "@/lib/data";

/** The 3D version loads as a separate chunk, only on capable hardware. */
const Shifter3D = dynamic(
  () => import("./shifter-3d").then((m) => m.Shifter3D),
  { ssr: false, loading: () => <div style={{ aspectRatio: "15 / 16" }} /> }
);

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export interface HeroShifterProps {
  active: Gear;
  onShift: (g: Gear) => void;
  className?: string;
}

/**
 * Progressive enhancement: render the lightweight SVG shifter immediately,
 * then swap in the full 3D version on capable hardware.
 * Stays on SVG in ECO mode / without WebGL.
 */
export function HeroShifter({ active, onShift, className }: HeroShifterProps) {
  const { eco } = usePerf();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(webglAvailable());
  }, []);

  if (eco || !webgl) {
    return <GearShifter active={active} onShift={onShift} className={className} />;
  }
  return <Shifter3D active={active} onShift={onShift} className={className} />;
}
