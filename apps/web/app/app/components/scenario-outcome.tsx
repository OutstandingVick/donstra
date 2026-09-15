import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Scale, ShieldCheck } from "lucide-react";
import { StatusBadge } from "./forensic-ui";
import type { Scenario } from "../data/scenarios";

export function ScenarioOutcome({ scenario, receiptId }: { scenario: Scenario; receiptId: string }) {
  const danger = scenario.outcome.verdict === "Negligent" || scenario.outcome.verdict === "Fabricated";
  return <section className="mt-12 overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby="outcome-title">
    <div className="h-px bg-gradient-to-r from-[#16DB65] via-[#16DB65]/35 to-[#5C1A1B]" />
    <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div><div className="flex flex-wrap items-center gap-3"><h2 id="outcome-title" className="m-0 text-2xl font-semibold tracking-[-0.025em] text-white">Adjudication result</h2><StatusBadge label={scenario.outcome.verdict} tone={danger ? "danger" : scenario.outcome.verdict === "Reasonable" ? "good" : "warning"} /></div><p className="mb-0 mt-3 max-w-3xl text-pretty text-base leading-7 text-white/65">{scenario.outcome.reason}</p>
        <dl className="mb-0 mt-6 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">{[["Authenticity", scenario.outcome.authenticity], ["Action binding", scenario.outcome.actionBinding], ["Future knowledge", scenario.outcome.futureKnowledge], ["Consensus", scenario.outcome.consensus], ["Reporter quorum", scenario.outcome.quorum], ["Bond outcome", scenario.outcome.bondOutcome]].map(([label, value]) => <div key={label} className="bg-[#0D160B] p-4"><dt className="flex items-center gap-2 text-xs text-white/50">{label === "Bond outcome" ? <Scale size={14} aria-hidden="true" /> : label === "Reporter quorum" ? <ShieldCheck size={14} aria-hidden="true" /> : <CheckCircle2 size={14} aria-hidden="true" />}{label}</dt><dd className="m-0 mt-2 text-sm leading-6 text-white/75">{value}</dd></div>)}</dl>
      </div>
      <aside className="rounded-lg border border-white/10 bg-white/[0.025] p-4"><p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#4BED86]">Demo receipt created</p><p className="mb-0 mt-3 break-all font-mono text-xs leading-5 text-white/60">{receiptId}</p><Link href={`/app/receipts/detail?id=${encodeURIComponent(receiptId)}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/15 text-sm font-semibold text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]">Inspect receipt<ArrowUpRight size={16} aria-hidden="true" /></Link></aside>
    </div>
  </section>;
}
