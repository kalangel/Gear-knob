"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Gauge } from "@/components/gearbox/gauge";
import { useLang } from "@/components/language-context";
import { SKILLS, MODULES } from "@/lib/data";
import { EASE } from "@/lib/motion";

export function Skills() {
  const { t } = useLang();

  return (
    <section id="skills" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading gear="2" eyebrow={t.skills.eyebrow} title={t.skills.title} />

        <Reveal>
          <div className="chrome-ring rounded-[28px] p-1">
            <div className="carbon rounded-[24px] p-6 md:p-10">
              {/* cluster header */}
              <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-muted">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-led" />
                  {t.skills.status}
                </span>
                <span className="hidden sm:block">{t.skills.diagnostics}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SKILLS.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                  >
                    <Gauge label={s.name} value={s.value} unit={t.skills.unit} />
                  </motion.div>
                ))}
              </div>

              {/* module switches */}
              <div className="mt-10 border-t border-white/5 pt-8">
                <div className="mb-5 font-mono text-[10px] uppercase tracking-widest2 text-muted">
                  {t.skills.modules}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {MODULES.map((m, i) => (
                    <motion.span
                      key={m}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.05 }}
                      className="group flex cursor-default items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-silver transition-colors duration-300 hover:border-accent/50 hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/70 transition-shadow duration-300 group-hover:shadow-[0_0_10px_var(--glow)]" />
                      {m}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
