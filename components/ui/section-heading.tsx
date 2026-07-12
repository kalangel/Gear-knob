"use client";

import { motion } from "framer-motion";
import { Reveal } from "./reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  gear: string;
  eyebrow: string;
  title: string;
  className?: string;
}

/** "Erster Gang / Eingelegt" eyebrow + oversized metal title. */
export function SectionHeading({ gear, eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <Reveal>
        <div className="mb-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest2 text-muted">
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border text-sm font-bold",
              gear === "R"
                ? "border-accent-red/40 text-accent-red"
                : "border-accent/40 text-accent"
            )}
          >
            {gear}
          </span>
          <span>{eyebrow}</span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="h-px flex-1 origin-left bg-gradient-to-r from-white/20 to-transparent"
          />
        </div>
      </Reveal>
      {/* inView is observed on the wrapper: the title starts translated outside the
          overflow clip, so an observer on the title itself would never fire */}
      <motion.div
        className="overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        <motion.h2
          key={title}
          variants={{ hidden: { y: "105%" }, visible: { y: "0%" } }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-metal sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {title}
        </motion.h2>
      </motion.div>
    </div>
  );
}
