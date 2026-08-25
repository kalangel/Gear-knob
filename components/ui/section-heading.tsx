"use client";

import { Reveal } from "./reveal";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  gear: string;
  eyebrow: string;
  title: string;
  className?: string;
}

/** "Erster Gang / Eingelegt" eyebrow + oversized metal title. */
export function SectionHeading({ gear, eyebrow, title, className }: SectionHeadingProps) {
  // inView is observed on the wrapper: the title starts translated outside the
  // overflow clip, so an observer on the title itself would never fire
  const [ref, seen] = useInViewOnce<HTMLDivElement>("-10% 0px");

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
          <span
            aria-hidden
            className={cn(
              "h-px flex-1 origin-left bg-gradient-to-r from-white/20 to-transparent transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
              seen ? "scale-x-100" : "scale-x-0"
            )}
          />
        </div>
      </Reveal>

      <div ref={ref} className="overflow-hidden">
        <h2
          className={cn(
            "rise font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-metal sm:text-6xl md:text-7xl lg:text-8xl",
            seen && "rise-in"
          )}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}
