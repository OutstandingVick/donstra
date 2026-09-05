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

## Remaining production work

- Make the EVM settlement relay trust-minimized across GenLayer and the registry.
- Add commitment cancellation/expiry and challenge-response timeouts.
- Require challenger collateral to discourage spam.
- Archive mutable evidence rather than relying only on refetching URLs.
- Rate-limit nonce grinding and define one commitment per mandate decision slot.
- Replace local encryption-key handling with audited KMS or threshold encryption.
- Audit arbitrary-call execution and reentrancy before holding meaningful value.
