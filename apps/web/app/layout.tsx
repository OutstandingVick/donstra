import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Donstra — Proof Before Action",
  description: "Cryptographic testimony integrity and GenLayer adjudication for autonomous agents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

