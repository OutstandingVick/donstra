import { createClient } from "genlayer-js";
import { createPublicClient, http } from "viem";
import { registryAbi, settlementRelayAbi } from "./abi.js";
import type { RelayConfig } from "./config.js";
import { observeFinalizedVerdict } from "./observe.js";
import { createSettlement, recoverSettlementSigner, signSettlement } from "./signing.js";
import type { Address, Hex, SettlementPayload } from "./types.js";

export interface AttestationArtifact {
  version: 1;
  payload: {
    receiptId: Hex;
    adjudicationTxHash: Hex;
    verdict: number;
    adjudicatedAt: string;
    validUntil: string;
  };
  signer: Address;
  signature: Hex;
}

export function artifactPayload(artifact: AttestationArtifact): SettlementPayload {
  return { ...artifact.payload, adjudicatedAt: BigInt(artifact.payload.adjudicatedAt), validUntil: BigInt(artifact.payload.validUntil) };
}

export async function attestFinalizedReceipt(config: RelayConfig, receiptId: Hex, adjudicationTxHash: Hex): Promise<AttestationArtifact> {
  const genlayer = createClient({ endpoint: config.genLayerRpcUrl });
  const evm = createPublicClient({ transport: http(config.evmRpcUrl) });
  const actualChainId = await evm.getChainId();
  if (actualChainId !== config.identity.targetChainId) throw new Error("EVM chain does not match reporter configuration");
  const registry = await evm.readContract({ address: config.identity.relayContract, abi: settlementRelayAbi, functionName: "registry" });
  const commitment = await evm.readContract({ address: registry, abi: registryAbi, functionName: "commitments", args: [receiptId] });
  if (Number(commitment[11]) !== 3) throw new Error("EVM receipt is not in the challenged state");
  const observation = await observeFinalizedVerdict(genlayer, config.identity.sourceContract, receiptId, adjudicationTxHash, {
    testimonyDigest: commitment[1], actionDigest: commitment[2], committedAt: commitment[4],
  });
  const payload = createSettlement(observation, config.attestationTtlSeconds);
  const signature = await signSettlement(config.reporterPrivateKey, payload, config.identity);
  const signer = await recoverSettlementSigner(signature, payload, config.identity);
  return {
    version: 1,
    payload: { ...payload, adjudicatedAt: payload.adjudicatedAt.toString(), validUntil: payload.validUntil.toString() },
    signer,
    signature,
  };
}
