import type { ReceiptRecord } from "../lib/protocol/types";

const digests = {
  testimony: "0x8dd663292b1e18a4a1dfe9b2d351ff445bf4fc0dd0e7662a5ac10c9b9fc931ae",
  action: "0x954bbf9e4e1739de92f0172f39658e9f91fbe042a57d1949cfa3fbe4219dd2b6",
  evidence: "0x3ac73119d203f8b51ad3be57ad34861a0c8b123fbc2d40c9fc85b103de86ac17",
} as const;

const bindings = {
  receipt: true,
  testimony: true,
  evidence: true,
  action: true,
  commitmentTime: true,
  futureKnowledge: "clear" as const,
};

function receipt(input: Partial<ReceiptRecord> & Pick<ReceiptRecord, "id" | "scenario" | "status" | "verdict" | "adjudicationReason">): ReceiptRecord {
  return {
    source: "demo",
    agent: null,
    challenger: null,
    testimonyDigest: digests.testimony,
    actionDigest: digests.action,
    evidenceDigest: digests.evidence,
    actionTransactionId: null,
    committedAt: "2026-09-15T13:42:21Z",
    executedAt: "2026-09-15T13:42:39Z",
    challengedAt: "2026-09-15T13:43:02Z",
    resolvedAt: null,
    agentBondWei: "10000000000000000",
    challengeBondWei: "5000000000000000",
    claimableWei: "0",
    bondRecipient: null,
    reporterQuorum: { required: 2, total: 3, verified: 0 },
    reporters: [
      { address: null, verified: false },
      { address: null, verified: false },
      { address: null, verified: false },
    ],
    transactions: [
      { label: "Commitment", network: "Sepolia", hash: null, timestamp: null, explorerUrl: null },
      { label: "Execution", network: "Sepolia", hash: null, timestamp: null, explorerUrl: null },
      { label: "Challenge", network: "Sepolia", hash: null, timestamp: null, explorerUrl: null },
      { label: "Adjudication", network: "GenLayer Studionet", hash: null, timestamp: null, explorerUrl: null },
      { label: "Settlement", network: "Sepolia", hash: null, timestamp: null, explorerUrl: null },
    ],
    binding: bindings,
    nextAction: null,
    nextActionReason: "No lifecycle action is available for this record.",
    metadata: {
      mandate: "Treasury Allocation Policy v3.2",
      maximumExposure: "15%",
      confidence: "71%",
    },
    ...input,
  };
}

export const demoReceipts: ReceiptRecord[] = [
  receipt({
    id: "demo-reasonable-001",
    scenario: "reasonable",
    status: "resolved",
    verdict: "reasonable",
    resolvedAt: "2026-09-15T13:44:07Z",
    claimableWei: "15000000000000000",
    reporterQuorum: { required: 2, total: 3, verified: 2 },
    reporters: [{ address: null, verified: true }, { address: null, verified: true }, { address: null, verified: false }],
    adjudicationReason: "The proposed 10% allocation remained within the signed 15% exposure limit.",
    nextAction: "withdraw",
    nextActionReason: "The agent can withdraw the returned agent and challenge bonds after connecting the owning wallet to a live deployment.",
    metadata: { mandate: "Treasury Allocation Policy v3.2", maximumExposure: "15%", proposedExposure: "10%", confidence: "68%" },
  }),
  receipt({
    id: "demo-negligent-001",
    scenario: "negligent",
    status: "executed",
    verdict: "pending",
    challengedAt: null,
    adjudicationReason: "No challenge has been opened. The 40% proposal exceeds the 15% mandate maximum.",
    nextAction: "challenge",
    nextActionReason: "This executed receipt is within its demo challenge window.",
    metadata: { mandate: "Treasury Allocation Policy v3.2", maximumExposure: "15%", proposedExposure: "40%", confidence: "71%" },
  }),
  receipt({
    id: "demo-negligent-002",
    scenario: "negligent",
    status: "challenged",
    verdict: "negligent",
    reporterQuorum: { required: 2, total: 3, verified: 1 },
    reporters: [{ address: null, verified: true }, { address: null, verified: false }, { address: null, verified: false }],
    adjudicationReason: "Validators found that the genuine testimony proposed 40% exposure under a 15% maximum-exposure mandate. Settlement is awaiting quorum.",
    nextAction: null,
    nextActionReason: "Reporter settlement requires 2 verified attestations; 1 is currently represented in demo state.",
    metadata: { mandate: "Treasury Allocation Policy v3.2", maximumExposure: "15%", proposedExposure: "40%", confidence: "71%" },
  }),
  receipt({
    id: "demo-fabricated-001",
    scenario: "fabricated",
    status: "challenged",
    verdict: "fabricated",
    reporterQuorum: { required: 2, total: 3, verified: 2 },
    reporters: [{ address: null, verified: true }, { address: null, verified: true }, { address: null, verified: false }],
    binding: { ...bindings, testimony: false },
    adjudicationReason: "The revealed testimony digest did not match the pre-execution commitment. No model judgment was required.",
    nextAction: "finalize",
    nextActionReason: "A live reporter operator can relay the deterministic fabricated verdict. Demo mode cannot submit it.",
    metadata: { authenticity: "Digest mismatch", detection: "Deterministic", modelInvoked: false },
  }),
  receipt({
    id: "demo-timeout-001",
    scenario: "timeout",
    status: "challenged",
    verdict: "inconclusive",
    adjudicationReason: "The adjudication deadline elapsed without settlement. Each party recovers its own bond.",
    nextAction: "expire",
    nextActionReason: "The represented adjudication window has elapsed. A live deployment would allow challenge expiry.",
    metadata: { challengeWindow: "24 hours", adjudicationWindow: "2 hours", recovery: "Each party recovers its own bond" },
  }),
];

export const demoReceiptIds = demoReceipts.map(({ id }) => id);

export function queueForReceipt(receipt: ReceiptRecord) {
  if (receipt.claimableWei !== "0") return "claimable" as const;
  if (receipt.nextAction === "challenge") return "challengeable" as const;
  if (receipt.nextAction === "expire") return "timed-out" as const;
  if (receipt.verdict !== "pending" && receipt.status === "challenged") return "awaiting-settlement" as const;
  return "active" as const;
}
