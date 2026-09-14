import { getAddress, isAddress, zeroAddress, type Address } from "viem";

export interface DeploymentPolicy {
  reporters: Address[];
  quorum: number;
  maxSourceAgeSeconds: bigint;
  minimumAgentBondWei: bigint;
  minimumChallengeBondWei: bigint;
  challengeWindowSeconds: bigint;
  adjudicationWindowSeconds: bigint;
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function positive(env: NodeJS.ProcessEnv, name: string): bigint {
  const value = required(env, name);
  if (!/^[1-9][0-9]*$/.test(value)) throw new Error(`${name} must be a positive integer`);
  return BigInt(value);
}

export function loadDeploymentPolicy(env: NodeJS.ProcessEnv = process.env): DeploymentPolicy {
  const rawReporters = required(env, "REPORTER_ADDRESSES").split(",").map((value) => value.trim());
  if (rawReporters.length !== 3) throw new Error("Production deployment requires exactly three reporters");
  if (rawReporters.some((value) => !isAddress(value) || value.toLowerCase() === zeroAddress)) {
    throw new Error("REPORTER_ADDRESSES must contain three nonzero addresses");
  }
  const reporters = rawReporters.map((value) => getAddress(value));
  if (new Set(reporters.map((value) => value.toLowerCase())).size !== reporters.length) {
    throw new Error("Reporter addresses must be unique");
  }
  const quorum = Number(positive(env, "REPORTER_QUORUM"));
  if (quorum !== 2) throw new Error("Production deployment requires a 2-of-3 reporter quorum");

  return {
    reporters,
    quorum,
    maxSourceAgeSeconds: positive(env, "MAX_SOURCE_AGE_SECONDS"),
    minimumAgentBondWei: positive(env, "MINIMUM_AGENT_BOND_WEI"),
    minimumChallengeBondWei: positive(env, "MINIMUM_CHALLENGE_BOND_WEI"),
    challengeWindowSeconds: positive(env, "CHALLENGE_WINDOW_SECONDS"),
    adjudicationWindowSeconds: positive(env, "ADJUDICATION_WINDOW_SECONDS"),
  };
}
