export type ScenarioKey = "reasonable" | "negligent" | "fabricated" | "timeout";

export type TimelineStage = {
  label: string;
  state: "verified" | "complete" | "active" | "pending";
  timestamp: string;
  network: string;
  transactionHash: string | null;
  duration: string;
  explorerUrl: string | null;
};

export type InspectorPane = {
  summary: string;
  fields: Array<{ label: string; value: string; emphasis?: "danger" | "verified" }>;
  raw: string;
};

export type Scenario = {
  key: ScenarioKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  confidence: number;
  mandateExposure: number;
  proposedExposure: number;
  result: string;
  withoutDonstra: Array<{ title: string; detail: string; state: "complete" | "unverifiable" }>;
  withDonstra: Array<{ title: string; detail: string; proof?: string | null }>;
  timeline: TimelineStage[];
  inspector: Record<"Evidence" | "Belief" | "Mandate" | "Proposed Action" | "Executed Action", InspectorPane>;
  outcome: {
    verdict: "Reasonable" | "Negligent" | "Fabricated" | "Inconclusive";
    reason: string;
    authenticity: string;
    actionBinding: string;
    futureKnowledge: string;
    consensus: string;
    quorum: string;
    bondOutcome: string;
    receiptId: string;
  };
};

const hashes = {
  evidence: "0x3ac73119d203f8b51ad3be57ad34861a0c8b123fbc2d40c9fc85b103de86ac17",
  action: "0x954bbf9e4e1739de92f0172f39658e9f91fbe042a57d1949cfa3fbe4219dd2b6",
  receipt: "0x8dd663292b1e18a4a1dfe9b2d351ff445bf4fc0dd0e7662a5ac10c9b9fc931ae",
};

