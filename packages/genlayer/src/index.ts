import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import type { Adjudicator, CommitmentRecord, Hex, TestimonyPayload, Verdict } from "@donstra/sdk";
import type { GenLayerClient, TransactionHash } from "genlayer-js/types";
import { TransactionStatus } from "genlayer-js/types";

export interface EvidenceSnapshot {
  uri: string;
  observedAt: number;
  contentDigest: Hex;
  content: string;
}

export type EvidenceResolver = (payload: TestimonyPayload) => Promise<EvidenceSnapshot[]>;

export class GenLayerAdjudicator implements Adjudicator {
  constructor(
    private readonly client: GenLayerClient<any>,
    private readonly contractAddress: Hex,
    private readonly resolveEvidence: EvidenceResolver,
  ) {}

  async adjudicate(payload: TestimonyPayload, commitment: CommitmentRecord) {
    const evidence = await this.resolveEvidence(payload);
    const txHash = await this.client.writeContract({
      address: this.contractAddress,
      functionName: "adjudicate",
      args: [
        commitment.receiptId,
        String(Math.floor(commitment.committedAt / 1000)),
        JSON.stringify(payload),
        JSON.stringify(evidence),
      ],
      value: 0n,
    });
    const receipt = await this.client.waitForTransactionReceipt({
      hash: txHash as TransactionHash,
      status: TransactionStatus.ACCEPTED,
      retries: 120,
      interval: 5_000,
    });
    if (receipt.txExecutionResultName === "FINISHED_WITH_ERROR") {
      throw new Error("GenLayer adjudication finalized with an execution error");
    }
    const result = await this.client.readContract({
      address: this.contractAddress,
      functionName: "get_verdict",
      args: [commitment.receiptId],
      stateStatus: "accepted",
    }) as { verdict?: Verdict; reason?: string };
    if (!result.verdict) throw new Error("GenLayer returned no adjudication verdict");
    return {
      verdict: result.verdict as "GENUINE_REASONABLE" | "GENUINE_NEGLIGENT" | "INCONCLUSIVE",
      detail: result.reason ?? "GenLayer validators reached consensus.",
      transactionHash: txHash as Hex,
    };
  }
}

export async function fetchEvidenceSnapshots(payload: TestimonyPayload): Promise<EvidenceSnapshot[]> {
  return Promise.all(payload.evidence.map(async (item) => {
    const url = new URL(item.uri);
    if (url.protocol !== "https:") throw new Error(`Automatic capture only supports HTTPS: ${item.uri}`);
    if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.)/i.test(url.hostname)) throw new Error("Private evidence hosts are blocked");
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000), redirect: "error" });
    if (!response.ok) throw new Error(`Evidence fetch failed with ${response.status}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > 128_000) throw new Error("Evidence item exceeds 128KB capture limit");
    const contentDigest = `0x${bytesToHex(sha256(bytes))}` as Hex;
    if (contentDigest !== item.contentDigest) throw new Error(`Evidence digest changed for ${item.uri}`);
    return { ...item, content: new TextDecoder().decode(bytes) };
  }));
}
