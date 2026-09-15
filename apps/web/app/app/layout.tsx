import type { Metadata } from "next";
import { AppShell } from "./components/app-shell";

export const metadata: Metadata = {
  title: "Live Console — Donstra",
  description: "Inspect how agent testimony, exact actions, challenges, and settlements are bound together.",
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
