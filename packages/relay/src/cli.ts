#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { loadRelayConfig } from "./config.js";
import { artifactPayload, attestFinalizedReceipt, type AttestationArtifact } from "./attest.js";
import { submitSettlement } from "./submit.js";
import type { Hex, SettlementPayload } from "./types.js";

function usage(): never {
  throw new Error(
    "Usage: donstra-relay attest <receipt-id> <genlayer-tx-hash> | submit <attestation.json> [...more]",
  );
}

function samePayload(left: SettlementPayload, right: SettlementPayload): boolean {
  return left.receiptId === right.receiptId
    && left.adjudicationTxHash === right.adjudicationTxHash
    && left.verdict === right.verdict
    && left.adjudicatedAt === right.adjudicatedAt
    && left.validUntil === right.validUntil;
}

async function main() {
  const config = loadRelayConfig();
  const [command, ...args] = process.argv.slice(2);

  if (command === "attest") {
    if (args.length !== 2) usage();
    const [receiptId, adjudicationTxHash] = args as [Hex, Hex];
    const artifact = await attestFinalizedReceipt(config, receiptId, adjudicationTxHash);
    process.stdout.write(`${JSON.stringify(artifact, null, 2)}\n`);
    return;
  }

  if (command === "submit") {
    if (args.length === 0) usage();
    const artifacts = args.map((filename) => JSON.parse(readFileSync(filename, "utf8")) as AttestationArtifact);
    if (artifacts.some((artifact) => artifact.version !== 1)) throw new Error("Unsupported attestation artifact");
    const payload = artifactPayload(artifacts[0]);
    if (artifacts.some((artifact) => !samePayload(payload, artifactPayload(artifact)))) {
      throw new Error("Attestation files do not describe the same settlement");
    }
    const hash = await submitSettlement(config, payload, artifacts.map(({ signature }) => signature));
    process.stdout.write(hash ? `${hash}\n` : "already processed\n");
    return;
  }

  usage();
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
