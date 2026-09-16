import assert from "node:assert/strict";
import test from "node:test";
import { requireSuccessfulTransaction } from "./transaction-safety";

test("only successful chain receipts complete a lifecycle action", () => {
  assert.doesNotThrow(() => requireSuccessfulTransaction("success"));
  assert.throws(() => requireSuccessfulTransaction("reverted"), /reverted onchain/i);
});
