import { getAddress, isAddress } from "viem";
import type { Address, PublicProtocolConfig } from "./types";

function publicAddress(value: string | undefined): Address | null {
  if (!value || !isAddress(value) || /^0x0{40}$/i.test(value)) return null;
  return getAddress(value);
}

const registryAddress = publicAddress(process.env.NEXT_PUBLIC_REGISTRY_ADDRESS);
const relayAddress = publicAddress(process.env.NEXT_PUBLIC_RELAY_ADDRESS);
const genLayerAddress = publicAddress(process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS);
const rpcUrl = process.env.NEXT_PUBLIC_EVM_RPC_URL?.trim();

export const protocolConfig: PublicProtocolConfig = {
  mode: registryAddress && relayAddress && genLayerAddress && rpcUrl ? "live" : "demo",
  evmChainId: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID ?? "11155111"),
  evmNetwork: Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID ?? "11155111") === 11155111 ? "Sepolia" : "Configured EVM",
  evmRpcConfigured: Boolean(rpcUrl && !rpcUrl.includes("replace-with")),
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
};
