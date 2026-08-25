"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GearShifter } from "./gear-shifter";
import { useDisplayMode } from "@/components/display-mode";
import type { Gear } from "@/lib/data";

/** The 3D version loads as a separate chunk, only when it is asked for. */
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
 * Flat is the default and the server-rendered state: an engraved gate seen from
 * above, no WebGL, no 3D chunk. The chrome lever is opt-in ("Plastisch") and
 * still needs WebGL to show up at all.
 */
export function HeroShifter({ active, onShift, className }: HeroShifterProps) {
  const { flat } = useDisplayMode();
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    if (flat) return;
    setWebgl(webglAvailable());
  }, [flat]);

  if (flat || !webgl) {
    return <GearShifter active={active} onShift={onShift} className={className} />;
  }
  return <Shifter3D active={active} onShift={onShift} className={className} />;
}
