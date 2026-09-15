"use client";

import Link from "next/link";
import { Bot, FileCheck2 } from "lucide-react";
import { formatEther } from "viem";
import { DemoBanner, LoadNotice, PageHeader } from "../components/forensic-ui";
import { useProtocolAgents } from "../lib/protocol/hooks";

export default function AgentsPage() {
  const { data: agents, loading, error, config } = useProtocolAgents();
  return <div className="mx-auto w-full max-w-[100rem]">
    <PageHeader eyebrow="Accountability history" title="Agents" description="Observed commitments and outcomes are shown directly. Donstra does not compress them into an invented trust score." />
    <DemoBanner live={config.mode === "live"} />
    <LoadNotice loading={loading} error={error} empty={!agents.length} noun="agents" />
    {!loading && !error && agents.map((agent) => <section key={agent.id} className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby={`agent-${agent.id}`}>
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-[#4BED86]"><Bot size={19} aria-hidden="true" /></span><div><h2 id={`agent-${agent.id}`} className="m-0 text-base font-semibold text-white">{agent.label}</h2><p className="mb-0 mt-1 font-mono text-xs text-white/50">{agent.address ?? agent.id}</p></div></div><div className="text-sm text-white/60">Active bond exposure <strong className="ms-2 font-semibold text-white">{formatEther(BigInt(agent.activeBondWei))} ETH</strong></div></div>
      <dl className="m-0 grid gap-px border-b border-white/10 bg-white/10 sm:grid-cols-5">
        <Count label="Commitments" value={agent.commitments} />
        <Count label="Reasonable" value={agent.verdicts.reasonable} />
        <Count label="Negligent" value={agent.verdicts.negligent} danger />
        <Count label="Fabricated" value={agent.verdicts.fabricated} danger />
        <Count label="Inconclusive" value={agent.verdicts.inconclusive} />
      </dl>
      <div className="p-5 sm:p-6"><h3 className="m-0 text-sm font-semibold text-white">Recent receipts</h3><ul className="mb-0 mt-4 grid list-none gap-2 p-0">{agent.recentReceiptIds.map((id) => <li key={id}><Link href={`/app/receipts/detail?id=${encodeURIComponent(id)}`} className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-white/10 px-3 text-xs text-white/65 hover:bg-white/[0.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]"><span className="flex min-w-0 items-center gap-2"><FileCheck2 size={15} className="shrink-0 text-[#4BED86]" aria-hidden="true" /><span className="truncate font-mono">{id}</span></span><span className="shrink-0 font-semibold">Inspect</span></Link></li>)}</ul></div>
    </section>)}
  </div>;
}

function Count({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return <div className="bg-[#0D160B] p-4"><dt className="text-xs text-white/50">{label}</dt><dd className={`m-0 mt-2 text-2xl font-semibold tabular-nums ${danger && value ? "text-[#FFB7B7]" : "text-white"}`}>{value}</dd></div>;
}
