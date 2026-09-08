# Donstra

**Proof that an agent committed to its stated evidence and intent before taking a consequential action.**

Donstra closes the loop between agent testimony and adjudication:

1. Seal a timestamped evidence snapshot, belief, confidence, mandate, and action.
2. Commit only its digest and an accountability bond.
3. Execute the exact committed transaction through the registry.
4. Reveal on challenge and verify authenticity deterministically.
5. Ask GenLayer validators to judge the genuine testimony on substance.
6. Release or slash the bond and update the receipt trail.

Donstra does **not** claim to read an agent's hidden cognition. It proves prior
commitment to a specific testimony and exact action, preventing retrospective
rewrites and action substitution. See [the threat model](docs/THREAT_MODEL.md).

## Repository

| Path | Purpose |
|---|---|
| `packages/sdk` | Typed commit, execute, reveal lifecycle and encrypted storage |
| `packages/genlayer` | Live GenLayerJS adjudication adapter and evidence capture |
| `packages/relay` | Finality verification, EIP-712 attestations, and EVM settlement |
| `contracts/genlayer` | Python Intelligent Contract for validator consensus |
| `contracts/evm` | Bonded action-executing commitment registry |
| `demo` | Three-receipt terminal demonstration |
| `apps/web` | Interactive receipt and challenge dashboard |

## Run locally

```bash
npm install
npm test
npm run build
npm run demo
npm run dev
```

The web app runs at `http://localhost:3000`. GenLayer contract tests require
Python 3.12+ and the packages in `contracts/genlayer/requirements.txt`.

## Hackathon track

Primary: **Agentic Commerce Infrastructure**. Secondary fit: **AI Governance**
and **Onchain Justice**.

## Status

The repository contains the protocol implementation, hardened bond lifecycle,
commitment-bound GenLayer adjudication, authenticated 2-of-3-capable settlement,
reporter service, tests, demo, and live onchain dashboard. The initial GenLayer
contract is finalized on Studionet; the commitment-bound revision and EVM
contracts remain deployment gates requiring user-controlled funded signers.

See [the live deployment runbook](docs/DEPLOYMENT.md) for the secure GenLayer,
relay, registry, and verification sequence.
