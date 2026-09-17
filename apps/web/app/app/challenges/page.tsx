"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Gavel, LoaderCircle } from "lucide-react";
import { formatEther } from "viem";
import { DemoBanner, LoadNotice, PageHeader, StatusBadge } from "../components/forensic-ui";
import { queueForReceipt } from "../data/receipts";
import { openDemoChallenge } from "../lib/protocol/demo-session";
import { useProtocolAction, useProtocolReceipts } from "../lib/protocol/hooks";
import type { ChallengeQueue, LifecycleAction } from "../lib/protocol";

const queues: Array<{ key: ChallengeQueue; label: string }> = [
  { key: "challengeable", label: "Challengeable" }, { key: "active", label: "Active" },
  { key: "awaiting-settlement", label: "Awaiting settlement" }, { key: "timed-out", label: "Timed out" },
  { key: "claimable", label: "Claimable" },
];
const actionLabels: Record<LifecycleAction, string> = { commit: "Commit testimony", execute: "Execute action", challenge: "Open challenge", finalize: "Finalize", expire: "Expire challenge", withdraw: "Withdraw" };

export default function ChallengesPage() {
  const [queue, setQueue] = useState<ChallengeQueue>("challengeable");
  const [demoMessage, setDemoMessage] = useState("");
  const receiptState = useProtocolReceipts();
  const actionState = useProtocolAction(receiptState.refresh);
  const filtered = receiptState.data.filter((receipt) => queueForReceipt(receipt) === queue);

  return <div className="mx-auto w-full max-w-[100rem]">
    <PageHeader eyebrow="Lifecycle queue" title="Challenges" description="Each receipt exposes only the next registry transition permitted by its current state and deadline." />
    <DemoBanner live={receiptState.config.mode === "live"} />
    <div className="mt-7 overflow-x-auto border-b border-white/10" role="tablist" aria-label="Challenge queue">
      <div className="flex min-w-max gap-1">{queues.map((item) => <button key={item.key} type="button" role="tab" aria-selected={queue === item.key} onClick={() => setQueue(item.key)} className={`relative min-h-11 px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4BED86] ${queue === item.key ? "text-white" : "text-white/50 hover:text-white"}`}>{item.label}<span className="ms-2 text-xs text-white/40">{receiptState.data.filter((receipt) => queueForReceipt(receipt) === item.key).length}</span>{queue === item.key && <span className="absolute inset-x-3 bottom-0 h-px bg-[#16DB65]" aria-hidden="true" />}</button>)}</div>
    </div>
    <LoadNotice loading={receiptState.loading} error={receiptState.error} empty={!filtered.length} noun={`${queue.replace("-", " ")} receipts`} />
    {!receiptState.loading && !receiptState.error && filtered.length > 0 && <ul className="m-0 mt-6 grid list-none gap-3 p-0">{filtered.map((receipt) => {
      const validAction = receipt.nextAction;
      const demoChallenge = receiptState.config.mode === "demo" && receipt.source === "demo" && validAction === "challenge";
      const actionsDisabled = (!demoChallenge && (receiptState.config.mode !== "live" || receipt.source !== "live")) || !validAction || actionState.phase === "pending" || actionState.phase === "confirm";
      const handleAction = () => {
        if (!validAction) return;
        if (demoChallenge) {
          try {
            openDemoChallenge(receipt);
            setDemoMessage("Demo challenge opened locally. No wallet transaction, bond transfer, or GenLayer adjudication occurred.");
            void receiptState.refresh();
          } catch (error) {
            setDemoMessage(error instanceof Error ? error.message : "Unable to open the demo challenge.");
          }
        } else {
          void actionState.run(validAction, receipt);
        }
      };
      return <li key={receipt.id} className="rounded-xl border border-white/10 bg-[#0A1109] p-5 sm:p-6"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Gavel size={17} className="text-[#4BED86]" aria-hidden="true" /><Link href={`/app/receipts/detail?id=${encodeURIComponent(receipt.id)}`} className="break-all font-mono text-xs font-semibold text-white/85 hover:text-white">{receipt.id}</Link><StatusBadge label={queue.replace("-", " ")} tone={queue === "timed-out" ? "danger" : queue === "claimable" ? "good" : "warning"} /></div><p className="mb-0 mt-3 max-w-3xl text-sm leading-6 text-white/60">{receipt.adjudicationReason}</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50"><span>Agent bond <strong className="font-medium text-white/75">{formatEther(BigInt(receipt.agentBondWei))} ETH</strong></span><span>Challenge bond <strong className="font-medium text-white/75">{formatEther(BigInt(receipt.challengeBondWei))} ETH</strong></span></div></div><div className="lg:text-end"><button type="button" disabled={actionsDisabled} onClick={handleAction} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#16DB65] px-4 text-sm font-semibold text-[#071006] disabled:cursor-not-allowed disabled:bg-white/[0.055] disabled:text-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{actionState.phase === "pending" ? <LoaderCircle size={16} aria-hidden="true" /> : null}{demoChallenge ? "Open demo challenge" : validAction ? actionLabels[validAction] : "No action available"}</button><p className="mb-0 mt-2 text-xs leading-5 text-white/50">{demoChallenge ? "Local walkthrough only; no onchain transaction or bond transfer." : receipt.source === "demo" ? "Live actions require a verified deployment and a live receipt." : receipt.nextActionReason}</p><Link href={`/app/receipts/detail?id=${encodeURIComponent(receipt.id)}`} className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-white/60">Inspect receipt<ArrowUpRight size={14} aria-hidden="true" /></Link></div></div></li>;
    })}</ul>}
    {actionState.message && <div role={actionState.phase === "failure" ? "alert" : "status"} className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${actionState.phase === "failure" ? "border-[#A94C4E]/35 bg-[#5C1A1B]/20 text-[#FFB7B7]" : "border-[#16DB65]/25 bg-[#16DB65]/10 text-[#B9F8CF]"}`}>{actionState.message}{actionState.transactionHash && <span className="mt-2 block break-all font-mono text-xs">{actionState.transactionHash}</span>}</div>}
    {demoMessage && <div role="status" className="mt-5 rounded-lg border border-[#16DB65]/25 bg-[#16DB65]/10 p-4 text-sm leading-6 text-[#B9F8CF]">{demoMessage}</div>}
  </div>;
}
