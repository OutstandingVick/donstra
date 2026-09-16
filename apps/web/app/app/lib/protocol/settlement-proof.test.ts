import assert from "node:assert/strict";
import test from "node:test";
import { encodeFunctionData } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { settlementRelayCallAbi } from "./registry-abi";
import { recoverSettlementProof } from "./settlement-proof";

test("settlement calldata recovers the actual domain-bound reporter", async () => {
  const account = privateKeyToAccount(`0x${"11".repeat(32)}`);
  const identity = {
    chainId: 11155111,
    relayAddress: "0x2222222222222222222222222222222222222222" as const,
    sourceContract: "0x3333333333333333333333333333333333333333" as const,
    sourceChainId: `0x${"44".repeat(32)}` as `0x${string}`,
  };
  const settlement = {
    receiptId: `0x${"55".repeat(32)}` as `0x${string}`,
    adjudicationTxHash: `0x${"66".repeat(32)}` as `0x${string}`,
    verdict: 1,
    adjudicatedAt: 1_700_000_000n,
    validUntil: 1_700_003_600n,
  };
  const signature = await account.signTypedData({
    domain: { name: "Donstra Settlement Relay", version: "1", chainId: identity.chainId, verifyingContract: identity.relayAddress },
    types: { Settlement: [
      { name: "receiptId", type: "bytes32" }, { name: "adjudicationTxHash", type: "bytes32" },
      { name: "verdict", type: "uint8" }, { name: "adjudicatedAt", type: "uint64" },
      { name: "validUntil", type: "uint64" }, { name: "sourceContract", type: "address" },
      { name: "sourceChainId", type: "bytes32" },
    ] },
    primaryType: "Settlement",
    message: { ...settlement, sourceContract: identity.sourceContract, sourceChainId: identity.sourceChainId },
  });
  const input = encodeFunctionData({ abi: settlementRelayCallAbi, functionName: "settle", args: [settlement, [signature]] });
  const proof = await recoverSettlementProof(input, identity);
  assert.equal(proof.signers[0], account.address);
  assert.equal(proof.signatures[0], signature);
  const wrongDomain = await recoverSettlementProof(input, { ...identity, chainId: 1 });
  assert.notEqual(wrongDomain.signers[0], account.address);
});
