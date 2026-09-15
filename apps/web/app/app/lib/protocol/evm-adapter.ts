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
import { registryAbi } from "./registry-abi";
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
    const [commits, executions, challenges, resolutions, challengeWindow, adjudicationWindow] = await Promise.all([
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "TestimonyCommitted", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "ActionExecuted", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "Challenged", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.getContractEvents({ address: registry, abi: registryAbi, eventName: "Resolved", fromBlock: publicEndpoints.deploymentBlock }),
      this.client.readContract({ address: registry, abi: registryAbi, functionName: "challengeWindow" }),
      this.client.readContract({ address: registry, abi: registryAbi, functionName: "adjudicationWindow" }),
    ]);
    const executedById = new Map(executions.map((log) => [log.args.receiptId, log]));
    const challengedById = new Map(challenges.map((log) => [log.args.receiptId, log]));
    const resolvedById = new Map(resolutions.map((log) => [log.args.receiptId, log]));
    const now = BigInt(Math.floor(Date.now() / 1000));

    return Promise.all(commits.slice().reverse().map(async (commit) => {
      const id = commit.args.receiptId!;
      const item = await this.client.readContract({ address: registry, abi: registryAbi, functionName: "commitments", args: [id] });
      const execution = executedById.get(id);
      const challenge = challengedById.get(id);
      const resolution = resolvedById.get(id);
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
        resolvedAt: null,
        agentBondWei: item[8].toString(),
        challengeBondWei: item[9].toString(),
        claimableWei: "0",
        bondRecipient: resolution?.args.bondRecipient ?? null,
        reporterQuorum: { required: 2, total: 3, verified: resolution ? 2 : 0 },
        reporters: [],
        transactions: [
          this.transaction("Commitment", commit.transactionHash, commit.blockNumber ? await this.blockTime(commit.blockNumber) : null),
          this.transaction("Execution", execution?.transactionHash ?? null, execution?.blockNumber ? await this.blockTime(execution.blockNumber) : null),
          this.transaction("Challenge", challenge?.transactionHash ?? null, challenge?.blockNumber ? await this.blockTime(challenge.blockNumber) : null),
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
    if (!window.ethereum) throw new Error("Install an EIP-1193 wallet to submit this transaction.");
    if (!protocolConfig.registryAddress) throw new Error("The verified registry address is not configured.");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
    const account = getAddress(accounts[0]);
    const currentChain = Number(await window.ethereum.request({ method: "eth_chainId" }));
    if (currentChain !== this.chain.id) await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: `0x${this.chain.id.toString(16)}` }] });
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
      transactionHash = await wallet.writeContract({ address: protocolConfig.registryAddress, abi: registryAbi, functionName: "withdraw", args: [account] });
    } else {
      throw new Error(`${action} requires sealed testimony or exact action parameters that are not available from this receipt view.`);
    }
    onSubmitted?.(transactionHash);
    await this.client.waitForTransactionReceipt({ hash: transactionHash });
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
