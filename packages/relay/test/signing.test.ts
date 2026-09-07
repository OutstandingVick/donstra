import { privateKeyToAccount } from "viem/accounts";
import { describe, expect, it } from "vitest";
import {
  createSettlement,
  recoverSettlementSigner,
  signSettlement,
  sortSettlementSignatures,
} from "../src/signing.js";
import type { GenLayerObservation, Hex, RelayIdentity } from "../src/types.js";

const aliceKey = `0x${"11".repeat(32)}` as Hex;
const bobKey = `0x${"22".repeat(32)}` as Hex;
const identity: RelayIdentity = {
  sourceContract: "0x1111111111111111111111111111111111111111",
  sourceChainId: `0x${"aa".repeat(32)}`,
  targetChainId: 11155111,
  relayContract: "0x2222222222222222222222222222222222222222",
};
const observation: GenLayerObservation = {
  receiptId: `0x${"33".repeat(32)}`,
  adjudicationTxHash: `0x${"44".repeat(32)}`,
  adjudicatedAt: 1_700_000_000n,
  verdict: "GENUINE_REASONABLE",
  reason: "Evidence supports the mandate.",
};

describe("settlement signing", () => {
  it("recovers the configured reporter", async () => {
    const payload = createSettlement(observation, 3600n);
    const signature = await signSettlement(aliceKey, payload, identity);
    const signer = await recoverSettlementSigner(signature, payload, identity);
    expect(signer.toLowerCase()).toBe(privateKeyToAccount(aliceKey).address.toLowerCase());
  });

  it("binds signatures to the target chain", async () => {
    const payload = createSettlement(observation, 3600n);
    const signature = await signSettlement(aliceKey, payload, identity);
    const signer = await recoverSettlementSigner(signature, payload, { ...identity, targetChainId: 1 });
    expect(signer.toLowerCase()).not.toBe(privateKeyToAccount(aliceKey).address.toLowerCase());
  });

  it("sorts signatures by recovered signer for on-chain uniqueness checks", async () => {
    const payload = createSettlement(observation, 3600n);
    const signatures = await Promise.all([
      signSettlement(aliceKey, payload, identity),
      signSettlement(bobKey, payload, identity),
    ]);
    const sorted = await sortSettlementSignatures(signatures.reverse(), payload, identity);
    const signers = await Promise.all(sorted.map((signature) => recoverSettlementSigner(signature, payload, identity)));
    expect(signers[0].toLowerCase() < signers[1].toLowerCase()).toBe(true);
  });

  it("rejects non-positive attestation lifetimes", () => {
    expect(() => createSettlement(observation, 0n)).toThrow("positive");
  });
});
