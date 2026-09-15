"use client";

import { ExternalLink, Network, ShieldCheck } from "lucide-react";
import { CopyValue } from "../components/copy-value";
import { DataField, DemoBanner, LoadNotice, PageHeader, StatusBadge } from "../components/forensic-ui";
import { useProtocolDeployments } from "../lib/protocol/hooks";

export default function DeploymentsPage() {
  const { data: deployments, loading, error, config } = useProtocolDeployments();
  return <div className="mx-auto w-full max-w-[100rem]">
    <PageHeader eyebrow="Release identity" title="Deployments" description="Verify contract identity, source provenance, settlement policy, and network state without exposing operator secrets." />
    <DemoBanner live={config.mode === "live"} />
    <LoadNotice loading={loading} error={error} empty={!deployments.length} noun="deployment records" />
    {!loading && !error && <div className="mt-8 grid gap-5 xl:grid-cols-2">{deployments.map((deployment) => <section key={deployment.key} className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby={`deployment-${deployment.key}`}>
      <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.035] text-[#4BED86]">{deployment.status === "verified" ? <ShieldCheck size={19} aria-hidden="true" /> : <Network size={19} aria-hidden="true" />}</span><div><p className="m-0 text-xs text-white/50">{deployment.network}</p><h2 id={`deployment-${deployment.key}`} className="mb-0 mt-1 text-base font-semibold text-white">{deployment.contractName}</h2></div></div><StatusBadge label={deployment.status} tone={deployment.status === "verified" ? "good" : deployment.status === "legacy" ? "warning" : "neutral"} /></div>
      <dl className="m-0 divide-y divide-white/[0.07] px-5">
        <DataField label="Contract address" mono><div className="flex items-start gap-2"><span className="min-w-0 flex-1 break-all">{deployment.address ?? "Not deployed"}</span>{deployment.address && <CopyValue value={deployment.address} label="Copy contract address" />}</div></DataField>
        <DataField label="Deployment transaction" mono><div className="flex items-start gap-2"><span className="min-w-0 flex-1 break-all">{deployment.deploymentTransaction ?? "Not deployed"}</span>{deployment.deploymentTransaction && <CopyValue value={deployment.deploymentTransaction} label="Copy deployment transaction" />}</div></DataField>
        <DataField label="Source commit" value={deployment.sourceCommit} mono />
        <DataField label="Source fingerprint" value={deployment.sourceFingerprint ?? "Not recorded"} mono />
      </dl>
      <div className="border-t border-white/10 p-5"><h3 className="m-0 text-sm font-semibold text-white">Policy</h3><dl className="mb-0 mt-3 grid gap-3">{deployment.policy.map((item) => <div key={item.label} className="flex flex-col justify-between gap-1 text-sm sm:flex-row"><dt className="text-white/50">{item.label}</dt><dd className="m-0 text-white/75 sm:text-end">{item.value}</dd></div>)}</dl>{deployment.explorerUrl && <a href={deployment.explorerUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#80F4A9]">Open explorer record<ExternalLink size={15} aria-hidden="true" /></a>}</div>
    </section>)}</div>}
  </div>;
}
