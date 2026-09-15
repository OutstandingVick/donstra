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
  const receipt: ReceiptRecord = {
    ...template,
    id: `demo-${scenario}-run-${now.getTime()}`,
    committedAt: now.toISOString(),
    executedAt: now.toISOString(),
    challengedAt: now.toISOString(),
    resolvedAt: now.toISOString(),
    metadata: { ...template.metadata, generatedBy: "Live Console guided demo" },
  };
  const next = [receipt, ...readDemoRuns()].slice(0, 12);
  window.localStorage.setItem(storageKey, JSON.stringify(next));
  window.dispatchEvent(new Event("donstra:demo-receipts"));
  return receipt;
}
