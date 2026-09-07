import { createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { settlementRelayAbi } from "./abi.js";
import { sortSettlementSignatures } from "./signing.js";
import type { RelayConfig } from "./config.js";
import type { Hex, SettlementPayload } from "./types.js";

export async function submitSettlement(
  config: RelayConfig,
  payload: SettlementPayload,
  signatures: Hex[],
): Promise<Hex | undefined> {
  const transport = http(config.evmRpcUrl);
  const publicClient = createPublicClient({ transport });
  const actualChainId = await publicClient.getChainId();
  if (actualChainId !== config.identity.targetChainId) {
    throw new Error(`EVM chain mismatch: expected ${config.identity.targetChainId}, received ${actualChainId}`);
  }

  const [processed, sourceContract, sourceChainId, quorum] = await Promise.all([
    publicClient.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "processed",
      args: [payload.receiptId],
    }),
    publicClient.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "sourceContract",
    }),
    publicClient.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "sourceChainId",
    }),
    publicClient.readContract({
      address: config.identity.relayContract,
      abi: settlementRelayAbi,
      functionName: "quorum",
    }),
  ]);

  if (processed) return undefined;
  if (sourceContract.toLowerCase() !== config.identity.sourceContract.toLowerCase()) {
    throw new Error("Relay source contract does not match operator configuration");
  }
  if (sourceChainId.toLowerCase() !== config.identity.sourceChainId.toLowerCase()) {
    throw new Error("Relay source chain does not match operator configuration");
  }
  if (signatures.length < quorum) throw new Error(`Settlement requires ${quorum} reporter signatures`);

  const sorted = await sortSettlementSignatures(signatures, payload, config.identity);
  const account = privateKeyToAccount(config.reporterPrivateKey);
  const chain = defineChain({
    id: actualChainId,
    name: `Donstra EVM ${actualChainId}`,
    nativeCurrency: { name: "Native token", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [config.evmRpcUrl] } },
  });
  const walletClient = createWalletClient({ account, chain, transport });
  const { request } = await publicClient.simulateContract({
    account,
    address: config.identity.relayContract,
    abi: settlementRelayAbi,
    functionName: "settle",
    args: [payload, sorted],
  });
  const transactionHash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash });
  if (receipt.status !== "success") throw new Error(`Settlement reverted: ${transactionHash}`);
  return transactionHash;
}
