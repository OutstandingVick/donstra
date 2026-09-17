import type { DeploymentRecord } from "../lib/protocol/types";
import { protocolConfig, publicEndpoints } from "../lib/protocol/config";

export const deploymentRecords: DeploymentRecord[] = [
  {
    key: "genlayer",
    network: "GenLayer Studionet",
    status: "verified",
    contractName: "DonstraAdjudicator (commitment-bound)",
    address: "0x76C076719ca2A3d08a4331154135Af48F43aDDC2",
    deploymentTransaction: "0x7af961b4e1670deb843c29d37adb7fd9cac241c336f07bd76d07923b735f92cc",
    explorerUrl: "https://explorer-studio.genlayer.com/address/0x76C076719ca2A3d08a4331154135Af48F43aDDC2",
    sourceCommit: "bbfd8ed3f2acb59c9e38f98d852efe68f5df4bba",
    sourceFingerprint: "0x8a2ba8d2385564ce29758de462701c32e9c121f87b83215069f06edad72d1e94",
    policy: [
      { label: "Consensus", value: "Finalized on Studionet" },
      { label: "Release use", value: "Demo only; EVM release pending" },
    ],
  },
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
      { label: "Challenge window", value: "86400 s (24 h)" },
      { label: "Adjudication window", value: "172800 s (48 h)" },
      { label: "Maximum source age", value: "86400 s (24 h)" },
    ],
  },
];
