import { deploymentRecords } from "../../data/deployments";
import { demoReceipts } from "../../data/receipts";
import { protocolConfig } from "./config";
import { readDemoRuns } from "./demo-session";
import type { AgentRecord, LifecycleAction, ProtocolAdapter, ReceiptRecord } from "./types";

function demoAgents(): AgentRecord[] {
  const receipts = demoReceipts;
  const verdicts = { reasonable: 0, negligent: 0, fabricated: 0, inconclusive: 0 };
  for (const receipt of receipts) {
    if (receipt.verdict !== "pending") verdicts[receipt.verdict] += 1;
  }
  return [{
    id: "demo-agent-treasury-01",
    address: null,
    label: "Treasury allocation agent",
    commitments: receipts.length,
    verdicts,
    activeBondWei: receipts.filter(({ status }) => status !== "resolved" && status !== "cancelled").reduce((sum, item) => sum + BigInt(item.agentBondWei), 0n).toString(),
    recentReceiptIds: receipts.slice(0, 4).map(({ id }) => id),
  }];
}

export class DemoProtocolAdapter implements ProtocolAdapter {
  readonly mode = "demo" as const;

  getConfig() {
    return { ...protocolConfig, mode: "demo" as const, walletAvailable: typeof window !== "undefined" && Boolean(window.ethereum) };
  }

  async listReceipts() {
    return [...readDemoRuns(), ...demoReceipts];
  }

  async getReceipt(id: string) {
    return [...readDemoRuns(), ...demoReceipts].find((receipt) => receipt.id === id) ?? null;
  }

  async listAgents() {
    return demoAgents();
  }

  async listDeployments() {
    return deploymentRecords;
  }

  async runLifecycleAction(_action: LifecycleAction, _receipt: ReceiptRecord): Promise<never> {
    throw new Error("Blockchain actions are unavailable in demo mode. Configure the verified public deployment values first.");
  }
}
