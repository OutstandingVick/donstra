# Production operations

## Service ownership

Run each reporter in an independent account and failure domain. Never place two
quorum keys in the same secret store, deployment platform, or operator account.
Use a 2-of-3 quorum for the hackathon deployment and rotate a compromised
reporter by deploying a new immutable relay rather than pretending the old trust
set changed.

## Required alerts

- Reporter `/healthz` unavailable for two consecutive checks.
- Authentication failures exceed ten in five minutes.
- A challenged receipt has less than six hours before adjudication expiry.
- GenLayer finality observation fails repeatedly or returns a binding mismatch.
- EVM settlement reverts, remains pending for more than five minutes, or reaches
  a different chain than configured.
- RPC error rate exceeds five percent over ten minutes.

## Secrets

Inject deployer, reporter, and API credentials from a managed secret store.
Reporter containers run read-only, without Linux capabilities, and with outbound
network access limited to the configured GenLayer and EVM RPC hosts. Rotate API
tokens after the demo and immediately after any accidental disclosure.

## Incident response

1. Stop the affected reporter without deleting logs or local artifacts.
2. Confirm whether the remaining independent reporters still form quorum.
3. Publish the affected receipt IDs and stop accepting new commitments in the UI.
4. If a reporter key may be compromised, deploy a replacement relay and registry;
   the reporter set is deliberately immutable.
5. Reconcile every challenged receipt before restoring the public interface.

## Release evidence

For every deployment publish source commit, compiler version, constructor policy,
contract addresses, deployment transactions, reporter addresses, deployment
block, explorer links, and the output of `npm run verify:deployments`. Keep RPC
credentials, private keys, keystore passwords, and API tokens private.
