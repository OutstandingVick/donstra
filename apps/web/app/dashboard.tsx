"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  formatEther,
  getAddress,
  http,
  type Address,
  type EIP1193Provider,
  type Hex,
} from "viem";

const registryAbi = [
  {
    type: "event", name: "TestimonyCommitted",
    inputs: [
      { indexed: true, name: "receiptId", type: "bytes32" },
      { indexed: true, name: "agent", type: "address" },
      { indexed: false, name: "testimonyDigest", type: "bytes32" },
      { indexed: false, name: "actionDigest", type: "bytes32" },
      { indexed: false, name: "bond", type: "uint256" },
    ],
  },
  {
    type: "event", name: "Resolved",
    inputs: [
      { indexed: true, name: "receiptId", type: "bytes32" },
      { indexed: false, name: "verdict", type: "uint8" },
      { indexed: false, name: "bondRecipient", type: "address" },
    ],
  },
  {
    type: "function", name: "commitments", stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "agent", type: "address" }, { name: "testimonyDigest", type: "bytes32" },
      { name: "actionDigest", type: "bytes32" }, { name: "actionTransactionId", type: "bytes32" },
      { name: "committedAt", type: "uint64" }, { name: "expiresAt", type: "uint64" },
      { name: "executedAt", type: "uint64" }, { name: "challengedAt", type: "uint64" },
      { name: "bond", type: "uint96" }, { name: "challengeBond", type: "uint96" },
      { name: "challenger", type: "address" }, { name: "status", type: "uint8" },
    ],
  },
  { type: "function", name: "minimumChallengeBond", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint96" }] },
  { type: "function", name: "challengeWindow", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint64" }] },
  { type: "function", name: "adjudicationWindow", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint64" }] },
  { type: "function", name: "claimable", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] },
  { type: "function", name: "challenge", stateMutability: "payable", inputs: [{ name: "receiptId", type: "bytes32" }], outputs: [] },
  { type: "function", name: "cancelExpired", stateMutability: "nonpayable", inputs: [{ name: "receiptId", type: "bytes32" }], outputs: [] },
  { type: "function", name: "finalizeUnchallenged", stateMutability: "nonpayable", inputs: [{ name: "receiptId", type: "bytes32" }], outputs: [] },
  { type: "function", name: "expireChallenge", stateMutability: "nonpayable", inputs: [{ name: "receiptId", type: "bytes32" }], outputs: [] },
  { type: "function", name: "withdraw", stateMutability: "nonpayable", inputs: [{ name: "recipient", type: "address" }], outputs: [] },
] as const;

const statuses = ["Unknown", "Committed", "Executed", "Challenged", "Resolved", "Cancelled"];
const verdicts = ["Reasonable", "Negligent", "Fabricated", "Inconclusive"];
const rpcUrl = process.env.NEXT_PUBLIC_EVM_RPC_URL;
const registryValue = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
const chainId = Number(process.env.NEXT_PUBLIC_EVM_CHAIN_ID ?? "11155111");
const deploymentBlock = BigInt(process.env.NEXT_PUBLIC_REGISTRY_DEPLOYMENT_BLOCK ?? "0");
const explorerUrl = process.env.NEXT_PUBLIC_EVM_EXPLORER_URL ?? "https://sepolia.etherscan.io";
const genLayerExplorer = process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL ?? "https://explorer-studio.genlayer.com";
const genLayerContract = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS ?? "0x8fa892db48782e95737DCf2a160686327BaE8cF6";

type EthereumProvider = EIP1193Provider & { request(args: { method: string; params?: unknown[] }): Promise<unknown> };
declare global { interface Window { ethereum?: EthereumProvider } }

type Receipt = {
  id: Hex; agent: Address; testimonyDigest: Hex; actionDigest: Hex; actionTransactionId: Hex;
  committedAt: bigint; expiresAt: bigint; executedAt: bigint; challengedAt: bigint;
  bond: bigint; challengeBond: bigint; challenger: Address; status: number;
  verdict?: number; transactionHash: Hex;
};

function short(value: string, head = 8): string { return `${value.slice(0, head)}…${value.slice(-4)}`; }
function tone(receipt: Receipt): string {
  if (receipt.verdict === 1 || receipt.verdict === 2) return "bad";
  if (receipt.status === 3) return "warn";
  return "good";
}

export function WalletNav() {
  const [wallet, setWallet] = useState("");
  async function connect() {
    if (!window.ethereum) return setWallet("Install wallet");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
    setWallet(short(accounts[0]));
  }
  return <nav><a className="brand" href="#top">DONSTRA<span>•</span></a><div><a href="#protocol">Protocol</a><a href="#receipts">Receipts</a><button onClick={connect}>{wallet || "Connect wallet"}</button></div></nav>;
}

export function ReceiptDashboard() {
  const registry = useMemo(() => {
    try { return registryValue ? getAddress(registryValue) : undefined; } catch { return undefined; }
  }, []);
  const chain = useMemo(() => defineChain({
    id: chainId, name: chainId === 11155111 ? "Sepolia" : `EVM ${chainId}`,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: rpcUrl ? [rpcUrl] : [] } },
  }), []);
  const client = useMemo(() => rpcUrl ? createPublicClient({ chain, transport: http(rpcUrl) }) : undefined, [chain]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedId, setSelectedId] = useState<Hex>();
  const [account, setAccount] = useState<Address>();
  const [claimable, setClaimable] = useState(0n);
  const [policy, setPolicy] = useState({ challengeBond: 0n, challengeWindow: 0n, adjudicationWindow: 0n });
  const [state, setState] = useState<"loading" | "ready" | "unconfigured" | "error">("loading");
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    if (!client || !registry) { setState("unconfigured"); return; }
    try {
      setState("loading");
      const [committed, resolved, challengeBond, challengeWindow, adjudicationWindow] = await Promise.all([
        client.getContractEvents({ address: registry, abi: registryAbi, eventName: "TestimonyCommitted", fromBlock: deploymentBlock }),
        client.getContractEvents({ address: registry, abi: registryAbi, eventName: "Resolved", fromBlock: deploymentBlock }),
        client.readContract({ address: registry, abi: registryAbi, functionName: "minimumChallengeBond" }),
        client.readContract({ address: registry, abi: registryAbi, functionName: "challengeWindow" }),
        client.readContract({ address: registry, abi: registryAbi, functionName: "adjudicationWindow" }),
      ]);
      const outcomes = new Map(resolved.map((log) => [log.args.receiptId, Number(log.args.verdict)]));
      const loaded = await Promise.all(committed.slice(-12).reverse().map(async (log) => {
        const id = log.args.receiptId!;
        const item = await client.readContract({ address: registry, abi: registryAbi, functionName: "commitments", args: [id] });
        return {
          id, agent: item[0], testimonyDigest: item[1], actionDigest: item[2], actionTransactionId: item[3],
          committedAt: item[4], expiresAt: item[5], executedAt: item[6], challengedAt: item[7],
          bond: item[8], challengeBond: item[9], challenger: item[10], status: Number(item[11]),
          verdict: outcomes.get(id), transactionHash: log.transactionHash,
        } satisfies Receipt;
      }));
      setReceipts(loaded);
      setSelectedId((current) => current && loaded.some(({ id }) => id === current) ? current : loaded[0]?.id);
      setPolicy({ challengeBond, challengeWindow, adjudicationWindow });
      if (account) setClaimable(await client.readContract({ address: registry, abi: registryAbi, functionName: "claimable", args: [account] }));
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load the registry");
      setState("error");
    }
  }, [account, client, registry]);

  useEffect(() => { void refresh(); }, [refresh]);
  const selected = receipts.find(({ id }) => id === selectedId);

  async function connectedWallet(): Promise<{ provider: EthereumProvider; address: Address }> {
    const provider = window.ethereum;
    if (!provider) throw new Error("Install an EIP-1193 wallet to continue");
    const accounts = await provider.request({ method: "eth_requestAccounts" }) as string[];
    const address = getAddress(accounts[0]);
    const currentChain = Number(await provider.request({ method: "eth_chainId" }));
    if (currentChain !== chainId) await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: `0x${chainId.toString(16)}` }] });
    setAccount(address);
    return { provider, address };
  }

  async function write(functionName: "challenge" | "cancelExpired" | "finalizeUnchallenged" | "expireChallenge" | "withdraw", args: readonly [Hex | Address], value?: bigint) {
    if (!registry || !client) return;
    try {
      setMessage("Confirm the transaction in your wallet…");
      const { provider, address } = await connectedWallet();
      const wallet = createWalletClient({ account: address, chain, transport: custom(provider) });
      let hash: Hex;
      if (functionName === "challenge") {
        hash = await wallet.writeContract({ address: registry, abi: registryAbi, functionName, args: [args[0] as Hex], value: value ?? 0n });
      } else if (functionName === "withdraw") {
        hash = await wallet.writeContract({ address: registry, abi: registryAbi, functionName, args: [args[0] as Address] });
      } else if (functionName === "cancelExpired") {
        hash = await wallet.writeContract({ address: registry, abi: registryAbi, functionName, args: [args[0] as Hex] });
      } else if (functionName === "finalizeUnchallenged") {
        hash = await wallet.writeContract({ address: registry, abi: registryAbi, functionName, args: [args[0] as Hex] });
      } else {
        hash = await wallet.writeContract({ address: registry, abi: registryAbi, functionName: "expireChallenge", args: [args[0] as Hex] });
      }
      setMessage(`Transaction submitted: ${short(hash)}`);
      await client.waitForTransactionReceipt({ hash });
      setMessage("Transaction confirmed.");
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Transaction failed"); }
  }

  const now = BigInt(Math.floor(Date.now() / 1000));
  const canChallenge = selected?.status === 2 && now <= selected.executedAt + policy.challengeWindow;
  const canCancel = selected?.status === 1 && now > selected.expiresAt && account?.toLowerCase() === selected.agent.toLowerCase();
  const canFinalize = selected?.status === 2 && now > selected.executedAt + policy.challengeWindow;
  const canExpire = selected?.status === 3 && now > selected.challengedAt + policy.adjudicationWindow;

  return (
    <section className="receipts" id="receipts">
      <header><div><p className="eyebrow">Live receipt trail</p><h2>Proof you can inspect onchain.</h2></div><span className="network">● {chain.name} + GenLayer Studionet</span></header>
      {state === "unconfigured" && <p className="notice">EVM deployment pending. The finalized <a href={`${genLayerExplorer}/address/${genLayerContract}`} target="_blank">GenLayer adjudicator</a> is live; set the public registry RPC and address after Sepolia deployment.</p>}
      {state === "error" && <p className="notice error">Live registry unavailable: {message}</p>}
      {state === "loading" && <p className="notice">Loading verified onchain receipts…</p>}
      {state === "ready" && receipts.length === 0 && <p className="notice">Registry connected. No commitments have been recorded yet.</p>}
      <div className="case-grid">{receipts.map((item) => <button type="button" key={item.id} className={`case ${tone(item)} ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}><div className="case-top"><span>{short(item.id)}</span><span>{item.verdict === undefined ? statuses[item.status] : verdicts[item.verdict]}</span></div><p>{short(item.agent, 10)}</p><h3>{statuses[item.status]}</h3><div className="hash">action {short(item.actionDigest, 12)}</div><span className="open">Inspect receipt ↗</span></button>)}</div>
      {selected && <article className="receipt-detail" id="demo">
        <div><p className="eyebrow">Selected receipt</p><h3>{selected.verdict === undefined ? statuses[selected.status] : verdicts[selected.verdict]}</h3><p>This record is read directly from the deployed Donstra registry.</p><dl><div><dt>Committed</dt><dd>{new Date(Number(selected.committedAt) * 1000).toISOString()}</dd></div><div><dt>Agent bond</dt><dd>{formatEther(selected.bond)} ETH</dd></div><div><dt>Agent</dt><dd>{short(selected.agent)}</dd></div><div><dt>Receipt</dt><dd>{short(selected.id)}</dd></div></dl><p className="explorer-links"><a href={`${explorerUrl}/tx/${selected.transactionHash}`} target="_blank">Commit transaction ↗</a><a href={`${explorerUrl}/address/${registry}`} target="_blank">Registry contract ↗</a></p></div>
        <div className="verification"><p className="eyebrow">Onchain actions</p><div className="done"><span>✓</span>Commitment located</div><div className={selected.status >= 2 ? "done" : ""}><span>{selected.status >= 2 ? "✓" : "2"}</span>Action execution bound</div><div className={selected.status >= 3 ? "done" : ""}><span>{selected.status >= 3 ? "✓" : "3"}</span>Challenge opened</div><div className={selected.status >= 4 ? "done" : ""}><span>{selected.status >= 4 ? "✓" : "4"}</span>Settlement resolved</div>
          {!account && <button onClick={() => void connectedWallet().then(({ address }) => setAccount(address)).then(refresh).catch((error) => setMessage(String(error)))}>Connect for actions</button>}
          {canChallenge && <button onClick={() => void write("challenge", [selected.id], policy.challengeBond)}>Challenge · {formatEther(policy.challengeBond)} ETH</button>}
          {canCancel && <button onClick={() => void write("cancelExpired", [selected.id])}>Cancel expired commitment</button>}
          {canFinalize && <button onClick={() => void write("finalizeUnchallenged", [selected.id])}>Finalize unchallenged</button>}
          {canExpire && <button onClick={() => void write("expireChallenge", [selected.id])}>Expire timed-out challenge</button>}
          {account && claimable > 0n && <button onClick={() => void write("withdraw", [account])}>Withdraw {formatEther(claimable)} ETH</button>}
          {message && <p className="tx-message">{message}</p>}
        </div>
      </article>}
    </section>
  );
}
