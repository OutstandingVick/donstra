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
- [x] Three-act demo using separate receipts
- [x] Interactive web receipt trail
- [x] SDK, Solidity, and GenLayer test suites

## Deployment gate

- [ ] Deploy `DonstraAdjudicator` to Studionet or Bradbury
- [ ] Deploy `DonstraRegistry` with the settlement relay as adjudicator
- [ ] Put addresses in `apps/web/.env.local`
- [ ] Run one real reasonable and one real negligent consensus transaction
- [ ] Record a sub-two-minute demo and publish the application

Deployment is intentionally not faked in source control. It requires a funded,
user-controlled deployer and produces externally verifiable transaction links.
