export type Hex = `0x${string}`;
export type Address = `0x${string}`;

export const VERDICT_INDEX = {
  GENUINE_REASONABLE: 0,
  GENUINE_NEGLIGENT: 1,
  FABRICATED: 2,
  INCONCLUSIVE: 3,
} as const;

export type VerdictName = keyof typeof VERDICT_INDEX;

export interface GenLayerObservation {
  receiptId: Hex;
  adjudicationTxHash: Hex;
  adjudicatedAt: bigint;
  verdict: VerdictName;
  reason: string;
}

export interface SettlementPayload {
  receiptId: Hex;
  adjudicationTxHash: Hex;
  verdict: number;
  adjudicatedAt: bigint;
  validUntil: bigint;
}

export interface RelayIdentity {
  sourceContract: Address;
  sourceChainId: Hex;
  targetChainId: number;
  relayContract: Address;
}
