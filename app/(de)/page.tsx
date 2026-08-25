import type { Metadata } from "next";
import { Home } from "@/components/home";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("de");

export default function HomeDe() {
  return <Home />;
}
