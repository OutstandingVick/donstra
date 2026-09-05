# Architecture

## Trust split

Donstra deliberately separates questions that require consensus from questions
that do not.

```text
agent → encrypted testimony → digest + bond → exact registry execution
                                                ↓ challenge
                                  deterministic digest verification
                                      mismatch ↙       ↘ match
                                  FABRICATED        GenLayer validators
                                                       ↓
                                REASONABLE / NEGLIGENT / INCONCLUSIVE
```

The EVM registry is the deterministic execution and collateral layer. The
GenLayer Intelligent Contract is the adjudication layer. The SDK coordinates
both without allowing AI output to decide whether bytes match.

## Commitment

`TestimonyPayload` includes a schema version, authenticated EVM agent, unique
nonce, content-addressed evidence, belief, confidence in basis points, versioned
mandate, exact proposed action, and creation time. Hashes are canonical and
domain-separated so a testimony digest cannot be replayed as an action digest.

The registry records chain time and executes the committed target, value, and
calldata itself. This removes the weakest version of the action-substitution
attack: merely attaching an unrelated transaction hash after the outcome.

## Evidence

Each evidence record includes its URI, raw-content SHA-256 digest, and observation
time. The GenLayer adapter re-fetches evidence, enforces a size limit, and rejects
content whose digest changed. Production deployments should add durable archival
storage for sources that are expected to mutate.

## Adjudication

The leader evaluates evidence against the mandate and commitment timestamp.
Validators independently repeat that evaluation and compare the verdict,
future-knowledge flag, and bounded confidence—not free-form prose.

## Settlement

The registry escrows the agent bond. A fabricated or negligent verdict sends it
to the challenger. Reasonable and inconclusive outcomes return it to the agent.
Production governance should add challenge bonds, timeouts, appeal routing, and
an authenticated GenLayer-to-registry relay.
