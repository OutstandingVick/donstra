import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { deploymentLinks } from "./deployment-links";

const productLinks = [
  { label: "App", href: "/app", external: false },
  { label: "GitHub", href: "https://github.com/OutstandingVick/donstra", external: true },
  { label: "Docs", href: "https://github.com/OutstandingVick/donstra/blob/main/README.md", external: true },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080D07] px-5 py-12 text-[#F3F8F1] sm:px-8 sm:py-16 lg:px-12" aria-label="Donstra footer">
      <div className="mx-auto grid w-full max-w-[90rem] gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-start md:gap-16">
        <div className="max-w-md">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]" aria-label="Donstra home">
            <Image src="/donstra-logo.svg" alt="Donstra" width={144} height={36} className="h-9 w-auto" />
          </Link>
          <p className="mb-0 mt-5 max-w-[36rem] text-pretty text-sm leading-6 text-[#D6E2D3]/70">Accountability infrastructure that binds an autonomous agent’s testimony to its action before the outcome is known.</p>
        </div>

        <nav aria-label="Product links">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Product</p>
          <ul className="mb-0 mt-4 grid list-none gap-1 p-0">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#D6E2D3]/75 transition-colors duration-150 hover:text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16DB65]">
                  {link.label}{link.external && <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Deployment links">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Networks</p>
          <ul className="mb-0 mt-4 grid list-none gap-1 p-0">
            {deploymentLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 max-w-[16rem] items-center gap-2 text-sm font-medium leading-5 text-[#D6E2D3]/75 transition-colors duration-150 hover:text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16DB65]">
                  {link.label}<ArrowUpRight className="shrink-0" size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-12 flex w-full max-w-[90rem] flex-col gap-2 border-t border-white/10 pt-6 text-xs leading-5 text-[#B7C5B3]/60 sm:flex-row sm:items-center sm:justify-between">
        <span>Donstra — accountability before action.</span>
        <span>Public proof. No hidden cognition claimed.</span>
      </div>
    </footer>
  );
}
