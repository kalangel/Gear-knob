import { Exo_2, Inter, JetBrains_Mono } from "next/font/google";

/**
 * German route group: Latin only, and only the weights the design actually
 * uses. Loading the Cyrillic subsets here would add ~50 KB of woff2 to the
 * critical path for text this page never renders — the Russian route has its
 * own font module.
 */
const display = Exo_2({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVars = `${display.variable} ${sans.variable} ${mono.variable}`;
