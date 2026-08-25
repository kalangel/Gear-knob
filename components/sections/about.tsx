"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useLang } from "@/components/language-context";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { STATS } from "@/lib/data";
import { cn } from "@/lib/utils";

function Stat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>("-15% 0px");
  const out = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // The count-up writes textContent directly — a React render per frame, four
  // times over, is a needless tax on a phone.
  useEffect(() => {
    const el = out.current;
    if (!el) return;
    if (reduced) {
      el.textContent = String(value);
      return;
    }
    if (!inView) return;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start - delay * 1000) / 1600);
      if (t >= 0) el.textContent = String(Math.round(ease(t) * value));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, delay, reduced]);

  return (
    <div ref={ref} className="group rounded-2xl p-6 glass transition-all duration-500 hover:-translate-y-1 hover:border-white/20 md:p-8">
      <div className="font-display text-5xl font-bold tabular-nums text-metal md:text-6xl">
        <span ref={out}>0</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-3 h-px w-8 bg-accent/50 transition-all duration-500 group-hover:w-full" />
      <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-silver">{label}</div>
    </div>
  );
}

export function About() {
  const { t } = useLang();

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:py-28">
      <SectionHeading gear="1" eyebrow={t.about.eyebrow} title={t.about.title} />

      <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <p className="text-balance font-display text-2xl font-medium leading-snug text-chrome md:text-4xl">
            {t.about.statement.map((seg, i) => (
              <span
                key={i}
                className={cn(
                  seg.accent === "metal" && "text-metal",
                  seg.accent === "blue" && "text-accent-glow"
                )}
              >
                {seg.text}
              </span>
            ))}
          </p>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-silver md:text-base">
            {t.about.body}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s, i) => (
            <Stat key={i} value={s.value} suffix={s.suffix} label={t.about.statLabels[i]} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
