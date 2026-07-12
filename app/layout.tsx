import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // TODO: nach dem Deploy durch die echte Vercel-URL (oder eigene Domain) ersetzen
  metadataBase: new URL("https://kyrylo-polinkevych.vercel.app"),
  title: "Kyrylo Polinkevych — Frontend-Entwickler & UI/UX-Designer",
  description:
    "Design und Frontend aus einer Hand: Websites für Ihr Unternehmen — präzise gebaut, schnell und auf Anfragen optimiert. Webdesign ab 690 €.",
  keywords: [
    "Frontend-Entwickler",
    "UI/UX-Designer",
    "Webdesign",
    "Website erstellen lassen",
    "React",
    "Next.js",
    "Kyrylo Polinkevych",
  ],
  openGraph: {
    title: "Kyrylo Polinkevych — Präzision in Bewegung",
    description:
      "Design und Frontend aus einer Hand: Interfaces, die so präzise laufen wie gute Mechanik.",
    type: "website",
    locale: "de_DE",
    alternateLocale: "ru_RU",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Kyrylo Polinkevych — Frontend-Entwickler & UI/UX-Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
