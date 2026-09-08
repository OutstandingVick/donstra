import { createClient } from "genlayer-js";
import { createPublicClient, getAddress, http, type Address } from "viem";
import { loadRelayConfig, registryAbi, settlementRelayAbi } from "../packages/relay/src/index.js";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function positive(name: string): bigint {
  const value = required(name);
  if (!/^[1-9][0-9]*$/.test(value)) throw new Error(`${name} must be a positive integer`);
  return BigInt(value);
}

async function main() {
  const config = loadRelayConfig();
  const expectedReporters = required("REPORTER_ADDRESSES").split(",").map((value) => getAddress(value.trim()));
  const expectedQuorum = positive("REPORTER_QUORUM");
  const expectedPolicy = {
    minimumAgentBond: positive("MINIMUM_AGENT_BOND_WEI"),
    minimumChallengeBond: positive("MINIMUM_CHALLENGE_BOND_WEI"),
    challengeWindow: positive("CHALLENGE_WINDOW_SECONDS"),
    adjudicationWindow: positive("ADJUDICATION_WINDOW_SECONDS"),
  };
  if (expectedQuorum > BigInt(expectedReporters.length)) throw new Error("Reporter quorum exceeds reporter count");

  const evm = createPublicClient({ transport: http(config.evmRpcUrl) });
  const genlayer = createClient({ endpoint: config.genLayerRpcUrl });
  const [chainId, bytecode, registry, sourceContract, sourceChainId, quorum, genLayerCode] = await Promise.all([
    evm.getChainId(),
    evm.getCode({ address: config.identity.relayContract }),
    evm.readContract({ address: config.identity.relayContract, abi: settlementRelayAbi, functionName: "registry" }),
    evm.readContract({ address: config.identity.relayContract, abi: settlementRelayAbi, functionName: "sourceContract" }),
    evm.readContract({ address: config.identity.relayContract, abi: settlementRelayAbi, functionName: "sourceChainId" }),
    evm.readContract({ address: config.identity.relayContract, abi: settlementRelayAbi, functionName: "quorum" }),
    genlayer.getContractCode(config.identity.sourceContract),
  ]);

  if (chainId !== config.identity.targetChainId) throw new Error("Unexpected EVM chain ID");
  if (!bytecode || bytecode === "0x") throw new Error("Settlement relay has no deployed bytecode");
  if (!genLayerCode || genLayerCode === "0x") throw new Error("GenLayer adjudicator has no deployed code");
  if (sourceContract.toLowerCase() !== config.identity.sourceContract.toLowerCase()) throw new Error("Relay references the wrong GenLayer adjudicator");
  if (sourceChainId.toLowerCase() !== config.identity.sourceChainId.toLowerCase()) throw new Error("Relay references the wrong GenLayer network");
  if (BigInt(quorum) !== expectedQuorum) throw new Error("Relay quorum does not match deployment policy");

  const registryAddress = registry as Address;
  const [registryCode, minimumAgentBond, minimumChallengeBond, challengeWindow, adjudicationWindow, reporterChecks] = await Promise.all([
    evm.getCode({ address: registryAddress }),
    evm.readContract({ address: registryAddress, abi: registryAbi, functionName: "minimumAgentBond" }),
    evm.readContract({ address: registryAddress, abi: registryAbi, functionName: "minimumChallengeBond" }),
    evm.readContract({ address: registryAddress, abi: registryAbi, functionName: "challengeWindow" }),
    evm.readContract({ address: registryAddress, abi: registryAbi, functionName: "adjudicationWindow" }),
    Promise.all(expectedReporters.map((reporter) => evm.readContract({ address: config.identity.relayContract, abi: settlementRelayAbi, functionName: "isReporter", args: [reporter] }))),
  ]);

  if (!registryCode || registryCode === "0x") throw new Error("Registry has no deployed bytecode");
  if (minimumAgentBond !== expectedPolicy.minimumAgentBond) throw new Error("Unexpected minimum agent bond");
  if (minimumChallengeBond !== expectedPolicy.minimumChallengeBond) throw new Error("Unexpected minimum challenge bond");
  if (challengeWindow !== expectedPolicy.challengeWindow) throw new Error("Unexpected challenge window");
  if (adjudicationWindow !== expectedPolicy.adjudicationWindow) throw new Error("Unexpected adjudication window");
  if (reporterChecks.some((configured) => !configured)) throw new Error("Expected reporter is not authorized");

  process.stdout.write(`${JSON.stringify({
    genLayerNetwork: config.genLayerNetwork,
    genLayerAdjudicator: config.identity.sourceContract,
    evmChainId: chainId,
    settlementRelay: config.identity.relayContract,
    registry: registryAddress,
    reporters: expectedReporters,
    quorum: Number(quorum),
    policy: Object.fromEntries(Object.entries(expectedPolicy).map(([key, value]) => [key, value.toString()])),
    verified: true,
  }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
