import { Exo_2, Inter, JetBrains_Mono } from "next/font/google";

/** Russian route group: Latin + Cyrillic, same weights as the German one. */
const display = Exo_2({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;
