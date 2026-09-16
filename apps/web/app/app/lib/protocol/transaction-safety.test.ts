import assert from "node:assert/strict";
import test from "node:test";
import { ensureWalletChain, requireCurrentLifecycleAction, requireSuccessfulTransaction } from "./transaction-safety";

test("only successful chain receipts complete a lifecycle action", () => {
  assert.doesNotThrow(() => requireSuccessfulTransaction("success"));
  assert.throws(() => requireSuccessfulTransaction("reverted"), /reverted onchain/i);
});

test("wallet chain is checked again after a switch request", async () => {
  let chainId = "0x1";
  const provider = { request: async ({ method }: { method: string }) => {
    if (method === "eth_chainId") return chainId;
    if (method === "wallet_switchEthereumChain") { chainId = "0xaa36a7"; return null; }
    throw new Error("Unexpected request");
  } };
  await ensureWalletChain(provider, 11155111);
  chainId = "0x1";
  await assert.rejects(ensureWalletChain({ request: async ({ method }) => method === "eth_chainId" ? chainId : null }, 11155111), /wrong network/i);
});

test("stale challenge timing cannot reach a wallet submission", () => {
  assert.doesNotThrow(() => requireCurrentLifecycleAction("challenge", "challenge"));
  assert.throws(() => requireCurrentLifecycleAction("challenge", "finalize"), /no longer valid/i);
  assert.throws(() => requireCurrentLifecycleAction("challenge", null), /no longer valid/i);
});
