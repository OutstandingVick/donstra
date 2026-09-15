import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function MarketingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <nav className="!static !mx-auto !flex !h-auto !min-h-20 !w-full !max-w-[90rem] !items-center !justify-between !border-0 !bg-transparent !px-5 !py-4 !backdrop-blur-none sm:!px-8 lg:!px-12" aria-label="Main navigation">
        <a href="#top" className="inline-flex min-h-11 items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]" aria-label="Donstra home">
          <Image src="/donstra-logo.svg" alt="Donstra" width={144} height={36} priority className="h-9 w-auto" />
        </a>
        <div className="!flex !items-center !gap-3 lg:!gap-7">
          <a href="#problem" className="hidden min-h-11 items-center text-sm font-medium text-[#D6E2D3]/70 transition-colors duration-150 hover:text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65] sm:inline-flex">Why it matters</a>
          <a href="#how-donstra-works" className="hidden min-h-11 items-center text-sm font-medium text-[#D6E2D3]/70 transition-colors duration-150 hover:text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65] lg:inline-flex">How it works</a>
          <a href="#verifiable-receipts" className="hidden min-h-11 items-center text-sm font-medium text-[#D6E2D3]/70 transition-colors duration-150 hover:text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65] lg:inline-flex">Receipts</a>
          <Link href="/app" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#16DB65]/35 bg-[#16DB65]/10 px-4 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:border-[#16DB65]/65 hover:bg-[#16DB65]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">
            <span className="sm:hidden">Open console</span><span className="hidden sm:inline">Open Live Console</span> <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
