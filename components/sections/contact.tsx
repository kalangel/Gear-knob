"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Power, Send } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { useLang } from "@/components/language-context";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-xl border border-white/8 bg-black/30 px-4 py-3.5 text-sm text-white placeholder:text-muted shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] transition-colors focus:border-accent/60 focus:outline-none focus:ring-1 focus:ring-accent/40";

const CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp", value: SITE.phone, href: SITE.whatsapp },
  { icon: Send, label: "Telegram", value: SITE.phone, href: SITE.telegram },
  { icon: Mail, label: "E-Mail", value: SITE.email, href: `mailto:${SITE.email}` },
];

function Channel({ icon: Icon, label, value, href }: (typeof CHANNELS)[number]) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-white/8 px-4 py-3.5 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_24px_var(--glow)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-silver transition-colors duration-300 group-hover:border-accent/60 group-hover:text-accent">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[9px] uppercase tracking-widest2 text-muted">
          {label}
        </span>
        <span className="block truncate font-mono text-[12px] tracking-wider text-silver transition-colors duration-300 group-hover:text-white">
          {value}
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
    </a>
  );
}

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `${t.contact.subject} — ${data.get("name") || ""}`,
          from_name: String(data.get("name") || ""),
          name: String(data.get("name") || ""),
          email: String(data.get("email") || ""),
          message: String(data.get("message") || ""),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "send failed");
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const ignited = status === "sending" || status === "sent";

  return (
    <section id="contact" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pt-12 pb-20 md:pt-16 md:pb-28">
      <SectionHeading gear="5" eyebrow={t.contact.eyebrow} title={t.contact.title} />

      <Reveal>
        <div className="chrome-ring rounded-[28px] p-1">
          <div className="carbon grid gap-10 rounded-[24px] p-7 md:grid-cols-[1fr_1.3fr] md:p-12">
            {/* left console */}
            <div className="flex flex-col gap-4">
              <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest2 text-muted">
                <span>{t.contact.status}</span>
                <span className="flex items-center gap-2 text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-led" />
                  {t.contact.online}
                </span>
              </div>

              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest2 text-muted">
                {t.contact.direct}
              </div>
              {CHANNELS.map((c) => (
                <Channel key={c.label} {...c} />
              ))}

              <div className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-widest text-muted">
                {SITE.location}
              </div>
            </div>

            {/* right console — form */}
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-2 block font-mono text-[10px] uppercase tracking-widest2 text-muted">
                    {t.contact.fields.name}
                  </label>
                  <input id="c-name" name="name" required placeholder={t.contact.fields.namePh} className={FIELD} />
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-2 block font-mono text-[10px] uppercase tracking-widest2 text-muted">
                    {t.contact.fields.email}
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    required
                    placeholder={t.contact.fields.emailPh}
                    className={FIELD}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="c-msg" className="mb-2 block font-mono text-[10px] uppercase tracking-widest2 text-muted">
                  {t.contact.fields.message}
                </label>
                <textarea
                  id="c-msg"
                  name="message"
                  required
                  rows={5}
                  placeholder={t.contact.fields.messagePh}
                  className={cn(FIELD, "h-full min-h-[130px] resize-none")}
                />
              </div>

              <div className="mt-6 flex flex-wrap-reverse items-center justify-between gap-5">
                <p
                  aria-live="polite"
                  className={cn(
                    "max-w-[220px] font-mono text-[10px] uppercase leading-relaxed tracking-widest",
                    status === "error" ? "text-accent-red" : "text-muted"
                  )}
                >
                  {status === "error" ? t.contact.error : t.contact.hint}
                </p>
                <Magnetic strength={0.3}>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.94 }}
                    className={cn(
                      "relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full border-2 font-mono text-[9px] font-bold uppercase tracking-widest transition-all duration-300",
                      ignited
                        ? "border-accent bg-accent/15 text-accent shadow-[0_0_50px_var(--glow)]"
                        : "border-accent-red/60 bg-black/40 text-accent-red shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)] hover:shadow-[0_0_36px_var(--glow-red)]"
                    )}
                    aria-label={t.contact.start}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-1.5 rounded-full border",
                        ignited ? "border-accent/40" : "border-white/10"
                      )}
                    />
                    <Power className="h-5 w-5" />
                    <span className="max-w-[4.5rem] px-1 text-center leading-snug tracking-[0.16em]">
                      {status === "sending"
                        ? t.contact.ignition
                        : status === "sent"
                          ? t.contact.sent
                          : t.contact.start}
                    </span>
                  </motion.button>
                </Magnetic>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
