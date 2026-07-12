export type Gear = "N" | "1" | "2" | "3" | "4" | "5" | "R";

export interface GearSection {
  gear: Exclude<Gear, "N">;
  id: "about" | "skills" | "projects" | "experience" | "contact" | "playground";
}

/** Gear → section map. Order = scroll order. Labels live in lib/i18n.ts. */
export const GEARS: GearSection[] = [
  { gear: "1", id: "about" },
  { gear: "2", id: "skills" },
  { gear: "3", id: "projects" },
  { gear: "4", id: "experience" },
  { gear: "5", id: "contact" },
  { gear: "R", id: "playground" },
];

export const SITE = {
  name: "Kyrylo Polinkevych",
  logo: "K—P",
  email: "polkyrylo@gmail.com",
  phone: "+49 152 2401 0029",
  whatsapp: "https://wa.me/4915224010029",
  telegram: "https://t.me/+4915224010029",
  location: "Bayern / Deutschland",
};

/** Values only — labels are localized in lib/i18n.ts (about.statLabels, same order). */
export const STATS = [
  { value: 30, suffix: "+" },
  { value: 100, suffix: "%" },
  { value: 0, suffix: "" },
  { value: 10, suffix: "+" },
];

export const SKILLS = [
  { name: "React / Next.js", value: 92 },
  { name: "TypeScript", value: 88 },
  { name: "Motion Design", value: 90 },
  { name: "UI / UX Design", value: 86 },
  { name: "Node / APIs", value: 72 },
  { name: "WebGL / 3D", value: 60 },
];

export const MODULES = [
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Figma",
  "Three.js",
  "Zustand",
  "Storybook",
  "Vitest",
  "Radix UI",
  "Vercel",
];

/** Visual meta only — descriptions are localized in lib/i18n.ts (projects.descriptions, same order). */
export const PROJECTS = [
  {
    index: "01",
    title: "Gasthof Adler",
    href: "https://adlerbalzhausen.vercel.app/",
    img: "/projects/adler.jpg",
    tags: ["Gastronomy", "Booking", "Events"],
    hue: "from-[#2a1d10] via-[#161009] to-[#08090a]",
    accent: "#e8a34d",
    wide: true,
  },
  {
    index: "02",
    title: "Elektrotechnik Hafner",
    href: "https://elektrotechnik-hafner.vercel.app/",
    img: "/projects/hafner.jpg",
    tags: ["Electrical", "Corporate", "Lead-Gen"],
    hue: "from-[#101d33] via-[#0b1220] to-[#08090a]",
    accent: "#ffd24a",
    wide: false,
  },
  {
    index: "03",
    title: "Spenglerei Jack",
    href: "https://spenglerei-jack.vercel.app/",
    img: "/projects/jack.jpg",
    tags: ["Craft", "Before / After", "FAQ"],
    hue: "from-[#1a2028] via-[#0f1216] to-[#08090a]",
    accent: "#9fb4c7",
    wide: false,
  },
  {
    index: "04",
    title: "Reichelt Haustechnik",
    href: "https://reichelthaustechnik-de.vercel.app/",
    img: "/projects/reichelt.jpg",
    tags: ["HVAC", "Solar", "Booking"],
    hue: "from-[#0f2420] via-[#0a1512] to-[#08090a]",
    accent: "#3fc9a4",
    wide: true,
  },
];
