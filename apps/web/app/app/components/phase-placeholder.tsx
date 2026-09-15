import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

export function PhasePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center">
      <section className="w-full rounded-xl border border-white/10 bg-[#0A1109] p-6 sm:p-8" aria-labelledby="placeholder-title">
        <span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-white/50"><Construction size={19} aria-hidden="true" /></span>
        <p className="mb-0 mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#4BED86]">Phase 2</p>
        <h1 id="placeholder-title" className="mb-0 mt-3 text-3xl font-semibold tracking-[-0.03em] text-white">{title}</h1>
        <p className="mb-0 mt-3 max-w-xl text-pretty text-base leading-7 text-white/50">{description}</p>
        <Link href="/app" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]"><ArrowLeft size={16} aria-hidden="true" />Return to Live Console</Link>
      </section>
    </div>
  );
}
