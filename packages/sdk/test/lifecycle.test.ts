import { beforeEach, describe, expect, it } from "vitest";
import {
  Donstra,
  MandateAdjudicator,
  MemoryCommitmentRegistry,
  MemoryTestimonyStore,
  hashAction,
  type Hex,
} from "../src/index.js";
import { testimony, ZERO_DIGEST } from "./fixtures.js";

describe("Donstra lifecycle", () => {
  let store: MemoryTestimonyStore;
  let registry: MemoryCommitmentRegistry;
  let donstra: Donstra;
  const now = 1_700_000_000_500;

  beforeEach(() => {
    store = new MemoryTestimonyStore();
    registry = new MemoryCommitmentRegistry(() => now);
    donstra = new Donstra({ store, registry, adjudicator: new MandateAdjudicator() });
  });

  async function committedAndBound(exposurePct = 12) {
    const payload = testimony({
      proposedAction: { ...testimony().proposedAction, parameters: { exposurePct } },
    });
    const commitment = await donstra.commitReasoning(payload, 100n);
    await donstra.bindExecutedAction(commitment.receiptId, {
      transactionHash: ZERO_DIGEST,
      chainId: payload.proposedAction.chainId,
      target: payload.proposedAction.target,
      calldataDigest: payload.proposedAction.calldataDigest,
      value: payload.proposedAction.value,
      executedAt: now + 1,
    });
    return { payload, commitment };
  }

  it("returns reasonable only after binding the exact action", async () => {
    const { commitment } = await committedAndBound();
    const result = await donstra.revealOnChallenge(commitment.receiptId);
    expect(result).toMatchObject({ verdict: "GENUINE_REASONABLE", hashMatched: true, actionMatched: true });
  });

  it("detects negligent mandate violations", async () => {
    const { commitment } = await committedAndBound(40);
    expect((await donstra.revealOnChallenge(commitment.receiptId)).verdict).toBe("GENUINE_NEGLIGENT");
  });

  it("detects storage tampering before adjudication", async () => {
    const { payload, commitment } = await committedAndBound();
    store.tamper(commitment.receiptId, { ...payload, belief: "A rewritten story" });
    expect(await donstra.revealOnChallenge(commitment.receiptId)).toMatchObject({ verdict: "FABRICATED", hashMatched: false });
  });

  it("does not equate missing testimony with fabrication", async () => {
    const { commitment } = await committedAndBound();
    await store.delete(commitment.receiptId);
    expect((await donstra.revealOnChallenge(commitment.receiptId)).verdict).toBe("UNAVAILABLE");
  });

  it("rejects an execution that differs from the committed action", async () => {
    const payload = testimony();
    const commitment = await donstra.commitReasoning(payload);
    await expect(registry.bindAction({
      receiptId: commitment.receiptId,
      transactionHash: ZERO_DIGEST,
      actionDigest: `0x${"ff".repeat(32)}` as Hex,
      executedAt: now + 1,
    })).rejects.toThrow("does not match");
    expect(hashAction(payload.proposedAction)).toBe(commitment.actionDigest);
  });
});
