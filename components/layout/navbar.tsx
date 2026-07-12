"use client";

import { motion } from "framer-motion";
import { GEARS, SITE } from "@/lib/data";
import { useActiveGear, scrollToGear } from "@/hooks/use-active-gear";
import { useLang } from "@/components/language-context";
import { usePerf } from "@/components/perf-context";
import type { Lang } from "@/lib/i18n";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const LANGS: Lang[] = ["de", "ru"];

export function Navbar() {
  const active = useActiveGear();
  const { lang, setLang, t } = useLang();
  const { eco, setMode } = usePerf();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        className="flex items-center gap-0.5 rounded-full p-1.5 glass shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:gap-1"
        aria-label="Gear navigation"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mr-0.5 flex h-9 items-center whitespace-nowrap rounded-full px-2.5 font-display text-sm font-bold tracking-tight text-metal transition-opacity hover:opacity-80 sm:mr-1 sm:px-4"
          aria-label={SITE.name}
        >
          {SITE.logo}
        </button>

        <div className="hidden h-5 w-px bg-white/10 sm:block" />

        {GEARS.map(({ gear, id }) => {
          const isActive = active === gear;
          return (
            <button
              key={gear}
              onClick={() => scrollToGear(gear)}
              className={cn(
                "relative flex h-9 items-center gap-2 rounded-full px-2 font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 sm:px-3",
                isActive ? "text-void" : "text-silver hover:text-white"
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-gear"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    gear === "R" ? "bg-accent-red" : "bg-accent"
                  )}
                />
              )}
              <span className="relative font-bold">{gear}</span>
              <span className="relative hidden xl:inline">{t.nav[id]}</span>
            </button>
          );
        })}

        <div className="h-5 w-px bg-white/10" />

        <div className="flex items-center gap-0.5 pl-1 pr-1.5" role="group" aria-label="Sprache / Язык">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                "rounded-full px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 sm:px-2.5",
                lang === l
                  ? "bg-white/10 text-white"
                  : "text-muted hover:text-silver"
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-white/10" />

        {/* ECO — облегчённый режим для слабых ПК */}
        <button
          onClick={() => setMode(eco ? "off" : "on")}
          aria-pressed={eco}
          title={eco ? "ECO an — Effekte reduziert" : "ECO aus — volle Effekte"}
          className={cn(
            "relative ml-0.5 mr-1 flex h-9 items-center gap-1.5 rounded-full px-2.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
            eco
              ? "bg-[#22331f] text-[#8fd97a] shadow-[inset_0_0_0_1px_rgba(143,217,122,0.35)]"
              : "text-muted hover:text-silver"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors duration-300",
              eco ? "bg-[#8fd97a] shadow-[0_0_8px_rgba(143,217,122,0.8)]" : "bg-white/20"
            )}
          />
          Eco
        </button>
      </nav>
    </motion.header>
  );
}
