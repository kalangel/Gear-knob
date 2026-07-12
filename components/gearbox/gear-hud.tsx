"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GearShifter } from "./gear-shifter";
import { useActiveGear, scrollToGear } from "@/hooks/use-active-gear";
import { useLang } from "@/components/language-context";
import { GEARS } from "@/lib/data";
import { EASE } from "@/lib/motion";

/** Fixed cockpit HUD — mini shifter that follows scroll position. */
export function GearHud() {
  const gear = useActiveGear();
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const section = GEARS.find((g) => g.gear === gear);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed bottom-6 right-6 z-40 hidden w-[128px] flex-col items-center gap-2 rounded-2xl p-3 glass lg:flex"
          aria-label="Current gear indicator"
        >
          <GearShifter active={gear} onShift={scrollToGear} labelled={false} className="w-full" />
          <div className="flex w-full items-baseline justify-between font-mono text-[10px] uppercase tracking-widest text-silver">
            <span>{t.hud.gear}</span>
            <span className={gear === "R" ? "text-accent-red" : "text-accent"}>{gear}</span>
          </div>
          <div className="w-full truncate text-center font-mono text-[10px] uppercase tracking-widest text-muted">
            {section ? t.nav[section.id] : t.hud.neutral}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
