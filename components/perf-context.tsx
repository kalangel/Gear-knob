"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PerfMode = "auto" | "on" | "off";

interface PerfState {
  /** true → site runs in the lightweight mode (weak hardware / manual ECO). */
  eco: boolean;
  /** What the user picked: auto (hardware detection) / on / off. */
  mode: PerfMode;
  setMode: (m: PerfMode) => void;
  /** What the auto-detect decided (for the UI hint). */
  autoLowEnd: boolean;
}

const PerfContext = createContext<PerfState>({
  eco: false,
  mode: "auto",
  setMode: () => {},
  autoLowEnd: false,
});

const STORAGE_KEY = "kp:eco";

/** Heuristic for "weak hardware": few cores/little memory, save-data, or reduced-motion. */
function detectLowEnd(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
  if (nav.connection?.saveData) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

export function PerfProvider({ children }: { children: ReactNode }) {
  // SSR-safe: assume "off" detection before mount, read the real mode after.
  const [mode, setModeState] = useState<PerfMode>("auto");
  const [autoLowEnd, setAutoLowEnd] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAutoLowEnd(detectLowEnd());
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as PerfMode | null;
      if (saved === "on" || saved === "off" || saved === "auto") setModeState(saved);
    } catch {
      /* private mode etc. */
    }
  }, []);

  const setMode = (m: PerfMode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* noop */
    }
  };

  const eco = mounted && (mode === "on" || (mode === "auto" && autoLowEnd));

  // Global class — CSS overrides are cheaper than threading a prop through every component.
  useEffect(() => {
    document.documentElement.classList.toggle("eco", eco);
  }, [eco]);

  const value = useMemo(
    () => ({ eco, mode, setMode, autoLowEnd }),
    [eco, mode, autoLowEnd]
  );

  return <PerfContext.Provider value={value}>{children}</PerfContext.Provider>;
}

export function usePerf() {
  return useContext(PerfContext);
}
