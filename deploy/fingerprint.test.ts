import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { releaseFingerprint, releaseSources, sha256 } from "./fingerprint.js";

describe("releaseFingerprint", () => {
  it("returns stable prefixed SHA-256 values", () => {
    const root = mkdtempSync(join(tmpdir(), "donstra-fingerprint-"));
    for (const source of releaseSources) {
      const path = join(root, source);
      mkdirSync(join(path, ".."), { recursive: true });
      writeFileSync(path, source);
    }
    const first = releaseFingerprint(root);
    const second = releaseFingerprint(root);
    assert.deepEqual(first, second);
    assert.ok(Object.values(first).every((value) => /^0x[0-9a-f]{64}$/.test(value)));
  });

  it("changes when source bytes change", () => {
    const root = mkdtempSync(join(tmpdir(), "donstra-sha-"));
    const path = join(root, "contract.sol");
    writeFileSync(path, "one");
    const before = sha256(path);
    writeFileSync(path, "two");
    assert.notEqual(sha256(path), before);
  });
});
