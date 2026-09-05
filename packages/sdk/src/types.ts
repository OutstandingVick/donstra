export type Hex = `0x${string}`;
export type Address = `0x${string}`;

export interface EvidenceItem {
  uri: string;
  contentDigest: Hex;
  observedAt: number;
  mediaType?: string;
  label?: string;
}

export interface AgentMandate {
  id: string;
  version: string;
  constraints: Record<string, unknown>;
}

export interface ProposedAction {
  kind: string;
  target: string;
  chainId: number;
  calldataDigest: Hex;
  value: string;
  deadline: number;
  parameters: Record<string, unknown>;
}

export interface TestimonyPayload {
  schema: "donstra.testimony.v1";
  agent: Address;
  nonce: string;
  evidence: EvidenceItem[];
  belief: string;
  confidenceBps: number;
  mandate: AgentMandate;
  proposedAction: ProposedAction;
  createdAt: number;
}

export interface CommitmentRecord {
  receiptId: Hex;
  testimonyDigest: Hex;
  actionDigest: Hex;
  agent: Address;
  committedAt: number;
  expiresAt: number;
  bond: bigint;
  transactionHash?: Hex;
}

export type Verdict =
  | "GENUINE_REASONABLE"
  | "GENUINE_NEGLIGENT"
  | "FABRICATED"
  | "UNAVAILABLE"
  | "INCONCLUSIVE";

export interface RevealResult {
  receiptId: Hex;
  verdict: Verdict;
  hashMatched: boolean;
  actionMatched: boolean;
  detail: string;
  adjudicationTransactionHash?: Hex;
}

export interface ExecutedAction {
  receiptId: Hex;
  transactionHash: Hex;
  actionDigest: Hex;
  executedAt: number;
}

export interface SealedEnvelope {
  version: 1;
  algorithm: "AES-256-GCM";
  iv: string;
  ciphertext: string;
  authTag: string;
}

export interface TestimonyStore {
  put(receiptId: Hex, payload: TestimonyPayload): Promise<void>;
  get(receiptId: Hex): Promise<TestimonyPayload | null>;
  delete?(receiptId: Hex): Promise<void>;
}

export interface CommitmentRegistry {
  commit(input: Omit<CommitmentRecord, "committedAt" | "transactionHash">): Promise<CommitmentRecord>;
  get(receiptId: Hex): Promise<CommitmentRecord | null>;
  bindAction(action: ExecutedAction): Promise<CommitmentRecord>;
}

export interface Adjudicator {
  adjudicate(payload: TestimonyPayload, commitment: CommitmentRecord): Promise<{
    verdict: Exclude<Verdict, "FABRICATED" | "UNAVAILABLE">;
    detail: string;
    transactionHash?: Hex;
  }>;
}
