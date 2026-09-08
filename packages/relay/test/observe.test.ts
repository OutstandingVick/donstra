import { ExecutionResult, TransactionStatus, type GenLayerClient } from "genlayer-js/types";
import { describe, expect, it } from "vitest";
import { observeFinalizedVerdict } from "../src/observe.js";
import type { Address, Hex } from "../src/types.js";

const sourceContract = "0x1111111111111111111111111111111111111111" as Address;
const receiptId = `0x${"22".repeat(32)}` as Hex;
const transactionHash = `0x${"33".repeat(32)}` as Hex;
const binding = {
  testimonyDigest: `0x${"44".repeat(32)}` as Hex,
  actionDigest: `0x${"55".repeat(32)}` as Hex,
  committedAt: 1_700_000_000n,
};

function client(overrides: Record<string, unknown> = {}) {
  const stored = {
    verdict: "GENUINE_REASONABLE",
    reason: "Evidence supports the mandate.",
    receipt_id: receiptId,
    testimony_digest: binding.testimonyDigest,
    action_digest: binding.actionDigest,
    commitment_timestamp: binding.committedAt.toString(),
    ...overrides,
  };
  return {
    waitForTransactionReceipt: async () => ({
      statusName: TransactionStatus.FINALIZED,
      consensus_data: { final: true },
      txExecutionResultName: ExecutionResult.FINISHED_WITH_RETURN,
      recipient: sourceContract,
      lastVoteTimestamp: "1700000005",
    }),
    readContract: async () => stored,
  } as unknown as GenLayerClient<any>;
}

describe("finalized verdict observation", () => {
  it("accepts a verdict bound to the challenged EVM commitment", async () => {
    const result = await observeFinalizedVerdict(client(), sourceContract, receiptId, transactionHash, binding);
    expect(result.verdict).toBe("GENUINE_REASONABLE");
    expect(result.adjudicatedAt).toBe(1_700_000_005n);
  });

  it("rejects a verdict for different testimony", async () => {
    await expect(observeFinalizedVerdict(
      client({ testimony_digest: `0x${"66".repeat(32)}` }),
      sourceContract,
      receiptId,
      transactionHash,
      binding,
    )).rejects.toThrow("testimony does not match");
  });

  it("rejects a verdict with a substituted commitment timestamp", async () => {
    await expect(observeFinalizedVerdict(
      client({ commitment_timestamp: "1700000001" }),
      sourceContract,
      receiptId,
      transactionHash,
      binding,
    )).rejects.toThrow("timestamp does not match");
  });
});
