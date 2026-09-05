import {
  Donstra,
  MandateAdjudicator,
  MemoryCommitmentRegistry,
  MemoryTestimonyStore,
  type Hex,
  type TestimonyPayload,
} from "@donstra/sdk";

const cyan = (value: string) => `\x1b[36m${value}\x1b[0m`;
const green = (value: string) => `\x1b[32m${value}\x1b[0m`;
const red = (value: string) => `\x1b[31m${value}\x1b[0m`;
const digest = (byte: string) => `0x${byte.repeat(64)}` as Hex;
const agent = "0x1111111111111111111111111111111111111111" as const;

const store = new MemoryTestimonyStore();
const registry = new MemoryCommitmentRegistry();
const donstra = new Donstra({ store, registry, adjudicator: new MandateAdjudicator() });

function payload(nonce: string, exposurePct: number): TestimonyPayload {
  const createdAt = Date.now();
  return {
    schema: "donstra.testimony.v1",
    agent,
    nonce,
    evidence: [{
      uri: "https://example.com/treasury-snapshot.json",
      contentDigest: digest("a"),
      observedAt: createdAt - 1_000,
      label: "Treasury pool snapshot",
    }],
    belief: exposurePct > 15 ? "The exceptional yield justifies concentrated exposure." : "The stable pool fits the risk mandate.",
    confidenceBps: exposurePct > 15 ? 7_100 : 8_600,
    mandate: { id: "treasury-safe-v1", version: "1", constraints: { maxExposurePct: 15 } },
    proposedAction: {
      kind: "allocate",
      target: "0x2222222222222222222222222222222222222222",
      chainId: 61999,
      calldataDigest: digest("b"),
      value: "0",
      deadline: createdAt + 60_000,
      parameters: { pool: exposurePct > 15 ? "MEME-X" : "USDC-A", exposurePct },
    },
    createdAt,
  };
}

async function commitExecute(input: TestimonyPayload, txByte: string) {
  const commitment = await donstra.commitReasoning(input, 1_000_000_000_000_000n);
  console.log(`  commitment ${cyan(commitment.testimonyDigest)}`);
  await donstra.bindExecutedAction(commitment.receiptId, {
    transactionHash: digest(txByte),
    chainId: input.proposedAction.chainId,
    target: input.proposedAction.target,
    calldataDigest: input.proposedAction.calldataDigest,
    value: input.proposedAction.value,
    executedAt: Date.now(),
  });
  console.log(`  action bound ${cyan(digest(txByte))}`);
  return commitment;
}

async function main() {
  console.log("\nDONSTRA — prove the story existed before the action\n");

  console.log("ACT 1  Mandate-compliant decision");
  const safe = await commitExecute(payload("safe-001", 12), "c");
  console.log(`  verdict ${green((await donstra.revealOnChallenge(safe.receiptId)).verdict)}\n`);

  console.log("ACT 2  Genuine testimony, negligent action");
  const reckless = await commitExecute(payload("reckless-001", 40), "d");
  console.log(`  verdict ${red((await donstra.revealOnChallenge(reckless.receiptId)).verdict)}\n`);

  console.log("ACT 3  Separate receipt, story rewritten after execution");
  const original = payload("fabricated-001", 40);
  const fabricated = await commitExecute(original, "e");
  store.tamper(fabricated.receiptId, { ...original, belief: "I performed exhaustive safety checks before acting." });
  const verdict = await donstra.revealOnChallenge(fabricated.receiptId);
  console.log(`  hash matched: ${verdict.hashMatched}`);
  console.log(`  verdict ${red(verdict.verdict)}`);
  console.log("\nCryptography settles authenticity. GenLayer judges substance.\n");
}

await main();
