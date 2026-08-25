import type { Metadata } from "next";
import type { Lang } from "./i18n";

/** One preview image for both languages: the flat gate on black, no type on top. */
export const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
};

const PATH: Record<Lang, string> = { de: "/", ru: "/ru" };

const COPY: Record<Lang, { title: string; description: string; ogTitle: string; ogDescription: string; alt: string }> = {
  de: {
    title: "Kyrylo Polinkevych — Frontend-Entwickler & UI/UX-Designer",
    description:
      "Design und Frontend aus einer Hand: Websites für Ihr Unternehmen — präzise gebaut, schnell und auf Anfragen optimiert. Festpreis nach Briefing.",
    ogTitle: "Kyrylo Polinkevych — Präzision in Bewegung",
    ogDescription:
      "Design und Frontend aus einer Hand: Interfaces, die so präzise laufen wie gute Mechanik.",
    alt: "Schaltkulisse eines 6-Gang-Getriebes, von oben, auf Schwarz",
  },
  ru: {
    title: "Кирилл Полинкевич — frontend-разработчик и UI/UX-дизайнер",
    description:
      "Дизайн и фронтенд в одних руках: сайты для вашего бизнеса — собраны точно, работают быстро, заточены под заявки. Фикс-цена после брифа.",
    ogTitle: "Кирилл Полинкевич — точность в движении",
    ogDescription:
      "Дизайн и фронтенд в одних руках: интерфейсы, которые работают чётко, как хорошая механика.",
    alt: "Кулиса шестиступенчатой коробки передач, вид сверху, на чёрном",
  },
};

/**
 * Page metadata for one language version. Both versions point at each other
 * through hreflang and declare their own canonical — checked by hand against
 * the rendered <head>, not assumed.
 */
export function pageMetadata(lang: Lang): Metadata {
  const c = COPY[lang];
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: PATH[lang],
      languages: {
        de: PATH.de,
        ru: PATH.ru,
        "x-default": PATH.de,
      },
    },
    openGraph: {
      type: "website",
      url: PATH[lang],
      siteName: "Kyrylo Polinkevych",
      title: c.ogTitle,
      description: c.ogDescription,
      locale: lang === "de" ? "de_DE" : "ru_RU",
      alternateLocale: lang === "de" ? "ru_RU" : "de_DE",
      images: [{ ...OG_IMAGE, alt: c.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.ogTitle,
      description: c.ogDescription,
      images: [OG_IMAGE.url],
    },
  };
}
