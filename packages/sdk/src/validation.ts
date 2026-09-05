import type { Address, Hex, TestimonyPayload } from "./types.js";

const HEX_32 = /^0x[0-9a-f]{64}$/i;
const ADDRESS = /^0x[0-9a-f]{40}$/i;

export function assertHex32(value: string, field: string): asserts value is Hex {
  if (!HEX_32.test(value)) throw new TypeError(`${field} must be a 32-byte hex value`);
}

export function assertAddress(value: string, field = "agent"): asserts value is Address {
  if (!ADDRESS.test(value)) throw new TypeError(`${field} must be a 20-byte EVM address`);
}

export function validateTestimony(payload: TestimonyPayload, now = Date.now()): void {
  if (payload.schema !== "donstra.testimony.v1") throw new TypeError("Unsupported testimony schema");
  assertAddress(payload.agent);
  if (!payload.nonce || payload.nonce.length > 128) throw new TypeError("nonce must be 1-128 characters");
  if (!payload.belief.trim() || payload.belief.length > 4_000) throw new TypeError("belief must be 1-4000 characters");
  if (!Number.isInteger(payload.confidenceBps) || payload.confidenceBps < 0 || payload.confidenceBps > 10_000) {
    throw new TypeError("confidenceBps must be an integer between 0 and 10000");
  }
  if (!Number.isSafeInteger(payload.createdAt) || payload.createdAt > now + 60_000) {
    throw new TypeError("createdAt must be a valid, non-future Unix millisecond timestamp");
  }
  if (!payload.evidence.length || payload.evidence.length > 32) throw new TypeError("evidence must contain 1-32 items");
  for (const [index, item] of payload.evidence.entries()) {
    let url: URL;
    try { url = new URL(item.uri); } catch { throw new TypeError(`evidence[${index}].uri must be a URL`); }
    if (!["https:", "ipfs:"].includes(url.protocol)) throw new TypeError(`evidence[${index}].uri must use HTTPS or IPFS`);
    assertHex32(item.contentDigest, `evidence[${index}].contentDigest`);
    if (!Number.isSafeInteger(item.observedAt) || item.observedAt > payload.createdAt) {
      throw new TypeError(`evidence[${index}].observedAt must not post-date testimony`);
    }
  }
  const action = payload.proposedAction;
  if (!action.kind.trim() || !action.target.trim()) throw new TypeError("action kind and target are required");
  if (!Number.isSafeInteger(action.chainId) || action.chainId <= 0) throw new TypeError("action chainId must be positive");
  assertHex32(action.calldataDigest, "proposedAction.calldataDigest");
  if (!/^\d+$/.test(action.value)) throw new TypeError("action value must be an unsigned base-10 integer string");
  if (!Number.isSafeInteger(action.deadline) || action.deadline <= payload.createdAt) {
    throw new TypeError("action deadline must be after testimony creation");
  }
  if (!payload.mandate.id.trim() || !payload.mandate.version.trim()) throw new TypeError("mandate id and version are required");
}