const negligent: Scenario = {
  key: "negligent",
  label: "Negligent",
  eyebrow: "Mandate breach",
  title: "Treasury exposure exceeds the agent mandate",
  description: "The agent was confident in its market view, but proposed allocating 40% of treasury funds where its signed mandate allowed no more than 15%.",
  confidence: 71,
  mandateExposure: 15,
  proposedExposure: 40,
  result: "Maximum exposure exceeded by 25 percentage points",
  withoutDonstra: [
    { title: "Evidence received", detail: "Market brief and treasury position entered the agent context.", state: "complete" },
    { title: "Model reasoning", detail: "The model produced a confident allocation recommendation.", state: "complete" },
    { title: "Action executed", detail: "40% treasury exposure was submitted.", state: "complete" },
    { title: "Original reasoning cannot be proven", detail: "After execution, no durable record proves what evidence or mandate the agent used.", state: "unverifiable" },
  ],
  withDonstra: [
    { title: "Testimony sealed", detail: "Evidence, belief, confidence, mandate, and action were sealed before execution.", proof: hashes.receipt },
    { title: "Evidence digest", detail: "The observed market brief is content-addressed and time-bound.", proof: hashes.evidence },
    { title: "Action digest", detail: "The target, calldata, value, chain, and deadline are bound.", proof: hashes.action },
    { title: "Commitment", detail: "The testimony digest and agent bond are ready for Sepolia commitment.", proof: null },
    { title: "Exact execution", detail: "The registry will execute only the exact action in the commitment.", proof: null },
    { title: "Challenge", detail: "A challenger can post collateral during the challenge window.", proof: null },
    { title: "Adjudication", detail: "The demo verdict identifies the mandate violation; no live GenLayer transaction exists yet.", proof: null },
    { title: "Settlement", detail: "The represented 2-of-3 outcome awards both bonds to the challenger.", proof: null },
  ],
  timeline: [
    { label: "Testimony", state: "verified", timestamp: "2026-09-15T13:42:08Z", network: "Local seal", transactionHash: null, duration: "184 ms", explorerUrl: null },
    { label: "Committed", state: "complete", timestamp: "2026-09-15T13:42:21Z", network: "Sepolia", transactionHash: null, duration: "13.2 s", explorerUrl: null },
    { label: "Executed", state: "complete", timestamp: "2026-09-15T13:42:39Z", network: "Sepolia", transactionHash: null, duration: "18.0 s", explorerUrl: null },
    { label: "Challenged", state: "complete", timestamp: "2026-09-15T13:43:02Z", network: "Sepolia", transactionHash: null, duration: "23.1 s", explorerUrl: null },
    { label: "Adjudicated", state: "complete", timestamp: "2026-09-15T13:43:51Z", network: "Studionet", transactionHash: null, duration: "49.3 s", explorerUrl: null },
    { label: "Settled", state: "complete", timestamp: "2026-09-15T13:44:07Z", network: "Sepolia", transactionHash: null, duration: "16.1 s", explorerUrl: null },
  ],
  inspector: {
    Evidence: {
      summary: "Two sources were observed before commitment and preserved by digest.",
      fields: [
        { label: "Treasury balance", value: "$2,400,000 USDC" },
        { label: "Market signal", value: "ETH momentum positive over 24 hours" },
        { label: "Observed at", value: "2026-09-15 13:41:44 UTC" },
        { label: "Content digest", value: hashes.evidence, emphasis: "verified" },
      ],
      raw: JSON.stringify({ uri: "ipfs://bafybeig…/market-brief.json", observedAt: 1789489304, contentDigest: hashes.evidence, mediaType: "application/json" }, null, 2),
    },
    Belief: {
      summary: "The agent expected upside, but its confidence did not override the mandate.",
      fields: [
        { label: "Claim", value: "ETH momentum supports increasing treasury exposure for the next 24 hours." },
        { label: "Confidence", value: "71%" },
        { label: "Time horizon", value: "24 hours" },
      ],
      raw: JSON.stringify({ belief: "ETH momentum supports increasing treasury exposure for the next 24 hours.", confidenceBps: 7100 }, null, 2),
    },
    Mandate: {
      summary: "The versioned mandate caps exposure at 15%. The proposed action is non-compliant.",
      fields: [
        { label: "Mandate", value: "Treasury Allocation Policy" },
        { label: "Version", value: "v3.2" },
        { label: "Maximum exposure", value: "15%", emphasis: "verified" },
        { label: "Proposed exposure", value: "40%", emphasis: "danger" },
        { label: "Difference", value: "+25 percentage points", emphasis: "danger" },
      ],
      raw: JSON.stringify({ id: "treasury-allocation", version: "3.2", constraints: { maximumExposureBps: 1500, permittedAssets: ["ETH", "USDC"] } }, null, 2),
    },
    "Proposed Action": {
      summary: "Allocate 960,000 USDC—40% of treasury value—to ETH exposure.",
      fields: [
        { label: "Action", value: "Swap USDC for ETH" },
        { label: "Input", value: "960,000 USDC" },
        { label: "Treasury exposure", value: "40%", emphasis: "danger" },
        { label: "Target", value: "Not available in demo mode" },
        { label: "Action digest", value: hashes.action, emphasis: "verified" },
      ],
      raw: JSON.stringify({ kind: "swap", chainId: 11155111, target: null, value: "0", parameters: { assetIn: "USDC", assetOut: "ETH", amount: "960000000000" }, calldataDigest: hashes.action, mode: "demo" }, null, 2),
    },
    "Executed Action": {
      summary: "The registry executed the same target, value, and calldata that the agent committed.",
      fields: [
        { label: "Binding", value: "Exact match", emphasis: "verified" },
        { label: "Executed amount", value: "960,000 USDC" },
        { label: "Executed exposure", value: "40%", emphasis: "danger" },
        { label: "Transaction", value: "Not available in demo mode" },
      ],
      raw: JSON.stringify({ actionMatched: true, executedAt: 1789489359, transactionHash: null, mode: "demo" }, null, 2),
    },
  },
  outcome: {
    verdict: "Negligent",
    reason: "The genuine testimony proposed 40% exposure under a mandate capped at 15%.",
    authenticity: "Testimony digest matched",
    actionBinding: "Exact action matched",
    futureKnowledge: "No future knowledge detected",
    consensus: "Demo adjudication complete",
    quorum: "2 of 3 represented",
    bondOutcome: "Agent and challenge bonds awarded to challenger",
    receiptId: "demo-negligent-002",
  },
};

