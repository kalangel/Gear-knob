"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { HeroShifter } from "@/components/gearbox/hero-shifter";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { useActiveGear, scrollToGear } from "@/hooks/use-active-gear";
import { useLang } from "@/components/language-context";
import { SITE } from "@/lib/data";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const gear = useActiveGear();
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Scroll-linked parallax is a motion value, not an animation — MotionConfig
  // cannot switch it off, so it is flattened here.
  const yTitle = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -140]);
  const yShifter = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], reduced ? [1, 1] : [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-24 pt-40 sm:pt-28">
      {/* backdrop */}
      <div className="absolute inset-0 grid-lines" aria-hidden />
      <div
        aria-hidden
        className="orb absolute -top-40 left-1/2 h-[720px] w-[920px] -translate-x-1/2 rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(77,162,255,0.07) 0%, rgba(40,44,52,0.14) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <motion.div style={{ y: yTitle, opacity }} className="flex flex-col items-center text-center lg:items-start lg:text-left">
        {/* The hero copy is painted with the first frame — no fade-in. It is what
            Largest Contentful Paint measures, and it is what a visitor came to
            read; the headline's rise carries the entrance on its own. */}
        <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest2 text-silver">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-led" />
          {SITE.name} — {t.hero.role}
        </div>

        <h1
          key={lang}
          className="font-display text-[13vw] font-bold uppercase leading-[0.9] tracking-tight sm:text-[10vw] lg:text-[78px]"
        >
          {t.hero.lines.map((line, i) => (
            <span key={line} className="-mt-[0.15em] block overflow-hidden pt-[0.15em] pb-[0.08em]">
              {/* pt/-mt: give the clipped glyph overshoot (О, С, ä) room inside the
                  background-clip:text box — ink above the box gets no gradient paint */}
              <span
                style={{ animationDelay: `${0.25 + i * 0.14}s` }}
                className={`enter-line -mt-[0.15em] block pt-[0.15em] ${i === 0 ? "text-metal" : "text-accent-glow"}`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-md text-balance text-sm leading-relaxed text-silver md:text-base">
          {t.hero.tagline}
        </p>

        <div className="mt-8">
          <Magnetic>
            <Button variant="accent" size="lg" onClick={() => scrollToGear("5")}>
              {t.hero.cta}
            </Button>
          </Magnetic>
        </div>
      </motion.div>

      {/* Centerpiece — the gearbox */}
      <motion.div
        style={{ y: yShifter }}
        className="relative w-full max-w-[300px] justify-self-center sm:max-w-[340px] lg:max-w-[400px]"
      >
        {/* entrance on an inner element: the outer one carries the scroll parallax */}
        <div className="enter-pop" style={{ animationDelay: "0.9s" }}>
          <div
            aria-hidden
            className="absolute inset-x-8 -bottom-6 h-16 rounded-[50%] bg-black/70 blur-2xl"
          />
          <HeroShifter active={gear} onShift={scrollToGear} className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]" />
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest2 text-muted">
            {t.hero.hint}
          </p>
        </div>
      </motion.div>
      </div>

      <div
        style={{ animationDelay: "1.6s" }}
        className="enter absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="bob flex flex-col items-center gap-1 text-muted">
          <span className="font-mono text-[10px] uppercase tracking-widest2">{t.hero.scroll}</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
}
