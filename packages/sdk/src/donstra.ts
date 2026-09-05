import { deriveReceiptId, hashAction, hashTestimony } from "./canonical.js";
import { bindExecution, type ActionExecutionReceipt } from "./action.js";
import type {
  Adjudicator,
  CommitmentRecord,
  CommitmentRegistry,
  Hex,
  RevealResult,
  TestimonyPayload,
  TestimonyStore,
} from "./types.js";
import { validateTestimony } from "./validation.js";

export interface DonstraConfig {
  store: TestimonyStore;
  registry: CommitmentRegistry;
  adjudicator: Adjudicator;
}

export class Donstra {
  constructor(private readonly config: DonstraConfig) {}

  async commitReasoning(payload: TestimonyPayload, bond = 0n): Promise<CommitmentRecord> {
    validateTestimony(payload);
    const receiptId = deriveReceiptId(payload.agent, payload.nonce);
    const input = {
      receiptId,
      testimonyDigest: hashTestimony(payload),
      actionDigest: hashAction(payload.proposedAction),
      agent: payload.agent,
      expiresAt: payload.proposedAction.deadline,
      bond,
    };

    await this.config.store.put(receiptId, payload);
    try {
      return await this.config.registry.commit(input);
    } catch (error) {
      await this.config.store.delete?.(receiptId);
      throw error;
    }
  }

  async bindExecutedAction(receiptId: Hex, execution: ActionExecutionReceipt): Promise<CommitmentRecord> {
    const payload = await this.config.store.get(receiptId);
    if (!payload) throw new Error("Cannot bind an action without its sealed testimony");
    return this.config.registry.bindAction(bindExecution(receiptId, payload.proposedAction, execution));
  }

  async revealOnChallenge(receiptId: Hex): Promise<RevealResult> {
    const commitment = await this.config.registry.get(receiptId);
    if (!commitment) throw new Error(`No commitment found for ${receiptId}`);
    if (!commitment.transactionHash) {
      return {
        receiptId,
        verdict: "INCONCLUSIVE",
        hashMatched: false,
        actionMatched: false,
        detail: "No executed action is bound to this commitment.",
      };
    }
    const payload = await this.config.store.get(receiptId);
    if (!payload) {
      return {
        receiptId,
        verdict: "UNAVAILABLE",
        hashMatched: false,
        actionMatched: true,
        detail: "The sealed testimony is unavailable; absence alone is not proof of fabrication.",
      };
    }
    const hashMatched = hashTestimony(payload) === commitment.testimonyDigest;
    const actionMatched = hashAction(payload.proposedAction) === commitment.actionDigest;
    if (!hashMatched || !actionMatched) {
      return {
        receiptId,
        verdict: "FABRICATED",
        hashMatched,
        actionMatched,
        detail: "The revealed testimony or proposed action differs from the pre-action commitment.",
      };
    }
    const result = await this.config.adjudicator.adjudicate(payload, commitment);
    return {
      receiptId,
      verdict: result.verdict,
      hashMatched: true,
      actionMatched: true,
      detail: result.detail,
      adjudicationTransactionHash: result.transactionHash,
    };
  }
}
