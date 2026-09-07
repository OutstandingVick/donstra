# Live deployment runbook

Donstra deploys in source-to-destination order: GenLayer adjudicator first,
then the EVM settlement relay, which creates its authorized registry in the same
transaction. Never place private keys in `.env` files committed to Git.

## 1. Prepare the GenLayer account

```bash
npm ci
npx genlayer network set testnet-bradbury
npx genlayer account create --name default
npx genlayer account unlock
npx genlayer account
```

Choose the keystore password interactively and fund the displayed address with
testnet GEN. The deploy command will fail safely while the account is missing,
locked, or unfunded.

## 2. Deploy the adjudicator

```bash
npm run deploy:genlayer
```

Record both `contractAddress` and `transactionHash`. Wait until the transaction
is accepted or finalized in the GenLayer explorer before configuring the EVM
side.

## 3. Prepare an EVM deployer and reporter

Use a supported EVM testnet and encrypted Foundry keystores:

```bash
cast wallet import donstra-deployer --interactive
cast wallet import donstra-reporter --interactive
cast wallet address --account donstra-deployer
cast wallet address --account donstra-reporter
```

Fund the deployer with that network's test token. Copy `deploy/.env.example` to
an ignored local environment file and set the GenLayer address, exact GenLayer
network alias, reporter address, EVM RPC URL, and maximum source age.

## 4. Deploy relay and registry

Load only non-secret deployment variables, then broadcast with the encrypted
keystore. Replace the sender with the deployer address printed above.

```bash
set -a
source deploy/.env.local
set +a
npm run deploy:evm -- --rpc-url "$EVM_RPC_URL" --account donstra-deployer --sender 0xDEPLOYER
```

The `RegistryDeployed` event identifies the registry created by the relay. Save
the broadcast transaction hash, relay address, and registry address.

## 5. Verify both deployments

Copy `packages/relay/.env.example` to `packages/relay/.env.local`, fill in the
public addresses and RPC endpoints, and inject the reporter key only into the
operator process. The verifier checks bytecode, chain IDs, source bindings,
registry address, and quorum.

```bash
npm run verify:deployments
```

## 6. Relay a finalized verdict

Each reporter independently creates an artifact after checking the finalized
GenLayer transaction and stored verdict:

```bash
npm run build --workspace @donstra/relay
npm run relay --workspace @donstra/relay -- attest 0xRECEIPT 0xGENLAYER_TX > attestation.json
npm run relay --workspace @donstra/relay -- submit attestation.json
```

For a quorum larger than one, collect one artifact from each reporter and pass
all files to `submit`. The CLI rejects artifacts that describe different
settlements and sorts recovered signer addresses for the on-chain uniqueness
check.

## Deployment record

Publish only public data: network names, contract addresses, transaction hashes,
quorum, and explorer links. Do not publish reporter or deployer private keys,
keystore passwords, or RPC URLs containing provider credentials.
