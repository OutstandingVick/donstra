import Link from "next/link";
import { ArrowDown, ArrowRight, Fingerprint, LockKeyhole, ScanSearch } from "lucide-react";

const proofStages = [
  {
    index: "01",
    label: "Testimony sealed",
    detail: "Evidence · belief · mandate",
    digest: "0x8dd6…31ae",
    icon: LockKeyhole,
  },
  {
    index: "02",
    label: "Exact action bound",
    detail: "Target · value · deadline",
    digest: "0x954b…dd2b",
    icon: Fingerprint,
  },
  {
    index: "03",
    label: "Proof survives",
    detail: "Challenge · judgment · settlement",
    digest: "VERIFIABLE",
    icon: ScanSearch,
  },
];

function ProofSequence() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:ms-auto" aria-label="Donstra binds an agent's testimony to its action before producing durable proof">
      <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_50%_45%,rgba(22,219,101,0.13),transparent_58%)]" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#091007] shadow-[0_32px_90px_rgba(0,0,0,0.32)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#D6E2D3]/60"><span className="size-1.5 rounded-full bg-[#16DB65]" />Decision record</div>
          <span className="font-mono text-xs text-[#D6E2D3]/55">PRE-ACTION</span>
        </div>
        <ol className="m-0 list-none p-0">
          {proofStages.map((stage, stageIndex) => {
            const Icon = stage.icon;
            return (
              <li key={stage.label} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 px-5 py-6 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-center sm:px-6">
                {stageIndex > 0 && <span className="absolute inset-x-5 top-0 h-px bg-white/10 sm:inset-x-6" aria-hidden="true" />}
                <span className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-[#EAF2E7]"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#16DB65]">{stage.index}</span>
                  <span className="mt-1 block text-base font-semibold text-[#F3F8F1]">{stage.label}</span>
                  <span className="mt-1 block text-sm leading-6 text-[#D6E2D3]/55">{stage.detail}</span>
                </span>
                <span className="col-start-2 font-mono text-xs text-[#D6E2D3]/55 sm:col-start-auto">{stage.digest}</span>
              </li>
            );
          })}
        </ol>
        <div className="flex items-center justify-between border-t border-[#16DB65]/20 bg-[#16DB65]/[0.06] px-5 py-4 sm:px-6">
          <span className="text-sm font-medium text-[#CFF8DC]">Committed before execution</span>
          <span className="font-mono text-xs text-[#16DB65]">SEALED</span>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="relative isolate min-h-[52rem] overflow-hidden border-b border-white/10 bg-[#0D160B] px-5 pb-20 pt-32 text-[#F3F8F1] sm:px-8 sm:pb-28 sm:pt-40 lg:px-12 lg:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_35%,rgba(22,219,101,0.07)_67%,rgba(92,26,27,0.16)_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-px bg-gradient-to-r from-transparent via-[#16DB65]/30 to-transparent" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:gap-16 xl:gap-24">
        <div>
          <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />Accountability infrastructure for autonomous agents</p>
          <h1 className="mb-0 mt-8 max-w-[12ch] text-balance text-[clamp(3.5rem,7.4vw,7.75rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[#F3F8F1]">Agents can rewrite the story. <span className="text-[#81ECAB]">Not the proof.</span></h1>
          <p className="mb-0 mt-8 max-w-[42rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">Donstra seals what an agent knew, believed, and intended before it acts—then binds that testimony to the exact action for challenge and independent judgment.</p>
          <p className="mb-0 mt-6 max-w-[40rem] border-s-2 border-[#16DB65]/60 ps-5 text-base leading-7 text-[#EAF2E7]/85">An agent can change its explanation. It cannot change what Donstra proves it committed before acting.</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/app" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#16DB65] px-5 text-sm font-semibold text-[#071006] transition-colors duration-150 hover:bg-[#43E47E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3F8F1]">Open Live Console <ArrowRight size={17} strokeWidth={2} aria-hidden="true" /></Link>
            <a href="#how-donstra-works" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/15 px-5 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">View how it works <ArrowDown size={17} strokeWidth={2} aria-hidden="true" /></a>
          </div>
        </div>
        <ProofSequence />
      </div>
    </section>
  );
}
