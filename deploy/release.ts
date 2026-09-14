import { execFileSync } from "node:child_process";
import { getAddress, isHash } from "viem";
import { loadDeploymentPolicy } from "./config.js";
import { releaseFingerprint } from "./fingerprint.js";

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function hash(env: NodeJS.ProcessEnv, name: string): `0x${string}` {
  const value = required(env, name);
  if (!isHash(value)) throw new Error(`${name} must be a 32-byte transaction hash`);
  return value;
}

export function buildReleaseRecord(env: NodeJS.ProcessEnv = process.env) {
  const policy = loadDeploymentPolicy(env);
  return {
    version: 1,
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    sourceHashes: releaseFingerprint(),
    genLayer: {
      network: required(env, "GENLAYER_NETWORK"),
      adjudicator: getAddress(required(env, "GENLAYER_CONTRACT_ADDRESS")),
      deploymentTransaction: hash(env, "GENLAYER_DEPLOYMENT_TX"),
    },
    evm: {
      chainId: Number(required(env, "EVM_CHAIN_ID")),
      registry: getAddress(required(env, "REGISTRY_CONTRACT_ADDRESS")),
      relay: getAddress(required(env, "RELAY_CONTRACT_ADDRESS")),
      deploymentTransaction: hash(env, "EVM_DEPLOYMENT_TX"),
      deploymentBlock: required(env, "REGISTRY_DEPLOYMENT_BLOCK"),
    },
    policy: {
      reporters: policy.reporters,
      quorum: policy.quorum,
      maxSourceAgeSeconds: policy.maxSourceAgeSeconds.toString(),
      minimumAgentBondWei: policy.minimumAgentBondWei.toString(),
      minimumChallengeBondWei: policy.minimumChallengeBondWei.toString(),
      challengeWindowSeconds: policy.challengeWindowSeconds.toString(),
      adjudicationWindowSeconds: policy.adjudicationWindowSeconds.toString(),
    },
  };
}

if (process.argv[1]?.endsWith("release.ts")) {
  process.stdout.write(`${JSON.stringify(buildReleaseRecord(), null, 2)}\n`);
}
