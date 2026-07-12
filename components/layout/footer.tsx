"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { SITE } from "@/lib/data";
import { Magnetic } from "@/components/ui/magnetic";
import { useLang } from "@/components/language-context";

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
          © 2026 {SITE.name}
        </div>
        <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <Link href="/impressum" className="transition-colors hover:text-accent">
            Impressum
          </Link>
          <Link href="/datenschutz" className="transition-colors hover:text-accent">
            Datenschutz
          </Link>
        </div>
        <Magnetic>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-silver transition-colors hover:text-accent"
          >
            {t.footer.toTop}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-accent/50">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </button>
        </Magnetic>
      </div>
    </footer>
  );
}
