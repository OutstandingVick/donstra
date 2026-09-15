"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink, Link2 } from "lucide-react";
import { formatEther } from "viem";
import { CopyValue } from "../../components/copy-value";
import { DataField, DemoBanner, LoadNotice, PageHeader, StatusBadge } from "../../components/forensic-ui";
import { ReceiptActions } from "../../components/receipt-actions";
import { useProtocolReceipt } from "../../lib/protocol/hooks";

export default function ReceiptDetailPage() {
  return <Suspense fallback={<p role="status" className="text-sm text-white/60">Loading receipt…</p>}><ReceiptDetail /></Suspense>;
}

function ReceiptDetail() {
  const id = useSearchParams().get("id") ?? "";
  const { data: receipt, loading, error, config } = useProtocolReceipt(id);
  if (loading || error || !receipt) return <div className="mx-auto w-full max-w-[100rem]"><Link href="/app/receipts" className="inline-flex min-h-11 items-center gap-2 text-sm text-white/60"><ArrowLeft size={16} aria-hidden="true" />All receipts</Link><LoadNotice loading={loading} error={error ?? (!id ? "Select a receipt from the receipt index." : null)} empty={!loading && !error && !receipt} noun="receipt" /></div>;
  const tone = receipt.verdict === "reasonable" ? "good" : receipt.verdict === "negligent" || receipt.verdict === "fabricated" ? "danger" : "warning";

  return <article className="mx-auto w-full max-w-[100rem]">
    <Link href="/app/receipts" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]"><ArrowLeft size={16} aria-hidden="true" />All receipts</Link>
    <PageHeader eyebrow="Forensic record" title="Receipt detail" description="A permanent, machine-readable chain from prior testimony to economic outcome." action={<div className="grid justify-items-start gap-3 sm:justify-items-end"><StatusBadge label={receipt.verdict} tone={tone} /><ReceiptActions receipt={receipt} /></div>} />
    <DemoBanner live={config.mode === "live"} />

    <section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby="identity-heading">
      <div className="border-b border-white/10 p-5 sm:p-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Receipt ID</p><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 id="identity-heading" className="m-0 break-all font-mono text-sm font-medium text-white/90">{receipt.id}</h2><CopyValue value={receipt.id} label="Copy receipt ID" /></div></div>
      <dl className="m-0 grid gap-x-6 px-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
        <DataField label="Agent" value={receipt.agent} mono />
        <DataField label="Challenger" value={receipt.challenger} mono />
        <DataField label="Status" value={receipt.status} />
        <DataField label="Source" value={receipt.source === "live" ? "Live registry" : "Demo dataset"} />
        <DataField label="Committed" value={receipt.committedAt} mono />
        <DataField label="Executed" value={receipt.executedAt} mono />
        <DataField label="Challenged" value={receipt.challengedAt} mono />
        <DataField label="Resolved" value={receipt.resolvedAt} mono />
      </dl>
    </section>

    <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]">
        <div className="border-b border-white/10 px-5 py-4"><h2 className="m-0 text-base font-semibold text-white">Cryptographic bindings</h2></div>
        <dl className="m-0 divide-y divide-white/[0.07] px-5">
          {[["Testimony digest", receipt.testimonyDigest], ["Action digest", receipt.actionDigest], ["Evidence digest", receipt.evidenceDigest], ["Action transaction ID", receipt.actionTransactionId]].map(([label, value]) => <DataField key={label} label={label as string} mono><div className="flex items-start gap-2"><span className="min-w-0 flex-1 break-all">{value ?? "Not available"}</span>{value && <CopyValue value={value} label={`Copy ${label}`} />}</div></DataField>)}
        </dl>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]">
        <div className="border-b border-white/10 px-5 py-4"><h2 className="m-0 text-base font-semibold text-white">Bond settlement</h2></div>
        <dl className="m-0 grid gap-x-5 px-5 sm:grid-cols-2">
          <DataField label="Agent bond" value={`${formatEther(BigInt(receipt.agentBondWei))} ETH`} />
          <DataField label="Challenge bond" value={`${formatEther(BigInt(receipt.challengeBondWei))} ETH`} />
          <DataField label="Claimable" value={`${formatEther(BigInt(receipt.claimableWei))} ETH`} />
          <DataField label="Recipient" value={receipt.bondRecipient} mono />
          <DataField label="Reporter quorum" value={`${receipt.reporterQuorum.verified} verified · ${receipt.reporterQuorum.required} of ${receipt.reporterQuorum.total} required`} />
        </dl>
      </div>
    </section>

    <section className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby="transactions-heading">
      <div className="border-b border-white/10 px-5 py-4"><h2 id="transactions-heading" className="m-0 text-base font-semibold text-white">Protocol transactions</h2></div>
      <ul className="m-0 list-none divide-y divide-white/[0.07] p-0">{receipt.transactions.map((transaction) => <li key={transaction.label} className="grid gap-3 px-5 py-4 md:grid-cols-[0.7fr_0.7fr_1fr_1.4fr_auto] md:items-center"><span className="text-sm font-semibold text-white/80">{transaction.label}</span><span className="text-xs text-white/50">{transaction.network}</span><span className="font-mono text-xs text-white/50">{transaction.timestamp ?? "No chain timestamp"}</span><span className="break-all font-mono text-xs text-white/60">{transaction.hash ?? "Not available in demo mode"}</span>{transaction.explorerUrl ? <a href={transaction.explorerUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#80F4A9]">Open explorer<ExternalLink size={13} aria-hidden="true" /></a> : <span className="text-xs text-white/50">No explorer record</span>}</li>)}</ul>
    </section>

    <section className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby="reporters-heading"><div className="border-b border-white/10 px-5 py-4"><h2 id="reporters-heading" className="m-0 text-base font-semibold text-white">Reporter quorum</h2></div><ul className="m-0 list-none divide-y divide-white/[0.07] p-0">{receipt.reporters.length ? receipt.reporters.map((reporter, index) => <li key={index} className="flex min-h-14 items-center justify-between gap-4 px-5 py-3"><span className="break-all font-mono text-xs text-white/60">{reporter.address ?? `Reporter ${index + 1} address not configured`}</span><StatusBadge label={reporter.verified ? "Verified" : "Not verified"} tone={reporter.verified ? "good" : "neutral"} /></li>) : <li className="px-5 py-4 text-sm text-white/60">Reporter addresses are unavailable from the configured public data source.</li>}</ul></section>

    <section className="mt-6 rounded-xl border border-white/10 bg-[#0A1109] p-5 sm:p-6" aria-labelledby="adjudication-heading"><div className="flex items-start gap-3"><Link2 size={18} className="mt-0.5 shrink-0 text-[#4BED86]" aria-hidden="true" /><div><h2 id="adjudication-heading" className="m-0 text-base font-semibold text-white">Adjudication result</h2><p className="mb-0 mt-2 max-w-3xl text-pretty text-sm leading-6 text-white/65">{receipt.adjudicationReason}</p></div></div></section>
  </article>;
}
