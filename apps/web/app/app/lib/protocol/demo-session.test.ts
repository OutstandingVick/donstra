import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { demoReceipts } from "../../data/receipts";
import { openDemoChallenge, readDemoRuns } from "./demo-session";

const originalWindow = globalThis.window;

afterEach(() => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
});

test("opening a demo challenge stores a local-only transition without fabricating a transaction", () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
      dispatchEvent: () => true,
    },
  });
  const source = demoReceipts.find((receipt) => receipt.id === "demo-negligent-001")!;
  const challenged = openDemoChallenge(source);
  assert.equal(challenged.status, "challenged");
  assert.equal(challenged.nextAction, null);
  assert.equal(challenged.verdict, "pending");
  assert.equal(challenged.transactions.find((transaction) => transaction.label === "Challenge")?.hash, null);
  assert.equal(challenged.metadata.onchainChallenge, false);
  assert.equal(readDemoRuns()[0]?.id, source.id);
  assert.throws(() => openDemoChallenge(challenged), /not eligible/);
});
