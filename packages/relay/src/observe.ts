import { ExecutionResult, TransactionStatus } from "genlayer-js/types";
import type { GenLayerClient, TransactionHash } from "genlayer-js/types";
import type { Address, GenLayerObservation, Hex, VerdictName } from "./types.js";
import { VERDICT_INDEX } from "./types.js";

function timestampSeconds(receipt: {
  lastVoteTimestamp?: string;
  currentTimestamp?: string;
  createdTimestamp?: string;
  created_at?: Date;
}): bigint {
  const raw = receipt.lastVoteTimestamp ?? receipt.currentTimestamp ?? receipt.createdTimestamp;
  if (raw && /^[0-9]+$/.test(raw)) {
    const numeric = BigInt(raw);
    return numeric > 10_000_000_000n ? numeric / 1000n : numeric;
  }
  if (raw) {
    const parsed = Date.parse(raw);
    if (Number.isFinite(parsed)) return BigInt(Math.floor(parsed / 1000));
  }
  if (receipt.created_at instanceof Date) return BigInt(Math.floor(receipt.created_at.getTime() / 1000));
  throw new Error("Finalized GenLayer receipt did not include an adjudication timestamp");
}

function isVerdictName(value: unknown): value is VerdictName {
  return typeof value === "string" && Object.hasOwn(VERDICT_INDEX, value);
}

export async function observeFinalizedVerdict(
  client: GenLayerClient<any>,
  sourceContract: Address,
  receiptId: Hex,
  adjudicationTxHash: Hex,
): Promise<GenLayerObservation> {
  const receipt = await client.waitForTransactionReceipt({
    hash: adjudicationTxHash as TransactionHash,
    status: TransactionStatus.FINALIZED,
    retries: 240,
    interval: 5_000,
  });

  if (receipt.statusName !== TransactionStatus.FINALIZED || receipt.consensus_data?.final !== true) {
    throw new Error("GenLayer adjudication has not reached final consensus");
  }
  if (receipt.txExecutionResultName !== ExecutionResult.FINISHED_WITH_RETURN) {
    throw new Error(`GenLayer adjudication execution failed: ${receipt.txExecutionResultName ?? "unknown"}`);
  }
  const recipient = receipt.recipient ?? receipt.to_address;
  if (!recipient || recipient.toLowerCase() !== sourceContract.toLowerCase()) {
    throw new Error("Adjudication transaction targeted a different GenLayer contract");
  }

  const stored = await client.readContract({
    address: sourceContract,
    functionName: "get_verdict",
    args: [receiptId],
  }) as { verdict?: unknown; reason?: unknown };
  if (!isVerdictName(stored.verdict)) throw new Error("GenLayer contract returned an unsupported verdict");

  return {
    receiptId,
    adjudicationTxHash,
    adjudicatedAt: timestampSeconds(receipt),
    verdict: stored.verdict,
    reason: typeof stored.reason === "string" ? stored.reason : "",
  };
}
