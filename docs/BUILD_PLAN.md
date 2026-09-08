# Build plan and acceptance gates

## Complete

- [x] Typed, versioned testimony schema
- [x] Domain-separated canonical hashing
- [x] Validation and evidence provenance fields
- [x] AES-256-GCM sealed local store
- [x] Unique receipts and immutable stores
- [x] Exact action binding
- [x] Missing-data and tampering verdict separation
- [x] Bonded EVM commitment/execution registry
- [x] GenLayer evidence-vs-claim adjudicator
- [x] Independent validator decision comparison
- [x] GenLayerJS adapter and evidence digest verification
- [x] EIP-712 authenticated settlement relay with immutable reporter quorum
- [x] GenLayer finality observer and EVM submission operator
- [x] GenLayer and EVM deployment/verification tooling
- [x] Three-act demo using separate receipts
- [x] Interactive web receipt trail
- [x] SDK, Solidity, and GenLayer test suites
- [x] Escrow isolation between action value and accountability bonds
- [x] Challenge collateral, bounded windows, cancellation, and timeout recovery
- [x] Pull-based bond withdrawals
- [x] Multi-reporter deployment and policy verification
- [x] Cross-chain testimony, action, receipt, and timestamp binding
- [x] Live onchain dashboard with wallet-signed lifecycle actions

## Deployment gate

- [x] Deploy the initial `DonstraAdjudicator` to Studionet
- [ ] Deploy the commitment-bound `DonstraAdjudicator` revision to Studionet
- [ ] Deploy `DonstraRegistry` with the settlement relay as adjudicator
- [ ] Put addresses in `apps/web/.env.local`
- [ ] Run one real reasonable and one real negligent consensus transaction
- [ ] Record a sub-two-minute demo and publish the application

Deployment is intentionally not faked in source control. It requires a funded,
user-controlled deployer and produces externally verifiable transaction links.

## Production-ready hackathon gate

- [ ] Complete an independent smart-contract review and freeze deployment bytecode
- [ ] Configure three separate reporter keys with a 2-of-3 quorum
- [ ] Run live reasonable, negligent, fabricated, and timeout lifecycle cases
- [ ] Confirm the dashboard against deployed contracts in desktop and mobile browsers
- [ ] Deploy the relay operator with secret isolation, health checks, retries, and alerts
- [ ] Publish contract source, addresses, policy values, transaction links, and a status page
