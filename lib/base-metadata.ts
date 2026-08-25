import type { Metadata } from "next";
import { SITE } from "./data";

/** Shared across both root layouts; per-page bits live in lib/seo.ts. */
export const baseMetadata: Metadata = {
  // Every relative URL (canonical, hreflang, og:image) resolves against this.
  // It is the site's own domain — see SITE.url in lib/data.ts.
  metadataBase: new URL(SITE.url),
  keywords: [
    "Frontend-Entwickler",
    "UI/UX-Designer",
    "Webdesign",
    "Website erstellen lassen",
    "React",
    "Next.js",
    "Kyrylo Polinkevych",
  ],
};
