import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

export const releaseSources = [
  "contracts/genlayer/donstra_adjudicator.py",
  "contracts/evm/src/DonstraRegistry.sol",
  "contracts/evm/src/DonstraSettlementRelay.sol",
] as const;

export function sha256(path: string): string {
  return `0x${createHash("sha256").update(readFileSync(path)).digest("hex")}`;
}

export function releaseFingerprint(root = process.cwd()) {
  return Object.fromEntries(releaseSources.map((source) => {
    const path = resolve(root, source);
    return [relative(root, path), sha256(path)];
  }));
}

if (process.argv[1]?.endsWith("fingerprint.ts")) {
  process.stdout.write(`${JSON.stringify(releaseFingerprint(), null, 2)}\n`);
}
