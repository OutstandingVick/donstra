import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadDeploymentPolicy } from "./config.js";

const valid = {
  REPORTER_ADDRESSES: "0x1111111111111111111111111111111111111111,0x2222222222222222222222222222222222222222,0x3333333333333333333333333333333333333333",
  REPORTER_QUORUM: "2",
  MAX_SOURCE_AGE_SECONDS: "86400",
  MINIMUM_AGENT_BOND_WEI: "1000000000000000",
  MINIMUM_CHALLENGE_BOND_WEI: "500000000000000",
  CHALLENGE_WINDOW_SECONDS: "86400",
  ADJUDICATION_WINDOW_SECONDS: "172800",
};

describe("loadDeploymentPolicy", () => {
  it("accepts the production 2-of-3 policy", () => {
    const policy = loadDeploymentPolicy(valid);
    assert.equal(policy.reporters.length, 3);
    assert.equal(policy.quorum, 2);
  });

  it("rejects duplicate reporters", () => {
    assert.throws(() => loadDeploymentPolicy({
      ...valid,
      REPORTER_ADDRESSES: "0x1111111111111111111111111111111111111111,0x1111111111111111111111111111111111111111,0x3333333333333333333333333333333333333333",
    }), /unique/);
  });

  it("rejects a weaker quorum", () => {
    assert.throws(() => loadDeploymentPolicy({ ...valid, REPORTER_QUORUM: "1" }), /2-of-3/);
  });
});
