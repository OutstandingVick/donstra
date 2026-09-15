"use client";

import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { formatEther } from "viem";
import { DemoBanner, LoadNotice, PageHeader, StatusBadge } from "../components/forensic-ui";
import { useProtocolReceipts } from "../lib/protocol/hooks";
import type { ReceiptRecord } from "../lib/protocol";

function verdictTone(verdict: ReceiptRecord["verdict"]) {
  if (verdict === "reasonable") return "good" as const;
  if (verdict === "negligent" || verdict === "fabricated") return "danger" as const;
  if (verdict === "pending") return "warning" as const;
  return "neutral" as const;
}

export default function ReceiptsPage() {
  const { data: receipts, loading, error, config } = useProtocolReceipts();
  return <div className="mx-auto w-full max-w-[100rem]">
    <PageHeader eyebrow="Permanent records" title="Receipts" description="Inspect the public verification chain for each committed agent decision. A wallet is not required." />
    <DemoBanner live={config.mode === "live"} />
    <LoadNotice loading={loading} error={error} empty={!receipts.length} noun="receipts" />
    {!loading && !error && receipts.length > 0 && <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]">
      <div className="hidden grid-cols-[minmax(13rem,1.2fr)_0.8fr_0.8fr_0.8fr_2rem] gap-4 border-b border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white/50 lg:grid">
        <span>Receipt</span><span>Verdict</span><span>Committed</span><span>Bond</span><span />
      </div>
      <ul className="m-0 list-none p-0">
        {receipts.map((receipt) => <li key={receipt.id} className="border-b border-white/[0.07] last:border-b-0">
          <Link href={`/app/receipts/${encodeURIComponent(receipt.id)}`} className="grid min-h-20 items-center gap-3 px-5 py-4 hover:bg-white/[0.025] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4BED86] lg:grid-cols-[minmax(13rem,1.2fr)_0.8fr_0.8fr_0.8fr_2rem] lg:gap-4">
            <div className="min-w-0"><div className="flex items-center gap-2 text-sm font-semibold text-white/90"><FileCheck2 size={16} className="shrink-0 text-[#4BED86]" aria-hidden="true" /><span className="truncate font-mono text-xs" title={receipt.id}>{receipt.id}</span></div><p className="mb-0 mt-1 text-xs capitalize text-white/50">{receipt.source} record · {receipt.status}</p></div>
            <div><StatusBadge label={receipt.verdict} tone={verdictTone(receipt.verdict)} /></div>
            <span className="font-mono text-xs text-white/60">{new Date(receipt.committedAt).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })} UTC</span>
            <span className="text-sm text-white/70">{formatEther(BigInt(receipt.agentBondWei))} ETH</span>
            <ArrowUpRight size={17} className="hidden text-white/40 lg:block" aria-hidden="true" />
          </Link>
        </li>)}
      </ul>
    </div>}
  </div>;
}
