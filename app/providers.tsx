"use client";

import { MotionConfig } from "framer-motion";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { Noise } from "@/components/effects/noise";
import { GearHud } from "@/components/gearbox/gear-hud";
import { LanguageProvider } from "@/components/language-context";
import { DisplayModeProvider, useDisplayMode } from "@/components/display-mode";

function Shell({ children }: { children: React.ReactNode }) {
  const { flat } = useDisplayMode();
  return (
    // "user" — the OS setting decides whether framer animates at all.
    <MotionConfig reducedMotion="user">
      {children}
      {/* Full-screen overlays (cursor glow, film grain): the plastic mode only */}
      {!flat && <CursorGlow />}
      <GearHud />
      {!flat && <Noise />}
    </MotionConfig>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DisplayModeProvider>
        <Shell>{children}</Shell>
      </DisplayModeProvider>
    </LanguageProvider>
  );
}
