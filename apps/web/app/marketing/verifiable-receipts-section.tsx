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

        <article className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#142012_0%,#0D160B_58%,#12160F_100%)] shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:mt-24" aria-label="Representative Donstra receipt">
          <header className="flex flex-wrap items-start justify-between gap-5 px-6 pt-7 sm:px-9 sm:pt-9">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#16DB65]/[0.08] text-[#16DB65]"><FileCheck2 size={20} strokeWidth={1.5} aria-hidden="true" /></span>
              <div><p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Representative receipt</p><h3 className="m-0 mt-2 text-xl font-semibold tracking-[-0.02em] text-[#F3F8F1] sm:text-2xl">Treasury allocation decision</h3></div>
            </div>
            <span className="rounded-md border border-[#5C1A1B]/45 bg-[#5C1A1B]/25 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#F0B9BA]">Negligent</span>
          </header>

          <div className="grid gap-9 px-6 pb-8 pt-10 sm:px-9 sm:pb-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)] lg:gap-12">
            <dl className="m-0 grid content-start gap-x-8 gap-y-7 sm:grid-cols-2 sm:gap-y-9">
              {recordFields.map(([term, value]) => (
                <div key={term} className={term === "Receipt ID" ? "min-w-0 sm:col-span-2" : "min-w-0"}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B7C5B3]/60">{term}</dt>
                  <dd className={`m-0 mt-2 break-words text-base leading-7 text-[#EAF2E7]/90 ${term === "Receipt ID" || term === "Testimony digest" || term === "Action digest" ? "font-mono text-sm" : ""}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-white/10 pt-8 lg:border-s lg:border-t-0 lg:pb-1 lg:pl-10 lg:pt-0">
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Verification trail</p>
              <dl className="m-0 mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {verificationTrail.map(([term, value]) => (
                  <div key={term} className={term === "Settlement result" ? "sm:col-span-2 lg:col-span-1 lg:mt-1" : ""}>
                    <dt className="text-sm font-medium text-[#D6E2D3]/65">{term}</dt>
                    <dd className={term === "Settlement result" ? "m-0 mt-1 text-lg font-semibold leading-7 text-[#F3F8F1]" : "m-0 mt-1 text-sm leading-6 text-[#F3F8F1]/85"}>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mb-0 mt-7 max-w-[27rem] text-xs leading-5 text-[#D6E2D3]/55">Demo values are labeled. Live receipts link each transaction and result to its configured explorer.</p>
            </div>
          </div>

          <footer className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 sm:px-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#D6E2D3]/65"><span className="flex items-center gap-2"><Download size={15} strokeWidth={1.5} aria-hidden="true" />Downloadable JSON</span><span className="flex items-center gap-2"><ExternalLink size={15} strokeWidth={1.5} aria-hidden="true" />Explorer verification</span><span className="flex items-center gap-2"><Braces size={15} strokeWidth={1.5} aria-hidden="true" />Machine-readable</span></div>
            <Link href="/app/receipts/detail?id=demo-negligent-002" className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md border border-[#16DB65]/35 bg-[#16DB65]/10 px-4 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:border-[#16DB65]/60 hover:bg-[#16DB65]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">Inspect demo receipt <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /></Link>
          </footer>
        </article>
      </div>
    </section>
  );
}
