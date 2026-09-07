import { recoverTypedDataAddress, type TypedDataDomain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { GenLayerObservation, Hex, RelayIdentity, SettlementPayload } from "./types.js";
import { VERDICT_INDEX } from "./types.js";

const settlementTypes = {
  Settlement: [
    { name: "receiptId", type: "bytes32" },
    { name: "adjudicationTxHash", type: "bytes32" },
    { name: "verdict", type: "uint8" },
    { name: "adjudicatedAt", type: "uint64" },
    { name: "validUntil", type: "uint64" },
    { name: "sourceContract", type: "address" },
    { name: "sourceChainId", type: "bytes32" },
  ],
} as const;

export function createSettlement(observation: GenLayerObservation, ttlSeconds: bigint): SettlementPayload {
  if (ttlSeconds <= 0n) throw new RangeError("Settlement TTL must be positive");
  return {
    receiptId: observation.receiptId,
    adjudicationTxHash: observation.adjudicationTxHash,
    verdict: VERDICT_INDEX[observation.verdict],
    adjudicatedAt: observation.adjudicatedAt,
    validUntil: observation.adjudicatedAt + ttlSeconds,
  };
}

export function settlementTypedData(payload: SettlementPayload, identity: RelayIdentity) {
  const domain: TypedDataDomain = {
    name: "Donstra Settlement Relay",
    version: "1",
    chainId: identity.targetChainId,
    verifyingContract: identity.relayContract,
  };
  return {
    domain,
    types: settlementTypes,
    primaryType: "Settlement" as const,
    message: {
      ...payload,
      sourceContract: identity.sourceContract,
      sourceChainId: identity.sourceChainId,
    },
  };
}

export async function signSettlement(
  privateKey: Hex,
  payload: SettlementPayload,
  identity: RelayIdentity,
): Promise<Hex> {
  const account = privateKeyToAccount(privateKey);
  return account.signTypedData(settlementTypedData(payload, identity));
}

export async function recoverSettlementSigner(
  signature: Hex,
  payload: SettlementPayload,
  identity: RelayIdentity,
) {
  return recoverTypedDataAddress({ ...settlementTypedData(payload, identity), signature });
}

export async function sortSettlementSignatures(
  signatures: Hex[],
  payload: SettlementPayload,
  identity: RelayIdentity,
): Promise<Hex[]> {
  const recovered = await Promise.all(signatures.map(async (signature) => ({
    signature,
    signer: await recoverSettlementSigner(signature, payload, identity),
  })));
  recovered.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()));
  return recovered.map(({ signature }) => signature);
}
