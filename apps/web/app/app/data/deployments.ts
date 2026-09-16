import type { DeploymentRecord } from "../lib/protocol/types";
import { protocolConfig, publicEndpoints } from "../lib/protocol/config";

export const deploymentRecords: DeploymentRecord[] = [
  {
    key: "genlayer",
    network: "GenLayer Studionet",
    status: "legacy",
    contractName: "DonstraAdjudicator",
    address: "0x8fa892db48782e95737DCf2a160686327BaE8cF6",
    deploymentTransaction: "0x98ba17c840ee4cedf06e8fe516d2089c944a7993949aa6f1068ea39c47b3285c",
    explorerUrl: "https://explorer-studio.genlayer.com/address/0x8fa892db48782e95737DCf2a160686327BaE8cF6",
    sourceCommit: "Predates commitment-bound revision",
    sourceFingerprint: null,
    policy: [
      { label: "Consensus", value: "5 of 5 validators agreed" },
      { label: "Release use", value: "Legacy reference only" },
    ],
  },
  {
    key: "sepolia",
    network: protocolConfig.evmNetwork,
    status: protocolConfig.mode === "live" ? "verified" : "pending",
    contractName: "DonstraSettlementRelay + DonstraRegistry",
    address: protocolConfig.relayAddress,
    deploymentTransaction: publicEndpoints.deploymentTransaction,
    explorerUrl: publicEndpoints.deploymentTransaction ? `${publicEndpoints.evmExplorer}/tx/${publicEndpoints.deploymentTransaction}` : null,
    sourceCommit: publicEndpoints.sourceCommit ?? "Not recorded",
    sourceFingerprint: publicEndpoints.sourceFingerprint,
    policy: [
      { label: "Reporter quorum", value: "2 of 3 required" },
      { label: "Reporter addresses", value: process.env.NEXT_PUBLIC_REPORTER_ADDRESSES ?? "Pending independent signers" },
      { label: "Challenge window", value: "Pending deployment configuration" },
      { label: "Adjudication window", value: "Pending deployment configuration" },
      { label: "Maximum source age", value: "Pending deployment configuration" },
    ],
  },
];
