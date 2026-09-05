import { describe, expect, it } from "vitest";
import { canonicalize, deriveReceiptId, hashAction, hashTestimony } from "../src/index.js";
import { testimony } from "./fixtures.js";

describe("canonical commitments", () => {
  it("sorts object keys recursively", () => {
    expect(canonicalize({ z: 1, a: { y: 2, b: 3 } })).toBe('{"a":{"b":3,"y":2},"z":1}');
  });

  it("rejects values JSON cannot represent safely", () => {
    expect(() => canonicalize({ value: undefined })).toThrow("Undefined");
    expect(() => canonicalize(Number.NaN)).toThrow("finite");
  });

  it("separates action, testimony, and receipt domains", () => {
    const payload = testimony();
    const hashes = [
      hashTestimony(payload),
      hashAction(payload.proposedAction),
      deriveReceiptId(payload.agent, payload.nonce),
    ];
    expect(new Set(hashes).size).toBe(3);
    hashes.forEach((hash) => expect(hash).toMatch(/^0x[0-9a-f]{64}$/));
  });

  it("is stable for logically identical payloads", () => {
    const left = testimony();
    const right = JSON.parse(JSON.stringify(left));
    expect(hashTestimony(left)).toBe(hashTestimony(right));
  });
});
