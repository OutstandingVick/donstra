# Threat model

## What Donstra proves

- A specific testimony digest existed at the registry's chain timestamp.
- The committed agent authorized the commitment transaction.
- The registry executed the target, value, calldata, chain, and deadline bound
  into the action digest.
- A later reveal either matches the committed bytes or does not.
- GenLayer validators reached consensus on the reasonableness verdict.

## What it cannot prove

Donstra cannot directly prove that a language model internally “thought” the
committed text. No external protocol can observe a model's private causal state.
The defensible claim is contemporaneous commitment: the agent adopted this
testimony as its accountable basis before executing the action.

## Addressed attacks

- **Post-outcome rewrite:** digest mismatch produces `FABRICATED`.
- **Action substitution:** registry execution is restricted by `actionDigest`.
- **Cross-context replay:** schema and hash domains separate receipt classes.
- **Future evidence:** timestamps are an explicit validator decision field.
- **Storage loss:** classified `UNAVAILABLE`, not falsely accused as fabrication.
- **Prompt injection:** contract prompts mark testimony/evidence as untrusted data.
- **Escrow cross-subsidy:** action value must accompany execution and cannot be
  drawn from pooled accountability bonds.
- **Challenge spam:** challengers escrow collateral that is awarded to the agent
  after a reasonable verdict.
- **Stuck funds:** expiry, unchallenged, and adjudication-timeout paths terminate
  the lifecycle; recipients withdraw accrued balances separately.
- **Verdict substitution:** reporters compare the finalized GenLayer receipt,
  testimony digest, action digest, receipt ID, and commitment timestamp against
  the challenged EVM record before signing.

## Remaining production work

- Archive mutable evidence rather than relying only on refetching URLs.
- Rate-limit nonce grinding and define one commitment per mandate decision slot.
- Replace local encryption-key handling with audited KMS or threshold encryption.
- Audit arbitrary-call execution and reentrancy before holding meaningful value.
- Replace the hackathon reporter committee with a light-client or protocol-native
  GenLayer verification mechanism when one is production-supported.
