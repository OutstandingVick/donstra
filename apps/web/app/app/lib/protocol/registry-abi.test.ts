import assert from "node:assert/strict";
import test from "node:test";
import { decodeEventLog, encodeAbiParameters, encodeEventTopics } from "viem";
import { settlementRelayEventsAbi } from "./registry-abi";

test("relay event exposes GenLayer transaction and accepted signer count", () => {
  const receiptId = `0x${"11".repeat(32)}` as const;
  const adjudicationTxHash = `0x${"22".repeat(32)}` as const;
  const topics = encodeEventTopics({ abi: settlementRelayEventsAbi, eventName: "SettlementRelayed", args: { receiptId, adjudicationTxHash } });
  const data = encodeAbiParameters([{ type: "uint8" }, { type: "uint256" }], [1, 2n]);
  const decoded = decodeEventLog({ abi: settlementRelayEventsAbi, data, topics: topics as [`0x${string}`, ...`0x${string}`[]] });
  assert.equal(decoded.eventName, "SettlementRelayed");
  if (decoded.eventName !== "SettlementRelayed") return;
  assert.equal(decoded.args.receiptId, receiptId);
  assert.equal(decoded.args.adjudicationTxHash, adjudicationTxHash);
  assert.equal(decoded.args.signerCount, 2n);
});
