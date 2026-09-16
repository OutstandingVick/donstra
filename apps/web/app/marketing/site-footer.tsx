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
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#0D160B] px-5 pt-16 text-[#F3F8F1] sm:px-8 sm:pt-20 lg:min-h-[48rem] lg:px-12 lg:pt-24" aria-label="Donstra footer">
      <div className="relative z-10 mx-auto grid w-full max-w-[90rem] gap-12 md:grid-cols-3 md:items-start md:gap-16">
        <div className="max-w-sm">
          <p className="m-0 font-mono text-sm text-[#B7C5B3]/60">Donstra</p>
          <p className="mb-0 mt-5 max-w-[22rem] text-pretty text-base leading-7 text-[#F3F8F1]/85">Accountability infrastructure that binds an autonomous agent’s testimony to its action before the outcome is known.</p>
        </div>

        <nav aria-label="Product links">
          <p className="m-0 font-mono text-sm text-[#B7C5B3]/60">Product</p>
          <ul className="mb-0 mt-4 grid list-none gap-0 p-0">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="inline-flex min-h-9 items-center gap-2 text-base font-medium text-[#F3F8F1]/85 transition-colors duration-150 hover:text-[#16DB65] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16DB65]">
                  {link.label}{link.external && <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Deployment links">
          <p className="m-0 font-mono text-sm text-[#B7C5B3]/60">Networks</p>
          <ul className="mb-0 mt-4 grid list-none gap-0 p-0">
            {deploymentLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-9 max-w-[16rem] items-center gap-2 text-base font-medium leading-6 text-[#F3F8F1]/85 transition-colors duration-150 hover:text-[#16DB65] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16DB65]">
                  {link.label}<ArrowUpRight className="shrink-0" size={14} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="relative z-10 mx-auto mt-28 w-full max-w-[90rem] sm:mt-40 lg:mt-48">
        <Link href="/" aria-label="Donstra home" className="block w-fit max-w-full text-[clamp(5.5rem,21vw,21rem)] font-semibold leading-[0.75] tracking-[-0.095em] text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">
          donstra
        </Link>
      </div>
      <div className="mx-auto mt-12 flex w-full max-w-[90rem] flex-col gap-2 border-t border-white/10 pt-6 text-xs leading-5 text-[#B7C5B3]/60 sm:flex-row sm:items-center sm:justify-between">
        <span>Donstra — accountability before action.</span>
        <span>Public proof. No hidden cognition claimed.</span>
      </div>
    </footer>
  );
}
