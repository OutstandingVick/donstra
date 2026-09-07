import { describe, expect, it } from "vitest";
import { loadRelayConfig } from "../src/config.js";

const valid = {
  GENLAYER_NETWORK: "testnet-bradbury",
  GENLAYER_RPC_URL: "https://genlayer.example/rpc",
  GENLAYER_CONTRACT_ADDRESS: "0x1111111111111111111111111111111111111111",
  EVM_RPC_URL: "https://ethereum.example/rpc",
  EVM_CHAIN_ID: "11155111",
  RELAY_CONTRACT_ADDRESS: "0x2222222222222222222222222222222222222222",
  REPORTER_PRIVATE_KEY: `0x${"33".repeat(32)}`,
};

describe("loadRelayConfig", () => {
  it("derives a stable source network identity", () => {
    const config = loadRelayConfig(valid);
    expect(config.identity.sourceChainId).toMatch(/^0x[0-9a-f]{64}$/);
    expect(config.identity.targetChainId).toBe(11155111);
    expect(config.attestationTtlSeconds).toBe(3600n);
  });

  it("rejects missing deployment addresses", () => {
    expect(() => loadRelayConfig({ ...valid, RELAY_CONTRACT_ADDRESS: "" }))
      .toThrow("RELAY_CONTRACT_ADDRESS");
  });

  it("rejects malformed private keys", () => {
    expect(() => loadRelayConfig({ ...valid, REPORTER_PRIVATE_KEY: "0x1234" }))
      .toThrow("32 bytes");
  });

  it("rejects non-HTTP RPC transports", () => {
    expect(() => loadRelayConfig({ ...valid, EVM_RPC_URL: "file:///tmp/rpc" }))
      .toThrow("HTTP or HTTPS");
  });
});
