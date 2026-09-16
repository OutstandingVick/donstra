import assert from "node:assert/strict";
import test from "node:test";
import { queueForReceipt } from "../../data/receipts";
import { scenarios } from "../../data/scenarios";
import { DemoProtocolAdapter } from "./demo-adapter";
import { isLiveReady, protocolConfig } from "./config";
import type { ProtocolAdapter } from "./types";

test("demo adapter exposes every challenge queue state", async () => {
  const receipts = await new DemoProtocolAdapter().listReceipts();
  const queues = new Set(receipts.map(queueForReceipt));
  for (const expected of ["challengeable", "active", "awaiting-settlement", "timed-out", "claimable"]) {
    assert.equal(queues.has(expected as ReturnType<typeof queueForReceipt>), true);
  }
});

test("demo adapter never submits lifecycle actions", async () => {
  const adapter: ProtocolAdapter = new DemoProtocolAdapter();
  const receipt = (await adapter.listReceipts())[0];
  await assert.rejects(adapter.runLifecycleAction("withdraw", receipt), /unavailable in demo mode/i);
});

test("demo deployment keeps Sepolia addresses unavailable", async () => {
  const deployments = await new DemoProtocolAdapter().listDeployments();
  const sepolia = deployments.find(({ key }) => key === "sepolia");
  assert.equal(sepolia?.address, null);
  assert.equal(sepolia?.deploymentTransaction, null);
  assert.equal(protocolConfig.mode, "demo");
});

test("live mode requires all public deployment evidence", () => {
  const complete = {
    registryAddress: "0x1111111111111111111111111111111111111111" as const,
    relayAddress: "0x2222222222222222222222222222222222222222" as const,
    genLayerAddress: "0x3333333333333333333333333333333333333333" as const,
    rpcConfigured: true,
    releaseRecorded: true,
    deploymentVerified: true,
  };
  assert.equal(isLiveReady(complete), true);
  assert.equal(isLiveReady({ ...complete, deploymentVerified: false }), false);
  assert.equal(isLiveReady({ ...complete, releaseRecorded: false }), false);
  assert.equal(isLiveReady({ ...complete, relayAddress: null }), false);
});

test("reasonable inspector agrees with its scenario and receipt", () => {
  const scenario = scenarios.reasonable;
  assert.equal(scenario.confidence, 68);
  assert.equal(scenario.proposedExposure, 10);
  assert.match(scenario.inspector.Mandate.summary, /compliant/i);
  assert.equal(scenario.inspector.Mandate.fields.find(({ label }) => label === "Proposed exposure")?.value, "10%");
  assert.equal(scenario.inspector["Executed Action"].fields.find(({ label }) => label === "Executed exposure")?.value, "10%");
});
