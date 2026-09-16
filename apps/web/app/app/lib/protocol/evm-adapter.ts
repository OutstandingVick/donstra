import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  getAddress,
  http,
  type Hex as ViemHex,
} from "viem";
import { deploymentRecords } from "../../data/deployments";
import { protocolConfig, publicEndpoints } from "./config";
import { registryAbi, settlementRelayEventsAbi } from "./registry-abi";
import { recoverSettlementProof } from "./settlement-proof";
import { ensureWalletChain, requireCurrentLifecycleAction, requireSuccessfulTransaction } from "./transaction-safety";
import type { AgentRecord, LifecycleAction, ProtocolAdapter, ReceiptRecord, Verdict } from "./types";

const statusNames = ["cancelled", "committed", "executed", "challenged", "resolved", "cancelled"] as const;
const verdictNames: Verdict[] = ["reasonable", "negligent", "fabricated", "inconclusive"];
const zeroAddress = "0x0000000000000000000000000000000000000000";

export class EvmProtocolAdapter implements ProtocolAdapter {
  readonly mode = "live" as const;
  private readonly chain = defineChain({
    id: protocolConfig.evmChainId,
    name: protocolConfig.evmNetwork,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [publicEndpoints.rpcUrl!] } },
  });
  private readonly client = createPublicClient({ chain: this.chain, transport: http(publicEndpoints.rpcUrl!) });

  getConfig() {
    return { ...protocolConfig, walletAvailable: typeof window !== "undefined" && Boolean(window.ethereum) };
  }

  async listReceipts(): Promise<ReceiptRecord[]> {
    const registry = protocolConfig.registryAddress!;
    const [commits, executions, challenges, resolutions, relays, reporterEvents, requiredQuorum, sourceContract, sourceChainId, challengeWindow, adjudicationWindow, latestBlock] = await Promise.all([
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "TestimonyCommitted", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "ActionExecuted", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "Challenged", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "Resolved", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: protocolConfig.relayAddress!, abi: settlementRelayEventsAbi, eventName: "SettlementRelayed", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: protocolConfig.relayAddress!, abi: settlementRelayEventsAbi, eventName: "ReporterConfigured", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.readContract({ address: protocolConfig.relayAddress!, abi: [{ type: "function", name: "quorum", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] }], functionName: "quorum" }),
      this.client.readContract({ address: protocolConfig.relayAddress!, abi: [{ type: "function", name: "sourceContract", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] }], functionName: "sourceContract" }),
      this.client.readContract({ address: protocolConfig.relayAddress!, abi: [{ type: "function", name: "sourceChainId", stateMutability: "view", inputs: [], outputs: [{ type: "bytes32" }] }], functionName: "sourceChainId" }),
      this.client.readContract({ address: registry, abi: registryAbi, functionName: "challengeWindow" }),
      this.client.readContract({ address: registry, abi: registryAbi, functionName: "adjudicationWindow" }),
      this.client.getBlock({ blockTag: "latest" }),
    ]);
    const executedById = new Map(executions.map((log) => [log.args.receiptId, log]));
    const challengedById = new Map(challenges.map((log) => [log.args.receiptId, log]));
    const resolvedById = new Map(resolutions.map((log) => [log.args.receiptId, log]));
    const relayById = new Map(relays.map((log) => [log.args.receiptId, log]));
    const now = latestBlock.timestamp;

    return Promise.all(commits.slice().reverse().map(async (commit) => {
      const id = commit.args.receiptId!;
      const item = await this.client.readContract({ address: registry, abi: registryAbi, functionName: "commitments", args: [id] });
      const execution = executedById.get(id);
      const challenge = challengedById.get(id);
      const resolution = resolvedById.get(id);
      const relay = relayById.get(id);
      const relayTransaction = relay ? await this.client.getTransaction({ hash: relay.transactionHash }) : null;
      const proof = relayTransaction ? await recoverSettlementProof(relayTransaction.input, {
        chainId: this.chain.id, relayAddress: protocolConfig.relayAddress!, sourceContract, sourceChainId,
      }) : null;
      if (relay && proof && (proof.settlement.receiptId !== id || proof.settlement.adjudicationTxHash !== relay.args.adjudicationTxHash || proof.settlement.verdict !== relay.args.verdict || proof.signatures.length !== Number(relay.args.signerCount))) {
        throw new Error(`Settlement proof does not match relay event for ${id}`);
      }
      const settlementVerified = Boolean(relay && resolution && relay.transactionHash === resolution.transactionHash && proof);
      const verifiedSigners = settlementVerified && proof ? proof.signers.map((signer) => signer.toLowerCase()) : [];
      const status = statusNames[Number(item[11])] ?? "cancelled";
      const verdict = resolution ? verdictNames[Number(resolution.args.verdict)] ?? "pending" : "pending";
      const nextAction = status === "executed" && now <= item[6] + challengeWindow ? "challenge"
        : status === "executed" && now > item[6] + challengeWindow ? "finalize"
        : status === "challenged" && now > item[7] + adjudicationWindow ? "expire"
        : null;
      return {
        id,
        scenario: "live",
        source: "live",
        status,
        verdict,
        agent: item[0],
        challenger: item[10] === zeroAddress ? null : item[10],
        testimonyDigest: item[1],
        actionDigest: item[2],
        evidenceDigest: null,
        actionTransactionId: item[3] === `0x${"0".repeat(64)}` ? null : item[3],
        committedAt: new Date(Number(item[4]) * 1000).toISOString(),
        executedAt: item[6] ? new Date(Number(item[6]) * 1000).toISOString() : null,
        challengedAt: item[7] ? new Date(Number(item[7]) * 1000).toISOString() : null,
        resolvedAt: resolution?.blockNumber ? await this.blockTime(resolution.blockNumber) : null,
        agentBondWei: commit.args.bond!.toString(),
        challengeBondWei: challenge?.args.challengeBond?.toString() ?? "0",
        claimableWei: "0",
        bondRecipient: resolution?.args.bondRecipient ?? null,
        reporterQuorum: { required: Number(requiredQuorum), total: reporterEvents.length, verified: verifiedSigners.length },
        reporters: reporterEvents.map((event) => {
          const address = event.args.reporter!;
          const signerIndex = verifiedSigners.indexOf(address.toLowerCase());
          return { address, verified: signerIndex >= 0, signature: signerIndex >= 0 ? proof?.signatures[signerIndex] : undefined };
        }),
        transactions: [
          this.transaction("Commitment", commit.transactionHash, commit.blockNumber ? await this.blockTime(commit.blockNumber) : null),
          this.transaction("Execution", execution?.transactionHash ?? null, execution?.blockNumber ? await this.blockTime(execution.blockNumber) : null),
          this.transaction("Challenge", challenge?.transactionHash ?? null, challenge?.blockNumber ? await this.blockTime(challenge.blockNumber) : null),
          { label: "Adjudication", network: "GenLayer Studionet" as const, hash: relay?.args.adjudicationTxHash ?? null, timestamp: null, explorerUrl: null },
          this.transaction("Settlement", resolution?.transactionHash ?? null, resolution?.blockNumber ? await this.blockTime(resolution.blockNumber) : null),
        ],
        binding: { receipt: true, testimony: true, evidence: false, action: Boolean(execution), commitmentTime: true, futureKnowledge: "not-evaluated" },
        adjudicationReason: resolution ? "Resolved on the configured registry. Inspect the linked transactions for public proof." : "Awaiting a finalized protocol outcome.",
        nextAction,
        nextActionReason: nextAction ? "This is the only valid registry transition at the current chain time." : "No public registry transition is currently available.",
        metadata: { expiresAt: new Date(Number(item[5]) * 1000).toISOString() },
      } satisfies ReceiptRecord;
    }));
  }

  async getReceipt(id: string) {
    return (await this.listReceipts()).find((receipt) => receipt.id.toLowerCase() === id.toLowerCase()) ?? null;
  }

  async listAgents(): Promise<AgentRecord[]> {
    const receipts = await this.listReceipts();
    const grouped = new Map<string, ReceiptRecord[]>();
    for (const receipt of receipts) {
      const key = receipt.agent ?? "unknown";
      grouped.set(key, [...(grouped.get(key) ?? []), receipt]);
    }
    return [...grouped.entries()].map(([address, items]) => ({
      id: address,
      address: address === "unknown" ? null : getAddress(address),
      label: "Registered agent",
      commitments: items.length,
      verdicts: {
        reasonable: items.filter(({ verdict }) => verdict === "reasonable").length,
        negligent: items.filter(({ verdict }) => verdict === "negligent").length,
        fabricated: items.filter(({ verdict }) => verdict === "fabricated").length,
        inconclusive: items.filter(({ verdict }) => verdict === "inconclusive").length,
      },
      activeBondWei: items.filter(({ status }) => status !== "resolved").reduce((sum, item) => sum + BigInt(item.agentBondWei), 0n).toString(),
      recentReceiptIds: items.slice(0, 4).map(({ id }) => id),
    }));
  }

  async listDeployments() { return deploymentRecords; }

  async runLifecycleAction(
    action: LifecycleAction,
    receipt: ReceiptRecord,
    onSubmitted?: (transactionHash: ViemHex) => void,
  ) {
    if (action !== "challenge" && action !== "finalize" && action !== "expire" && action !== "withdraw") {
      throw new Error(`${action} requires sealed testimony or exact action parameters that are not available from this receipt view.`);
    }
    if (action !== "withdraw") {
      const current = await this.getReceipt(receipt.id);
      requireCurrentLifecycleAction(action, current?.nextAction ?? null);
    }
    if (!window.ethereum) throw new Error("Install an EIP-1193 wallet to submit this transaction.");
    if (!protocolConfig.registryAddress) throw new Error("The verified registry address is not configured.");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
    const account = getAddress(accounts[0]);
    await ensureWalletChain(window.ethereum, this.chain.id);
    const wallet = createWalletClient({ account, chain: this.chain, transport: custom(window.ethereum) });
    let transactionHash: ViemHex;
    if (action === "challenge") {
      const value = await this.client.readContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "minimumChallengeBond" });
      transactionHash = await wallet.writeContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "challenge", args: [receipt.id as ViemHex], value });
    } else if (action === "finalize") {
      transactionHash = await wallet.writeContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "finalizeUnchallenged", args: [receipt.id as ViemHex] });
    } else if (action === "expire") {
      transactionHash = await wallet.writeContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "expireChallenge", args: [receipt.id as ViemHex] });
    } else if (action === "withdraw") {
      const claimable = await this.client.readContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "claimable", args: [account] });
      if (claimable === 0n) throw new Error("This wallet has no claimable bond balance on the registry.");
      transactionHash = await wallet.writeContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "withdraw", args: [account] });
    } else {
      throw new Error("This lifecycle action is not available from the receipt view.");
    }
    onSubmitted?.(transactionHash);
    const confirmation = await this.client.waitForTransactionReceipt({ hash: transactionHash });
    requireSuccessfulTransaction(confirmation.status);
    return { transactionHash };
  }

  private transaction(label: string, hash: ViemHex | null, timestamp: string | null) {
    return { label, network: "Sepolia" as const, hash, timestamp, explorerUrl: hash ? `${publicEndpoints.evmExplorer}/tx/${hash}` : null };
  }

  private async blockTime(blockNumber: bigint) {
    const block = await this.client.getBlock({ blockNumber });
    return new Date(Number(block.timestamp) * 1000).toISOString();
  }
}
