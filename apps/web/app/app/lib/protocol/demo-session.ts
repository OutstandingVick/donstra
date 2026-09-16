import { demoReceipts } from "../../data/receipts";
import type { ReceiptRecord } from "./types";

const storageKey = "donstra.demo.receipts.v1";

export function readDemoRuns(): ReceiptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as ReceiptRecord[];
    return Array.isArray(stored) ? stored.filter((receipt) => receipt.source === "demo") : [];
  } catch {
    return [];
  }
}

export function recordDemoRun(scenario: ReceiptRecord["scenario"]): ReceiptRecord {
  const template = demoReceipts.find((receipt) => receipt.scenario === scenario && receipt.verdict !== "pending") ?? demoReceipts[0];
  const now = new Date();
  const settled = scenario === "negligent" || scenario === "fabricated";
  const receipt: ReceiptRecord = {
    ...template,
    id: `demo-${scenario}-run-${now.getTime()}`,
    status: scenario === "timeout" ? "cancelled" : "resolved",
    committedAt: new Date(now.getTime() - 180_000).toISOString(),
    executedAt: new Date(now.getTime() - 150_000).toISOString(),
    challengedAt: new Date(now.getTime() - 120_000).toISOString(),
    resolvedAt: now.toISOString(),
    claimableWei: settled ? (BigInt(template.agentBondWei) + BigInt(template.challengeBondWei)).toString() : template.claimableWei,
    reporterQuorum: settled ? { required: 2, total: 3, verified: 2 } : template.reporterQuorum,
    reporters: settled ? template.reporters.map((reporter, index) => ({ ...reporter, verified: index < 2 })) : template.reporters,
    adjudicationReason: scenario === "negligent" ? "The genuine testimony proposed 40% exposure under a 15% maximum-exposure mandate. The represented 2-of-3 outcome awards both demo bonds to the challenger." : template.adjudicationReason,
    nextAction: null,
    nextActionReason: "Guided demo only; no onchain action or withdrawal was submitted.",
    metadata: { ...template.metadata, generatedBy: "Live Console guided demo", onchainSettlement: false },
  };
  const next = [receipt, ...readDemoRuns()].slice(0, 12);
  window.localStorage.setItem(storageKey, JSON.stringify(next));
  window.dispatchEvent(new Event("donstra:demo-receipts"));
  return receipt;
}
