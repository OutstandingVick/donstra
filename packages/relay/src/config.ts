import { isAddress, isHex, keccak256, toBytes, zeroAddress } from "viem";
import type { Address, Hex, RelayIdentity } from "./types.js";

export interface RelayConfig {
  genLayerNetwork: string;
  genLayerRpcUrl: string;
  evmRpcUrl: string;
  identity: RelayIdentity;
  reporterPrivateKey: Hex;
  attestationTtlSeconds: bigint;
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function rpcUrl(value: string, name: string): string {
  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`${name} must use HTTP or HTTPS`);
  }
  return parsed.toString();
}

function address(value: string, name: string): Address {
  if (!isAddress(value) || value.toLowerCase() === zeroAddress) {
    throw new Error(`${name} must be a nonzero EVM address`);
  }
  return value;
}

function privateKey(value: string): Hex {
  if (!isHex(value) || value.length !== 66) throw new Error("REPORTER_PRIVATE_KEY must be 32 bytes");
  return value;
}

function positiveInteger(value: string, name: string): bigint {
  if (!/^[1-9][0-9]*$/.test(value)) throw new Error(`${name} must be a positive integer`);
  return BigInt(value);
}

export function loadRelayConfig(env: NodeJS.ProcessEnv = process.env): RelayConfig {
  const network = required(env, "GENLAYER_NETWORK");
  const targetChainId = Number(positiveInteger(required(env, "EVM_CHAIN_ID"), "EVM_CHAIN_ID"));
  if (!Number.isSafeInteger(targetChainId)) throw new Error("EVM_CHAIN_ID is outside the safe integer range");

  return {
    genLayerNetwork: network,
    genLayerRpcUrl: rpcUrl(required(env, "GENLAYER_RPC_URL"), "GENLAYER_RPC_URL"),
    evmRpcUrl: rpcUrl(required(env, "EVM_RPC_URL"), "EVM_RPC_URL"),
    identity: {
      sourceContract: address(required(env, "GENLAYER_CONTRACT_ADDRESS"), "GENLAYER_CONTRACT_ADDRESS"),
      sourceChainId: keccak256(toBytes(network)),
      targetChainId,
      relayContract: address(required(env, "RELAY_CONTRACT_ADDRESS"), "RELAY_CONTRACT_ADDRESS"),
    },
    reporterPrivateKey: privateKey(required(env, "REPORTER_PRIVATE_KEY")),
    attestationTtlSeconds: positiveInteger(env.ATTESTATION_TTL_SECONDS ?? "3600", "ATTESTATION_TTL_SECONDS"),
  };
}
