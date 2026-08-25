import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Kyrylo Polinkevych",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-widest text-silver transition-colors hover:text-accent"
      >
        ← Zurück zur Startseite
      </Link>

      <h1 className="mt-8 font-display text-4xl font-bold tracking-tight text-metal">
        Datenschutzerklärung
      </h1>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-silver">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):
            <br />
            Kyrylo Polinkevych
            <br />
            Frühmeßstr. 9
            <br />
            86470 Thannhausen
            <br />
            E-Mail:{" "}
            <a href="mailto:polkyrylo@gmail.com" className="text-accent hover:underline">
              polkyrylo@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">
            2. Hosting (Vercel)
          </h2>
          <p>
            Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA
            gehostet. Beim Aufruf der Website erhebt Vercel automatisch technische Zugriffsdaten
            (sog. Server-Logfiles), u.&nbsp;a. IP-Adresse, Datum und Uhrzeit des Zugriffs,
            Browsertyp und Betriebssystem. Diese Daten sind technisch erforderlich, um die Website
            auszuliefern und die Stabilität und Sicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f
            DSGVO). Die Übermittlung in die USA erfolgt auf Grundlage der
            EU-Standardvertragsklauseln. Weitere Informationen:{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              vercel.com/legal/privacy-policy
            </a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">
            3. Kontaktaufnahme per E-Mail
          </h2>
          <p>
            Wenn Sie über das Kontaktformular bzw. per E-Mail Kontakt aufnehmen, werden die von
            Ihnen mitgeteilten Daten (Name, E-Mail-Adresse, Nachricht) ausschließlich zur
            Bearbeitung Ihrer Anfrage verarbeitet (Art. 6 Abs. 1 lit. b DSGVO). Das Kontaktformular
            öffnet dabei Ihr eigenes E-Mail-Programm; eine Speicherung der Daten auf dieser Website
            findet nicht statt.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">
            4. Cookies und Tracking
          </h2>
          <p>
            Diese Website verwendet keine Cookies, keine Analyse-Tools und keine
            Tracking-Technologien. Schriftarten werden lokal eingebunden; es findet keine
            Verbindung zu Google-Servern statt.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-chrome">5. Ihre Rechte</h2>
          <p>
            Sie haben im Rahmen der DSGVO folgende Rechte: Auskunft (Art. 15), Berichtigung
            (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
            Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21).
            Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
            beschweren (Art. 77 DSGVO).
          </p>
        </section>
      </div>
    </main>
  );
}
