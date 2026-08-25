import type { Metadata } from "next";
import { RootShell } from "@/components/root-shell";
import { baseMetadata } from "@/lib/base-metadata";
import { fontVars } from "./fonts";
import "../globals.css";

export const metadata: Metadata = baseMetadata;

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootShell lang="de" fontVars={fontVars}>
      {children}
    </RootShell>
  );
}
