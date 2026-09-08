# Donstra EVM registry

The registry is the deterministic half of Donstra. It timestamps commitments,
escrows bonds, and acts as the executor so a receipt cannot be attached to a
different transaction after the fact.

`actionDigest` is `keccak256(abi.encode(chainid, target, value,
keccak256(calldata), deadline))`.

Action ETH must be supplied to `execute`; escrowed bonds never fund target
calls. Commitments can be cancelled after expiry, unchallenged executions can
finalize after the challenge window, and timed-out challenges refund both
parties. Resolutions use pull-based withdrawals. A reasonable verdict awards
the challenger bond to the agent, negligent or fabricated verdicts award both
bonds to the challenger, and inconclusive verdicts refund each party.
