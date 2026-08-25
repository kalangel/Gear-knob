import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum — Kyrylo Polinkevych",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-widest text-silver transition-colors hover:text-accent"
      >
        ← Zurück zur Startseite
      </Link>

      <h1 className="mt-8 font-display text-4xl font-bold tracking-tight text-metal">Impressum</h1>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-silver">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">
            Angaben gemäß § 5 DDG
          </h2>
          <p>
            Kyrylo Polinkevych
            <br />
            Frühmeßstr. 9
            <br />
            86470 Thannhausen
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a href="mailto:polkyrylo@gmail.com" className="text-accent hover:underline">
              polkyrylo@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">
            Verantwortlich für den Inhalt
          </h2>
          <p>Kyrylo Polinkevych (Anschrift wie oben)</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">Haftung für Inhalte</h2>
          <p>
            Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">Haftung für Links</h2>
          <p>
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein
            Einfluss besteht. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
            Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte
            waren zu diesem Zeitpunkt nicht erkennbar.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">Urheberrecht</h2>
          <p>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
            unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>
      </div>
    </main>
  );
}
