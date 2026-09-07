#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { createClient } from "genlayer-js";
import { loadRelayConfig } from "./config.js";
import { observeFinalizedVerdict } from "./observe.js";
import { createSettlement, recoverSettlementSigner, signSettlement } from "./signing.js";
import { submitSettlement } from "./submit.js";
import type { Address, Hex, SettlementPayload } from "./types.js";

interface AttestationArtifact {
  version: 1;
  payload: {
    receiptId: Hex;
    adjudicationTxHash: Hex;
    verdict: number;
    adjudicatedAt: string;
    validUntil: string;
  };
  signer: Address;
  signature: Hex;
}

function usage(): never {
  throw new Error(
    "Usage: donstra-relay attest <receipt-id> <genlayer-tx-hash> | submit <attestation.json> [...more]",
  );
}

function artifactPayload(artifact: AttestationArtifact): SettlementPayload {
  return {
    ...artifact.payload,
    adjudicatedAt: BigInt(artifact.payload.adjudicatedAt),
    validUntil: BigInt(artifact.payload.validUntil),
  };
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
    const client = createClient({ endpoint: config.genLayerRpcUrl });
    const observation = await observeFinalizedVerdict(
      client,
      config.identity.sourceContract,
      receiptId,
      adjudicationTxHash,
    );
    const payload = createSettlement(observation, config.attestationTtlSeconds);
    const signature = await signSettlement(config.reporterPrivateKey, payload, config.identity);
    const signer = await recoverSettlementSigner(signature, payload, config.identity);
    const artifact: AttestationArtifact = {
      version: 1,
      payload: {
        ...payload,
        adjudicatedAt: payload.adjudicatedAt.toString(),
        validUntil: payload.validUntil.toString(),
      },
      signer,
      signature,
    };
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
