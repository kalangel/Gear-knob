"use client";

import { MotionConfig } from "framer-motion";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { Noise } from "@/components/effects/noise";
import { GearHud } from "@/components/gearbox/gear-hud";
import { LanguageProvider } from "@/components/language-context";
import { PerfProvider, usePerf } from "@/components/perf-context";

function Shell({ children }: { children: React.ReactNode }) {
  const { eco } = usePerf();
  return (
    // In eco mode, kill JS transform animations entirely — the biggest CPU win.
    <MotionConfig reducedMotion={eco ? "always" : "user"}>
      {children}
      {/* Full-screen overlays (cursor glow, film grain) — expensive on weak GPUs */}
      {!eco && <CursorGlow />}
      <GearHud />
      {!eco && <Noise />}
    </MotionConfig>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PerfProvider>
        <Shell>{children}</Shell>
      </PerfProvider>
    </LanguageProvider>
  );
}
