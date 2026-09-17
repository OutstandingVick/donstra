# Live deployment runbook

## Agent Tank Studio Next preview

The v0.3-compatible adjudicator source is
`contracts/genlayer/donstra_adjudicator_studio_dev.py`. It was deployed on
Studio Next / Studio-dev (chain ID 61997) for the Agent Tank submission:

- Contract: `0x36545935EF983B5A1ADb39dD68Ec90612AfA94E9`
- Deployment transaction: `0x53ae5b57c7a7ea1fdad268fc7049f9bd04de4d18be2b66c9272d314172331807`
- [Contract explorer](https://explorer-studio-dev.genlayer.com/address/0x36545935EF983B5A1ADb39dD68Ec90612AfA94E9)
- [Deployment transaction](https://explorer-studio-dev.genlayer.com/tx/0x53ae5b57c7a7ea1fdad268fc7049f9bd04de4d18be2b66c9272d314172331807)

This preview is separate from Studionet (61999) and the existing Sepolia
registry release. The public guided console still labels its scenario receipts
as demo data; deploying the preview adjudicator alone does not make those
receipts live on-chain executions or settlements.

## Current GenLayer Studionet deployment

The commitment-bound `DonstraAdjudicator` revision is finalized on Studionet
(chain ID 61999). This is a temporary demo deployment, not a Bradbury release:

- Contract: `0x76C076719ca2A3d08a4331154135Af48F43aDDC2`
- Deployment transaction: `0x7af961b4e1670deb843c29d37adb7fd9cac241c336f07bd76d07923b735f92cc`
- [Finalized transaction](https://explorer-studio.genlayer.com/tx/0x7af961b4e1670deb843c29d37adb7fd9cac241c336f07bd76d07923b735f92cc)
- [Contract explorer](https://explorer-studio.genlayer.com/address/0x76C076719ca2A3d08a4331154135Af48F43aDDC2)
- Source commit: `bbfd8ed3f2acb59c9e38f98d852efe68f5df4bba`
- Source SHA-256: `8a2ba8d2385564ce29758de462701c32e9c121f87b83215069f06edad72d1e94`

The remaining release steps below still require a separately verified EVM
deployment and independent reporter signers. Do not mark the app live from this
GenLayer deployment alone.

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

Record both `contractAddress` and `transactionHash`. The deployment command
waits for finalization; independently confirm that status in the GenLayer
explorer before configuring the EVM side.

## 3. Prepare an EVM deployer and reporter

Use Sepolia and separate encrypted Foundry keystores. A production-style demo
uses three independently controlled reporter keys and a two-signature quorum:

```bash
cast wallet import donstra-deployer --interactive
cast wallet address --account donstra-deployer
```

Fund the deployer with that network's test token. Copy `deploy/.env.example` to
an ignored local environment file and set the finalized GenLayer address, exact
network alias, comma-separated reporter addresses, quorum, bond policy, time
windows, EVM RPC URL, and maximum source age. Reporter keys must not be held by
the deployer or stored together.

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
the broadcast transaction hash, relay address, registry address, reporter set,
quorum, bond minimums, and timeout policy.

## 5. Verify both deployments

Copy `packages/relay/.env.example` to `packages/relay/.env.local`, fill in the
public addresses and RPC endpoints, and inject the reporter key only into the
operator process. The verifier checks bytecode, chain IDs, source bindings,
registry address, and quorum.

```bash
npm run verify:deployments
```

Only after this verifier passes, configure the public web release values in
`apps/web/.env.local`: the verified GenLayer, relay, and registry addresses;
public EVM RPC and explorer URLs; relay deployment transaction and registry
deployment block; source commit and fingerprint; and the three public reporter
addresses. Set `NEXT_PUBLIC_DEPLOYMENT_VERIFIED=true` only for that verified
release, then rebuild the static site. The web app stays in demo mode when the
release record is incomplete or the verification marker is absent. Do not put
reporter keys, wallet keys, API tokens, or private RPC credentials in
`NEXT_PUBLIC_` variables.

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

## 7. Run reporter services

Each reporter operator runs in a separate trust domain with its own key and API
token. The service exposes an unauthenticated `/healthz` endpoint and an
authenticated `POST /v1/attest` endpoint. It caps request bodies and concurrent
finality jobs, emits structured JSON logs, and shuts down gracefully.

```bash
docker build -f Dockerfile.relay -t donstra-relay .
docker run --read-only --cap-drop=ALL --env-file packages/relay/.env.local \
  -p 8787:8787 donstra-relay

curl -H "Authorization: Bearer $OPERATOR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiptId":"0x...","adjudicationTxHash":"0x..."}' \
  http://localhost:8787/v1/attest
```

Deploy at least two reporter instances under independent credentials for the
documented 2-of-3 policy. Alert on process restarts, repeated finality errors,
authentication failures, and challenges nearing their adjudication deadline.

## Deployment record

Publish only public data: network names, contract addresses, transaction hashes,
quorum, and explorer links. Do not publish reporter or deployer private keys,
keystore passwords, or RPC URLs containing provider credentials.
