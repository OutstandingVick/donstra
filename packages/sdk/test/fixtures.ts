import type { TestimonyPayload } from "../src/types.js";

export const ZERO_DIGEST = `0x${"00".repeat(32)}` as const;
export const AGENT = "0x1111111111111111111111111111111111111111" as const;

export function testimony(overrides: Partial<TestimonyPayload> = {}): TestimonyPayload {
  const createdAt = 1_800_000_000_000;
  return {
    schema: "donstra.testimony.v1",
    agent: AGENT,
    nonce: "decision-001",
    evidence: [{
      uri: "https://example.com/pool.json",
      contentDigest: ZERO_DIGEST,
      observedAt: createdAt - 1_000,
      mediaType: "application/json",
    }],
    belief: "The pool is acceptable within the mandate.",
    confidenceBps: 8_600,
    mandate: { id: "treasury-v1", version: "1", constraints: { maxExposurePct: 15 } },
    proposedAction: {
      kind: "allocate",
      target: "0x2222222222222222222222222222222222222222",
      chainId: 61999,
      calldataDigest: ZERO_DIGEST,
      value: "0",
      deadline: createdAt + 60_000,
      parameters: { exposurePct: 12, pool: "USDC-A" },
    },
    createdAt,
    ...overrides,
  };
}
