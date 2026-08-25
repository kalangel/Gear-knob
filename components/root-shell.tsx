import { Providers } from "@/app/providers";
import type { Lang } from "@/lib/i18n";

/**
 * Without JavaScript, framer-motion's server-rendered `initial` styles and the
 * CSS reveals would leave every revealed block at opacity 0. This unhides them
 * — headings, copy and the contact links stay readable with scripting off.
 */
const NOSCRIPT_CSS = `
:is(header, main, footer) :not(svg):not(svg *) {
  opacity: 1 !important;
  transform: none !important;
}
`;

/**
 * The document shell, shared by both root layouts. `lang` is baked into the
 * server-rendered HTML — "/" ships lang="de", "/ru" ships lang="ru", so a
 * crawler or a visitor without JavaScript is told the truth. Each route group
 * passes its own font subsets in `fontVars`.
 */
export function RootShell({
  lang,
  fontVars,
  children,
}: {
  lang: Lang;
  fontVars: string;
  children: React.ReactNode;
}) {
  return (
    // "flat" from the very first byte: the engraved gate is the default state,
    // so there is no post-hydration swap and nothing to reconcile.
    <html lang={lang} className={`flat ${fontVars}`}>
      <body className="font-sans antialiased">
        <noscript>
          <style>{NOSCRIPT_CSS}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
