import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Donstra — Accountability Before Action",
  description: "Accountability infrastructure that proves what autonomous agents committed before they acted.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
