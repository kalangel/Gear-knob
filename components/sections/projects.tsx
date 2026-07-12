"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { useLang } from "@/components/language-context";
import { scrollToGear } from "@/hooks/use-active-gear";
import { PROJECTS } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Project = (typeof PROJECTS)[number];

function ProjectCard({
  project,
  description,
  visit,
  index,
}: {
  project: Project;
  description: string;
  visit: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 160, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.85, ease: EASE, delay: (index % 2) * 0.1 }}
      className={cn("group", project.wide ? "md:col-span-3" : "md:col-span-2")}
      style={{ perspective: 1200 }}
    >
      <motion.a
        ref={ref}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — ${visit}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={cn(
          "sheen relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br p-8 transition-[border-color,box-shadow] duration-500 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:min-h-[420px] md:p-10",
          project.hue
        )}
      >
        {/* live site preview */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={project.img}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top opacity-35 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
        </div>
        {/* animated accent bloom */}
        <div
          aria-hidden
          className="orb pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-30"
          style={{ background: project.accent }}
        />
        {/* giant index */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-8 right-4 font-display text-[9rem] font-bold leading-none text-white/[0.04] transition-colors duration-700 group-hover:text-white/[0.07] md:text-[12rem]"
          style={{ transform: "translateZ(30px)" }}
        >
          {project.index}
        </span>

        <div className="relative flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
          <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest2 text-muted">
            /{project.index}
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] text-silver">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-led" />
              {visit}
            </span>
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-silver opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-hover:border-white/30 group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="relative" style={{ transform: "translateZ(50px)" }}>
          <h3 className="font-display text-3xl font-bold tracking-tight text-metal md:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-silver">{description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-silver"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.a>
    </motion.article>
  );
}

export function Projects() {
  const { t } = useLang();

  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-20 md:py-28">
      <SectionHeading gear="3" eyebrow={t.projects.eyebrow} title={t.projects.title} />
      <div className="grid gap-5 md:grid-cols-5">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.index}
            project={p}
            description={t.projects.descriptions[i]}
            visit={t.projects.visit}
            index={i}
          />
        ))}
      </div>

      {/* offer strip */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mt-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/8 p-7 glass md:flex-row md:p-9"
      >
        <p className="max-w-2xl text-balance text-center text-sm leading-relaxed text-silver md:text-left md:text-base">
          {t.projects.offer.lead}{" "}
          <span className="whitespace-nowrap font-display text-xl font-bold text-metal md:text-2xl">
            {t.projects.offer.price}
          </span>
        </p>
        <Magnetic>
          <Button variant="accent" size="lg" onClick={() => scrollToGear("5")}>
            {t.projects.offer.cta}
          </Button>
        </Magnetic>
      </motion.div>
    </section>
  );
}
