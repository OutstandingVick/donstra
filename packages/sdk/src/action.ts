import { hashAction } from "./canonical.js";
import type { ExecutedAction, Hex, ProposedAction } from "./types.js";
import { assertHex32 } from "./validation.js";

export interface ActionExecutionReceipt {
  transactionHash: Hex;
  chainId: number;
  target: string;
  calldataDigest: Hex;
  value: string;
  executedAt: number;
}

export function bindExecution(
  receiptId: Hex,
  proposed: ProposedAction,
  execution: ActionExecutionReceipt,
): ExecutedAction {
  assertHex32(execution.transactionHash, "transactionHash");
  if (execution.chainId !== proposed.chainId) throw new Error("Executed chain does not match proposed action");
  if (execution.target.toLowerCase() !== proposed.target.toLowerCase()) throw new Error("Executed target does not match proposed action");
  if (execution.calldataDigest !== proposed.calldataDigest) throw new Error("Executed calldata does not match proposed action");
  if (execution.value !== proposed.value) throw new Error("Executed value does not match proposed action");
  if (execution.executedAt > proposed.deadline) throw new Error("Executed action missed its deadline");
  return { receiptId, transactionHash: execution.transactionHash, actionDigest: hashAction(proposed), executedAt: execution.executedAt };
}
