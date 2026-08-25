"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * How the shifter — and with it the whole cockpit — is drawn.
 *
 *  "flat"  → engraved gate, top-down, no WebGL. THE DEFAULT.
 *  "solid" → chrome lever in 3D. Opt-in, one tap away.
 *
 * The choice lives for the browsing session only (sessionStorage), never in
 * localStorage: a mode is a mood, not a setting worth remembering for months.
 */
export type DisplayMode = "flat" | "solid";

interface DisplayState {
  mode: DisplayMode;
  /** Effective flatness — true whenever reduced motion is requested. */
  flat: boolean;
  /** The OS asks for reduced motion → "solid" is off the table. */
  locked: boolean;
  setMode: (m: DisplayMode) => void;
}

const DisplayContext = createContext<DisplayState>({
  mode: "flat",
  flat: true,
  locked: false,
  setMode: () => {},
});

const STORAGE_KEY = "kp:darstellung";

export function DisplayModeProvider({ children }: { children: ReactNode }) {
  // SSR and first paint are always flat — that is the default state, so there
  // is nothing to reconcile on hydration.
  const [mode, setModeState] = useState<DisplayMode>("flat");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLocked(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved === "solid" || saved === "flat") setModeState(saved);
    } catch {
      /* private mode / storage disabled — flat it is */
    }
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setMode = useCallback((m: DisplayMode) => {
    setModeState(m);
    try {
      sessionStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* noop */
    }
  }, []);

  const flat = locked || mode === "flat";

  // One global class: CSS overrides are cheaper than threading a prop
  // through every component.
  useEffect(() => {
    document.documentElement.classList.toggle("flat", flat);
  }, [flat]);

  const value = useMemo(
    () => ({ mode, flat, locked, setMode }),
    [mode, flat, locked, setMode]
  );

  return <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>;
}

export function useDisplayMode() {
  return useContext(DisplayContext);
}
