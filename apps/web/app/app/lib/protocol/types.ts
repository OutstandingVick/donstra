export type Hex = `0x${string}`;
export type Address = `0x${string}`;

export type Verdict = "reasonable" | "negligent" | "fabricated" | "inconclusive" | "pending";
export type ReceiptStatus = "committed" | "executed" | "challenged" | "resolved" | "cancelled";
export type ChallengeQueue = "challengeable" | "active" | "awaiting-settlement" | "timed-out" | "claimable";
export type LifecycleAction = "commit" | "execute" | "challenge" | "finalize" | "expire" | "withdraw";
export type ActionPhase = "idle" | "confirm" | "pending" | "success" | "failure";

export type ProtocolTransaction = {
  label: string;
  network: "Sepolia" | "GenLayer Studionet" | "Local seal";
  hash: Hex | null;
  timestamp: string | null;
  explorerUrl: string | null;
};

export type ReporterAttestation = {
  address: Address | null;
  verified: boolean;
};

export type ReceiptRecord = {
  id: string;
  scenario: "reasonable" | "negligent" | "fabricated" | "timeout" | "live";
  source: "demo" | "live";
  status: ReceiptStatus;
  verdict: Verdict;
  agent: Address | null;
  challenger: Address | null;
  testimonyDigest: Hex;
  actionDigest: Hex;
  evidenceDigest: Hex;
  actionTransactionId: Hex | null;
  committedAt: string;
  executedAt: string | null;
  challengedAt: string | null;
  resolvedAt: string | null;
  agentBondWei: string;
  challengeBondWei: string;
  claimableWei: string;
  bondRecipient: Address | null;
  reporterQuorum: { required: number; total: number; verified: number };
  reporters: ReporterAttestation[];
  transactions: ProtocolTransaction[];
  binding: {
    receipt: boolean;
    testimony: boolean;
    evidence: boolean;
    action: boolean;
    commitmentTime: boolean;
    futureKnowledge: "clear" | "flagged" | "not-evaluated";
  };
  adjudicationReason: string;
  nextAction: LifecycleAction | null;
  nextActionReason: string;
  metadata: Record<string, string | number | boolean>;
};

export type AgentRecord = {
  id: string;
  address: Address | null;
  label: string;
  commitments: number;
  verdicts: Record<Exclude<Verdict, "pending">, number>;
  activeBondWei: string;
  recentReceiptIds: string[];
};

export type DeploymentRecord = {
  key: "genlayer" | "sepolia";
  network: string;
  status: "verified" | "legacy" | "pending";
  contractName: string;
  address: Address | null;
  deploymentTransaction: Hex | null;
  explorerUrl: string | null;
  sourceCommit: string;
  sourceFingerprint: string | null;
  policy: Array<{ label: string; value: string }>;
};

export type PublicProtocolConfig = {
  mode: "demo" | "live";
  evmChainId: number;
  evmNetwork: string;
  evmRpcConfigured: boolean;
  registryAddress: Address | null;
  relayAddress: Address | null;
  genLayerAddress: Address | null;
  walletAvailable: boolean;
};

export interface ProtocolAdapter {
  readonly mode: "demo" | "live";
  getConfig(): PublicProtocolConfig;
  listReceipts(): Promise<ReceiptRecord[]>;
  getReceipt(id: string): Promise<ReceiptRecord | null>;
  listAgents(): Promise<AgentRecord[]>;
  listDeployments(): Promise<DeploymentRecord[]>;
  runLifecycleAction(action: LifecycleAction, receipt: ReceiptRecord): Promise<{ transactionHash: Hex }>;
}