function scenarioVariant(key: ScenarioKey, label: string, result: string, proposedExposure: number): Scenario {
  const variant: Scenario = {
    ...negligent,
    key,
    label,
    eyebrow: key === "reasonable" ? "Mandate compliant" : key === "fabricated" ? "Digest mismatch" : "Adjudication expired",
    title: key === "reasonable" ? "Treasury allocation remains within mandate" : key === "fabricated" ? "Revealed testimony differs from the commitment" : "Challenge reached its adjudication deadline",
    description: key === "reasonable" ? "The proposed allocation remains within the signed treasury mandate." : key === "fabricated" ? "The disclosed testimony bytes do not produce the digest committed before execution." : "No settlement arrived before the deadline, so each party can recover its own bond.",
    proposedExposure,
    result,
  };
  if (key === "reasonable") {
    variant.outcome = { verdict: "Reasonable", reason: "The proposed 10% allocation remained within the signed 15% limit.", authenticity: "Testimony digest matched", actionBinding: "Exact action matched", futureKnowledge: "No future knowledge detected", consensus: "Demo adjudication complete", quorum: "2 of 3 represented", bondOutcome: "Agent recovers agent and challenge bonds", receiptId: "demo-reasonable-001" };
    variant.withDonstra = variant.withDonstra.map((step) => step.title === "Adjudication" ? { ...step, detail: "The represented validator outcome finds the action mandate-compliant." } : step.title === "Settlement" ? { ...step, detail: "The represented settlement returns both bonds to the agent." } : step);
  } else if (key === "fabricated") {
    variant.outcome = { verdict: "Fabricated", reason: "The revealed testimony bytes do not reproduce the committed digest.", authenticity: "Digest mismatch detected", actionBinding: "Exact action matched", futureKnowledge: "Not evaluated", consensus: "Deterministic result", quorum: "2 of 3 represented", bondOutcome: "Agent and challenge bonds awarded to challenger", receiptId: "demo-fabricated-001" };
    variant.withDonstra = variant.withDonstra.map((step) => step.title === "Adjudication" ? { ...step, detail: "Digest mismatch proves fabrication before any model judgment." } : step);
  } else if (key === "timeout") {
    variant.outcome = { verdict: "Inconclusive", reason: "No settlement arrived before the adjudication deadline.", authenticity: "Testimony digest matched", actionBinding: "Exact action matched", futureKnowledge: "Not evaluated", consensus: "Deadline elapsed", quorum: "No quorum reached", bondOutcome: "Each party recovers its own bond", receiptId: "demo-timeout-001" };
    variant.withDonstra = variant.withDonstra.map((step) => step.title === "Adjudication" ? { ...step, detail: "No final adjudication arrived before the deadline." } : step.title === "Settlement" ? { ...step, detail: "The timeout path returns each party’s own bond." } : step);
  }
  return variant;
}

export const scenarios: Record<ScenarioKey, Scenario> = {
  reasonable: scenarioVariant("reasonable", "Reasonable", "Exposure remains within the signed mandate", 10),
  negligent,
  fabricated: scenarioVariant("fabricated", "Fabricated", "Testimony digest mismatch detected deterministically", 40),
  timeout: scenarioVariant("timeout", "Timeout", "Adjudication window expired without settlement", 40),
};

export const scenarioOrder: ScenarioKey[] = ["reasonable", "negligent", "fabricated", "timeout"];
