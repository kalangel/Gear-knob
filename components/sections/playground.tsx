"use client";

import { motion } from "framer-motion";
import { FlaskConical, Sparkles, Waves } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { useLang } from "@/components/language-context";
import { EASE } from "@/lib/motion";

const ICONS = [Waves, Sparkles, FlaskConical];

export function Playground() {
  const { t } = useLang();

  return (
    <section id="playground" className="relative scroll-mt-24 overflow-hidden py-20 md:py-28">
      {/* red reverse ambience */}
      <div
        aria-hidden
        className="orb absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,52,65,0.12), transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* marquee */}
      <div className="relative mb-12 -rotate-1 border-y border-accent-red/20 bg-accent-red/5 py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest2 text-accent-red/80">
          {Array.from({ length: 2 }).map((_, half) => (
            <span key={half} className="flex gap-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="flex items-center gap-10">
                  {t.playground.marquee[0]} <span className="text-white/30">///</span>{" "}
                  {t.playground.marquee[1]} <span className="text-white/30">///</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading gear="R" eyebrow={t.playground.eyebrow} title={t.playground.title} />

        <div className="grid gap-5 md:grid-cols-3">
          {t.playground.items.map(({ title, text }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40, rotate: i % 2 ? 1.5 : -1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
                whileHover={{ y: -8, rotate: i % 2 ? -1 : 1 }}
                className="sheen group rounded-3xl border border-accent-red/15 bg-gradient-to-b from-[#16090b] to-carbon p-8 transition-colors duration-500 hover:border-accent-red/40"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-red/25 text-accent-red transition-shadow duration-500 group-hover:shadow-[0_0_28px_var(--glow-red)]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-metal">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver">{text}</p>
                <div className="mt-6 font-mono text-[10px] uppercase tracking-widest2 text-accent-red/60">
                  {t.playground.footnote}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
