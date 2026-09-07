import { createClient } from "genlayer-js";
import { createPublicClient, http } from "viem";
import { loadRelayConfig, settlementRelayAbi } from "../packages/relay/src/index.js";

async function main() {
  const config = loadRelayConfig();
  const evm = createPublicClient({ transport: http(config.evmRpcUrl) });
  const genlayer = createClient({ endpoint: config.genLayerRpcUrl });

  const [chainId, bytecode, registry, sourceContract, sourceChainId, quorum, genLayerCode] = await Promise.all([
    evm.getChainId(),
    evm.getCode({ address: config.identity.relayContract }),
    evm.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "registry",
    }),
    evm.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "sourceContract",
    }),
    evm.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "sourceChainId",
    }),
    evm.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "quorum",
    }),
    genlayer.getContractCode(config.identity.sourceContract),
  ]);

  if (chainId !== config.identity.targetChainId) throw new Error("Unexpected EVM chain ID");
  if (!bytecode || bytecode === "0x") throw new Error("Settlement relay has no deployed bytecode");
  if (!genLayerCode || genLayerCode === "0x") throw new Error("GenLayer adjudicator has no deployed code");
  if (sourceContract.toLowerCase() !== config.identity.sourceContract.toLowerCase()) {
    throw new Error("Relay references the wrong GenLayer adjudicator");
  }
  if (sourceChainId.toLowerCase() !== config.identity.sourceChainId.toLowerCase()) {
    throw new Error("Relay references the wrong GenLayer network");
  }

  process.stdout.write(`${JSON.stringify({
    genLayerNetwork: config.genLayerNetwork,
    genLayerAdjudicator: config.identity.sourceContract,
    evmChainId: chainId,
    settlementRelay: config.identity.relayContract,
    registry,
    quorum,
    verified: true,
  }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
