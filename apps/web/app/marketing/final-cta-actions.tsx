import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function FinalCtaActions() {
  return (
    <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
      <Link href="/app" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#16DB65] px-5 text-sm font-semibold text-[#071006] transition-transform duration-150 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        Open Live Console <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
      </Link>
      <Link href="/app/receipts" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-5 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">
        Inspect receipts <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
      </Link>
      <a href="#how-donstra-works" className="inline-flex min-h-12 items-center justify-center px-3 text-sm font-semibold text-[#D6E2D3]/75 transition-colors duration-150 hover:text-[#F3F8F1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">
        Learn how Donstra works
      </a>
    </div>
  );
}
