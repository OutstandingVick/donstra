export type ScenarioKey = "reasonable" | "negligent" | "fabricated" | "timeout";

export type TimelineStage = {
  label: string;
  state: "verified" | "complete" | "active" | "pending";
  timestamp: string;
  network: string;
  transactionHash: string;
  duration: string;
  explorerUrl: string;
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
  withDonstra: Array<{ title: string; detail: string; proof?: string }>;
  timeline: TimelineStage[];
  inspector: Record<"Evidence" | "Belief" | "Mandate" | "Proposed Action" | "Executed Action", InspectorPane>;
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
    { title: "Commitment", detail: "The testimony digest and agent bond were committed on Sepolia.", proof: "0xd19f…914c" },
    { title: "Exact execution", detail: "The registry executed the exact action in the commitment.", proof: "0x78d2…a611" },
    { title: "Challenge", detail: "A challenger posted collateral during the challenge window.", proof: "0x15ab…09dd" },
    { title: "Adjudication", detail: "GenLayer validators identified the mandate violation.", proof: "GL-0x12fc…48a0" },
    { title: "Settlement", detail: "A 2-of-3 reporter quorum awarded both bonds to the challenger.", proof: "0x44e0…c29b" },
  ],
  timeline: [
    { label: "Testimony", state: "verified", timestamp: "2026-09-15T13:42:08Z", network: "Local seal", transactionHash: hashes.receipt, duration: "184 ms", explorerUrl: "#" },
    { label: "Committed", state: "complete", timestamp: "2026-09-15T13:42:21Z", network: "Sepolia", transactionHash: "0xd19f5b7a…914c", duration: "13.2 s", explorerUrl: "#" },
    { label: "Executed", state: "complete", timestamp: "2026-09-15T13:42:39Z", network: "Sepolia", transactionHash: "0x78d293c4…a611", duration: "18.0 s", explorerUrl: "#" },
    { label: "Challenged", state: "complete", timestamp: "2026-09-15T13:43:02Z", network: "Sepolia", transactionHash: "0x15ab2f09…09dd", duration: "23.1 s", explorerUrl: "#" },
    { label: "Adjudicated", state: "complete", timestamp: "2026-09-15T13:43:51Z", network: "Studionet", transactionHash: "GL-0x12fc…48a0", duration: "49.3 s", explorerUrl: "#" },
    { label: "Settled", state: "complete", timestamp: "2026-09-15T13:44:07Z", network: "Sepolia", transactionHash: "0x44e06b81…c29b", duration: "16.1 s", explorerUrl: "#" },
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
        { label: "Target", value: "0x111111125421cA6dc452d289314280a0f8842A65" },
        { label: "Action digest", value: hashes.action, emphasis: "verified" },
      ],
      raw: JSON.stringify({ kind: "swap", chainId: 11155111, target: "0x111111125421cA6dc452d289314280a0f8842A65", value: "0", parameters: { assetIn: "USDC", assetOut: "ETH", amount: "960000000000" }, calldataDigest: hashes.action }, null, 2),
    },
    "Executed Action": {
      summary: "The registry executed the same target, value, and calldata that the agent committed.",
      fields: [
        { label: "Binding", value: "Exact match", emphasis: "verified" },
        { label: "Executed amount", value: "960,000 USDC" },
        { label: "Executed exposure", value: "40%", emphasis: "danger" },
        { label: "Transaction", value: "0x78d293c49ffab88fd154a391e980846a1af7e6022f853825b736965826a6a611" },
      ],
      raw: JSON.stringify({ actionMatched: true, executedAt: 1789489359, transactionHash: "0x78d293c49ffab88fd154a391e980846a1af7e6022f853825b736965826a6a611" }, null, 2),
    },
  },
};

function scenarioVariant(key: ScenarioKey, label: string, result: string, proposedExposure: number): Scenario {
  return {
    ...negligent,
    key,
    label,
    eyebrow: key === "reasonable" ? "Mandate compliant" : key === "fabricated" ? "Digest mismatch" : "Adjudication expired",
    title: key === "reasonable" ? "Treasury allocation remains within mandate" : key === "fabricated" ? "Revealed testimony differs from the commitment" : "Challenge reached its adjudication deadline",
    description: key === "reasonable" ? "The proposed allocation remains within the signed treasury mandate." : key === "fabricated" ? "The disclosed testimony bytes do not produce the digest committed before execution." : "No settlement arrived before the deadline, so each party can recover its own bond.",
    proposedExposure,
    result,
  };
}

export const scenarios: Record<ScenarioKey, Scenario> = {
  reasonable: scenarioVariant("reasonable", "Reasonable", "Exposure remains within the signed mandate", 10),
  negligent,
  fabricated: scenarioVariant("fabricated", "Fabricated", "Testimony digest mismatch detected deterministically", 40),
  timeout: scenarioVariant("timeout", "Timeout", "Adjudication window expired without settlement", 40),
};

export const scenarioOrder: ScenarioKey[] = ["reasonable", "negligent", "fabricated", "timeout"];
