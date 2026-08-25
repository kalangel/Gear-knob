import type { Metadata } from "next";
import { RootShell } from "@/components/root-shell";
import { baseMetadata } from "@/lib/base-metadata";
import { fontVars } from "./fonts";
import "../globals.css";

export const metadata: Metadata = baseMetadata;

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="ru" fontVars={fontVars}>
      {children}
    </RootShell>
  );
}
