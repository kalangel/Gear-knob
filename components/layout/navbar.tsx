"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GEARS, SITE } from "@/lib/data";
import { useActiveGear, scrollToGear } from "@/hooks/use-active-gear";
import { useLang } from "@/components/language-context";
import { useDisplayMode, type DisplayMode } from "@/components/display-mode";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGS: { code: Lang; href: string }[] = [
  { code: "de", href: "/" },
  { code: "ru", href: "/ru" },
];

/** Every control in the bar is at least 44×44 — thumbs, not cursors. */
const TARGET = "flex h-11 min-w-11 items-center justify-center";

const PILL =
  "flex items-center gap-0.5 rounded-full p-1.5 glass shadow-[0_8px_40px_rgba(0,0,0,0.5)] sm:gap-1";

export function Navbar() {
  const active = useActiveGear();
  const { lang, t } = useLang();
  const { flat, locked, setMode } = useDisplayMode();

  const modes: { key: DisplayMode; short: string; label: string }[] = [
    { key: "flat", short: t.mode.flat, label: t.mode.flatLabel },
    { key: "solid", short: t.mode.solid, label: t.mode.solidLabel },
  ];

  return (
    // CSS entrance: the bar is above the fold and must not wait for hydration
    <header
      style={{ animationDelay: "0.4s" }}
      className="enter-down fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-3 sm:top-4 sm:flex-row sm:justify-center"
    >
      <nav className={PILL} aria-label={t.a11y.navGroup}>
        <button
          onClick={() => scrollToGear(null)}
          className={cn(
            TARGET,
            "mr-0.5 whitespace-nowrap rounded-full px-2.5 font-display text-sm font-bold tracking-tight text-metal transition-opacity hover:opacity-80 sm:mr-1 sm:px-4"
          )}
          aria-label={`${SITE.logo} — ${SITE.name}`}
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
                TARGET,
                "relative gap-2 rounded-full px-2 font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 sm:px-3",
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
      </nav>

      {/* Sprache + Darstellung — their own pill, so nothing has to shrink below 44px */}
      <div className={PILL}>
        <div className="flex items-center gap-0.5" role="group" aria-label={t.a11y.langGroup}>
          {LANGS.map((l) => (
            <Link
              key={l.code}
              href={l.href}
              hrefLang={l.code}
              // no prefetch: pulling the other language's route would drag its
              // Cyrillic font subsets (~50 KB) into every page load
              prefetch={false}
              aria-current={lang === l.code ? "true" : undefined}
              className={cn(
                TARGET,
                "rounded-full px-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 sm:px-2.5",
                lang === l.code ? "bg-white/10 text-white" : "text-muted hover:text-silver"
              )}
            >
              {l.code}
            </Link>
          ))}
        </div>

        <div className="h-5 w-px bg-white/10" />

        {/* Two explicit states, not an on/off switch: FLACH is where the site lives. */}
        <div className="flex items-center gap-0.5" role="group" aria-label={t.a11y.modeGroup}>
          {modes.map((m) => {
            const on = m.key === "flat" ? flat : !flat;
            const disabled = locked && m.key === "solid";
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                disabled={disabled}
                aria-pressed={on}
                aria-label={m.label}
                title={disabled ? t.mode.locked : m.label}
                className={cn(
                  TARGET,
                  "rounded-full px-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 sm:px-2.5",
                  on ? "bg-white/10 text-white" : "text-muted hover:text-silver",
                  disabled && "cursor-not-allowed opacity-40 hover:text-muted"
                )}
              >
                {m.short}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
