"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Gauge } from "@/components/gearbox/gauge";
import { useLang } from "@/components/language-context";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { SKILLS, MODULES } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Skills() {
  const { t } = useLang();
  const [gaugesRef, gaugesSeen] = useInViewOnce<HTMLDivElement>("-10% 0px");
  const [chipsRef, chipsSeen] = useInViewOnce<HTMLDivElement>();

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

              <div ref={gaugesRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SKILLS.map((s, i) => (
                  <div
                    key={s.name}
                    className={cn("reveal", gaugesSeen && "reveal-in")}
                    style={{ "--ry": "28px", "--rd": `${i * 0.08}s` } as React.CSSProperties}
                  >
                    <Gauge label={s.name} value={s.value} unit={t.skills.unit} />
                  </div>
                ))}
              </div>

              {/* module switches */}
              <div className="mt-10 border-t border-white/5 pt-8">
                <div className="mb-5 font-mono text-[10px] uppercase tracking-widest2 text-muted">
                  {t.skills.modules}
                </div>
                <div ref={chipsRef} className="flex flex-wrap gap-2.5">
                  {MODULES.map((m, i) => (
                    <span
                      key={m}
                      className={cn(
                        "reveal group flex cursor-default items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-silver transition-colors duration-300 hover:border-accent/50 hover:text-white",
                        chipsSeen && "reveal-in"
                      )}
                      style={{ "--ry": "0px", "--rs": "0.9", "--rd": `${0.3 + i * 0.05}s` } as React.CSSProperties}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/70 transition-shadow duration-300 group-hover:shadow-[0_0_10px_var(--glow)]" />
                      {m}
                    </span>
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
