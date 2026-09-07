# ADR 001: Authenticated GenLayer settlement relay

## Status

Accepted for the hackathon deployment.

## Context

GenLayer reaches consensus over Donstra testimony, while the accountability bond
is held by an EVM registry. The EVM cannot safely trust an arbitrary process that
claims a GenLayer verdict, and the current hackathon networks do not expose a
native, trustless GenLayer-to-EVM message bridge.

## Decision

Donstra uses a narrowly scoped EIP-712 attestation relay:

- A fixed reporter set independently reads the finalized GenLayer transaction
  and stored verdict.
- A configurable quorum signs the same settlement payload.
- The payload binds the GenLayer network, adjudicator contract, adjudication
  transaction, Donstra receipt, verdict, source timestamp, target chain, and
  relay contract.
- The relay verifies ordered, unique reporter signatures and marks each receipt
  as processed before asking the registry to resolve it.
- The relay creates its registry during construction, removing the circular
  deployment dependency and making the authorized adjudicator unambiguous.

For the live hackathon demonstration the quorum may be one reporter, but the
contract supports a larger immutable reporter set without an upgrade or owner.
The UI and documentation must disclose the active quorum.

## Security consequences

EIP-712 domain separation prevents signatures from being replayed on another
chain or relay. Binding the source contract and transaction prevents a valid
verdict from being reassigned to another receipt. Ordered signers prevent
duplicate signatures from satisfying quorum. An expiry bounds the time for
which a leaked signature is useful.

This bridge is authenticated, not trustless: a quorum can still attest to a
false source observation. Production should replace the reporters with a native
light-client or canonical bridge when GenLayer exposes one.
