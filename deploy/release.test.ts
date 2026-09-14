import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildReleaseRecord } from "./release.js";

const env = {
  REPORTER_ADDRESSES: "0x1111111111111111111111111111111111111111,0x2222222222222222222222222222222222222222,0x3333333333333333333333333333333333333333",
  REPORTER_QUORUM: "2",
  MAX_SOURCE_AGE_SECONDS: "86400",
  MINIMUM_AGENT_BOND_WEI: "1000000000000000",
  MINIMUM_CHALLENGE_BOND_WEI: "500000000000000",
  CHALLENGE_WINDOW_SECONDS: "86400",
  ADJUDICATION_WINDOW_SECONDS: "172800",
  GENLAYER_NETWORK: "studionet",
  GENLAYER_CONTRACT_ADDRESS: "0x4444444444444444444444444444444444444444",
  GENLAYER_DEPLOYMENT_TX: `0x${"55".repeat(32)}`,
  EVM_CHAIN_ID: "11155111",
  REGISTRY_CONTRACT_ADDRESS: "0x6666666666666666666666666666666666666666",
  RELAY_CONTRACT_ADDRESS: "0x7777777777777777777777777777777777777777",
  EVM_DEPLOYMENT_TX: `0x${"88".repeat(32)}`,
  REGISTRY_DEPLOYMENT_BLOCK: "123",
};

describe("buildReleaseRecord", () => {
  it("binds deployment identity to source and policy", () => {
    const record = buildReleaseRecord(env);
    assert.equal(record.version, 1);
    assert.equal(record.evm.chainId, 11155111);
    assert.equal(record.policy.quorum, 2);
    assert.equal(record.policy.reporters.length, 3);
    assert.match(record.sourceCommit, /^[0-9a-f]{40}$/);
  });

  it("rejects malformed deployment transaction hashes", () => {
    assert.throws(() => buildReleaseRecord({ ...env, EVM_DEPLOYMENT_TX: "0x1234" }), /32-byte/);
  });
});
