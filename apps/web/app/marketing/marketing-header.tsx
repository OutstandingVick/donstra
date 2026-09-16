import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { label: "Why it matters", href: "#problem", visibility: "sm:inline-flex" },
  { label: "How it works", href: "#how-donstra-works", visibility: "lg:inline-flex" },
  { label: "Receipts", href: "#verifiable-receipts", visibility: "lg:inline-flex" },
  { label: "Docs", href: "/docs", visibility: "sm:inline-flex" },
] as const;

export function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6 sm:px-6 lg:px-8">
      <nav className="mx-auto grid h-16 w-full max-w-[88rem] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border border-[#0D160B]/10 bg-[#F3F8F1] pl-6 pr-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)] sm:pl-8 sm:pr-3" aria-label="Main navigation">
        <a href="#top" className="inline-flex min-h-11 items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]" aria-label="Donstra home">
          <Image src="/donstra-logo-dark.svg" alt="Donstra" width={132} height={33} priority className="h-8 w-auto" />
        </a>
        <div className="flex min-w-0 items-center justify-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className={`hidden min-h-11 items-center rounded-full px-3 text-sm font-medium text-[#0D160B]/65 transition-colors duration-150 hover:text-[#0D160B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65] ${link.visibility}`}>
              {link.label}
            </a>
          ))}
        </div>
        <Link href="/app" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0D160B] px-5 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:bg-[#1B2A18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">
          <span className="sm:hidden">Open console</span><span className="hidden sm:inline">Open Live Console</span> <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
