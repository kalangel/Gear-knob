"use client";

import { MotionConfig } from "framer-motion";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { Noise } from "@/components/effects/noise";
import { GearHud } from "@/components/gearbox/gear-hud";
import { LanguageProvider } from "@/components/language-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        {children}
        <CursorGlow />
        <GearHud />
        <Noise />
      </MotionConfig>
    </LanguageProvider>
  );
}
