import type {
  Adjudicator,
  CommitmentRecord,
  CommitmentRegistry,
  ExecutedAction,
  Hex,
  TestimonyPayload,
  TestimonyStore,
} from "../types.js";

export class MemoryTestimonyStore implements TestimonyStore {
  private readonly values = new Map<Hex, TestimonyPayload>();

  async put(receiptId: Hex, payload: TestimonyPayload): Promise<void> {
    if (this.values.has(receiptId)) throw new Error("Testimony already sealed");
    this.values.set(receiptId, structuredClone(payload));
  }

  async get(receiptId: Hex): Promise<TestimonyPayload | null> {
    const value = this.values.get(receiptId);
    return value ? structuredClone(value) : null;
  }

  async delete(receiptId: Hex): Promise<void> { this.values.delete(receiptId); }

  /** Test/demo helper that simulates compromised storage. */
  tamper(receiptId: Hex, payload: TestimonyPayload): void {
    this.values.set(receiptId, structuredClone(payload));
  }
}

export class MemoryCommitmentRegistry implements CommitmentRegistry {
  private readonly values = new Map<Hex, CommitmentRecord>();
  constructor(private readonly now: () => number = Date.now) {}

  async commit(input: Omit<CommitmentRecord, "committedAt" | "transactionHash">): Promise<CommitmentRecord> {
    if (this.values.has(input.receiptId)) throw new Error("Receipt already committed");
    const record = { ...input, committedAt: this.now() };
    if (record.expiresAt <= record.committedAt) throw new Error("Commitment is already expired");
    this.values.set(record.receiptId, record);
    return structuredClone(record);
  }

  async get(receiptId: Hex): Promise<CommitmentRecord | null> {
    const value = this.values.get(receiptId);
    return value ? structuredClone(value) : null;
  }

  async bindAction(action: ExecutedAction): Promise<CommitmentRecord> {
    const record = this.values.get(action.receiptId);
    if (!record) throw new Error("Unknown receipt");
    if (record.transactionHash) throw new Error("Receipt already bound to an action");
    if (action.actionDigest !== record.actionDigest) throw new Error("Executed action does not match commitment");
    if (action.executedAt < record.committedAt || action.executedAt > record.expiresAt) {
      throw new Error("Action executed outside the commitment window");
    }
    record.transactionHash = action.transactionHash;
    return structuredClone(record);
  }
}

export class MandateAdjudicator implements Adjudicator {
  async adjudicate(payload: TestimonyPayload): Promise<{
    verdict: "GENUINE_REASONABLE" | "GENUINE_NEGLIGENT" | "INCONCLUSIVE";
    detail: string;
  }> {
    const max = payload.mandate.constraints.maxExposurePct;
    const proposed = payload.proposedAction.parameters.exposurePct;
    if (typeof max !== "number" || typeof proposed !== "number") {
      return { verdict: "INCONCLUSIVE", detail: "The local adjudicator lacks an exposure rule." };
    }
    return proposed > max
      ? { verdict: "GENUINE_NEGLIGENT", detail: `Exposure ${proposed}% exceeds the ${max}% mandate limit.` }
      : { verdict: "GENUINE_REASONABLE", detail: `Exposure ${proposed}% is within the ${max}% mandate limit.` };
  }
}
