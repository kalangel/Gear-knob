"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DICT, type Dict, type Lang } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  t: Dict;
}

const LangContext = createContext<LangContextValue>({ lang: "de", t: DICT.de });

/**
 * The language is the URL: "/" is German, "/ru" is Russian. That keeps the
 * server-rendered HTML honest — which is what hreflang promises to crawlers,
 * and what a shared link has to deliver.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang: Lang = pathname?.startsWith("/ru") ? "ru" : "de";

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={{ lang, t: DICT[lang] }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
