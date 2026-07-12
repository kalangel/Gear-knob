"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GearShifter } from "./gear-shifter";
import { usePerf } from "@/components/perf-context";
import type { Gear } from "@/lib/data";

/** 3D-версия грузится отдельным чанком и только на способном железе. */
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
 * Прогрессивное улучшение: сразу рендерим лёгкий SVG-шифтер,
 * на нормальном железе поверх подгружается полноценный 3D.
 * В ECO-режиме / без WebGL остаёмся на SVG.
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
