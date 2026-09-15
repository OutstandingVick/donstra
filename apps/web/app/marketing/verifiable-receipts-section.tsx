import Link from "next/link";
import { ArrowUpRight, Braces, Download, ExternalLink, FileCheck2 } from "lucide-react";

const recordFields = [
  ["Receipt ID", "demo-negligent-002"],
  ["Testimony digest", "0x8dd66329…31ae"],
  ["Action digest", "0x954bbf9e…dd2b"],
  ["Evidence digests", "2 referenced records"],
  ["Timestamps", "Committed → settled"],
] as const;

const verificationTrail = [
  ["Transactions", "Commit · execute · challenge · settle"],
  ["GenLayer result", "Negligent — demo verdict"],
  ["Reporter quorum", "2 of 3 represented"],
  ["Settlement result", "Bonds awarded to challenger"],
] as const;

export function VerifiableReceiptsSection() {
  return (
    <section id="verifiable-receipts" aria-labelledby="verifiable-receipts-title" className="scroll-mt-20 border-y border-white/10 bg-[#080D07] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:items-end lg:gap-20">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />Verifiable receipts</p>
            <h2 id="verifiable-receipts-title" className="mb-0 mt-7 max-w-[13ch] text-balance text-[clamp(3rem,6vw,6.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]">Every run leaves a permanent proof layer.</h2>
          </div>
          <p className="mb-0 max-w-[36rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">A Donstra receipt is a structured forensic record: readable by people, portable as JSON, and independently verifiable against public networks.</p>
        </div>

        <article className="mt-16 overflow-hidden rounded-xl border border-white/15 bg-[#0D160B] shadow-[0_32px_90px_rgba(0,0,0,0.25)] sm:mt-24" aria-label="Representative Donstra receipt">
          <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg border border-[#16DB65]/25 bg-[#16DB65]/[0.06] text-[#16DB65]"><FileCheck2 size={18} strokeWidth={1.5} aria-hidden="true" /></span>
              <div><p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Representative receipt</p><h3 className="m-0 mt-1 text-base font-semibold text-[#F3F8F1]">Treasury allocation decision</h3></div>
            </div>
            <span className="rounded-md border border-[#5C1A1B]/50 bg-[#5C1A1B]/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#F0B9BA]">Negligent</span>
          </header>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)]">
            <dl className="m-0 divide-y divide-white/10 px-5 sm:px-7 lg:border-e lg:border-white/10">
              {recordFields.map(([term, value]) => (
                <div key={term} className="grid gap-2 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B7C5B3]/65">{term}</dt>
                  <dd className="m-0 break-words font-mono text-sm leading-6 text-[#EAF2E7]/80">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-white/10 p-5 sm:p-7 lg:border-t-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Verification trail</p>
              <dl className="m-0 mt-4 divide-y divide-white/10 border-y border-white/10">
                {verificationTrail.map(([term, value]) => <div key={term} className="py-4"><dt className="text-sm font-semibold text-[#F3F8F1]">{term}</dt><dd className="m-0 mt-1 text-sm leading-6 text-[#D6E2D3]/65">{value}</dd></div>)}
              </dl>
              <p className="mb-0 mt-5 text-xs leading-5 text-[#D6E2D3]/55">Demo values are labeled. Live receipts link each transaction and result to its configured explorer.</p>
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 bg-[#091007] px-5 py-5 sm:px-7">
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#D6E2D3]/65"><span className="flex items-center gap-2"><Download size={15} strokeWidth={1.5} aria-hidden="true" />Downloadable JSON</span><span className="flex items-center gap-2"><ExternalLink size={15} strokeWidth={1.5} aria-hidden="true" />Explorer verification</span><span className="flex items-center gap-2"><Braces size={15} strokeWidth={1.5} aria-hidden="true" />Machine-readable</span></div>
            <Link href="/app/receipts/detail?id=demo-negligent-002" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#16DB65]/35 bg-[#16DB65]/10 px-4 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:border-[#16DB65]/60 hover:bg-[#16DB65]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">Inspect demo receipt <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /></Link>
          </footer>
        </article>
      </div>
    </section>
  );
}
