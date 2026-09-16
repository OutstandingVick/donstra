import { getAddress, isAddress, isHash } from "viem";
import type { Address, PublicProtocolConfig } from "./types";

function publicAddress(value: string | undefined): Address | null {
  if (!value || !isAddress(value) || /^0x0{40}$/i.test(value)) return null;
  return getAddress(value);
}

const registryAddress = publicAddress(process.env.NEXT_PUBLIC_REGISTRY_ADDRESS);
const relayAddress = publicAddress(process.env.NEXT_PUBLIC_RELAY_ADDRESS);
const genLayerAddress = publicAddress(process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS);
const rpcUrl = process.env.NEXT_PUBLIC_EVM_RPC_URL?.trim();
const rpcConfigured = Boolean(rpcUrl && !rpcUrl.includes("replace-with"));
const deploymentTransaction = process.env.NEXT_PUBLIC_EVM_DEPLOYMENT_TX;
const sourceCommit = process.env.NEXT_PUBLIC_SOURCE_COMMIT?.trim();
const sourceFingerprint = process.env.NEXT_PUBLIC_SOURCE_FINGERPRINT?.trim();
const releaseRecorded = Boolean(deploymentTransaction && isHash(deploymentTransaction) && sourceCommit && sourceFingerprint);
const deploymentVerified = process.env.NEXT_PUBLIC_DEPLOYMENT_VERIFIED === "true";

export function isLiveReady(input: {
  registryAddress: Address | null;
  relayAddress: Address | null;
  genLayerAddress: Address | null;
  rpcConfigured: boolean;
  releaseRecorded: boolean;
  deploymentVerified: boolean;
}) {
  return Boolean(input.registryAddress && input.relayAddress && input.genLayerAddress && input.rpcConfigured && input.releaseRecorded && input.deploymentVerified);
}

export const protocolConfig: PublicProtocolConfig = {
  mode: isLiveReady({ registryAddress, relayAddress, genLayerAddress, rpcConfigured, releaseRecorded, deploymentVerified }) ? "live" : "demo",
  evmChainId: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID ?? "11155111"),
  evmNetwork: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID ?? "11155111") === 11155111 ? "Sepolia" : "Configured EVM",
  evmRpcConfigured: rpcConfigured,
  registryAddress,
  relayAddress,
  genLayerAddress,
  walletAvailable: false,
};

export const publicEndpoints = {
  rpcUrl: protocolConfig.evmRpcConfigured ? rpcUrl : undefined,
  evmExplorer: process.env.NEXT_PUBLIC_EVM_EXPLORER_URL ?? "https://sepolia.etherscan.io",
  genLayerExplorer: process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL ?? "https://explorer-studio.genlayer.com",
  deploymentBlock: BigInt(process.env.NEXT_PUBLIC_REGISTRY_DEPLOYMENT_BLOCK ?? "0"),
  deploymentTransaction: deploymentTransaction && isHash(deploymentTransaction) ? deploymentTransaction : null,
  sourceCommit: sourceCommit ?? null,
  sourceFingerprint: sourceFingerprint ?? null,
};
