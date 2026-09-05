"use client";

import { useState } from "react";

type Case = { id: string; agent: string; action: string; status: string; tone: string; hash: string; detail: string };
const cases: Case[] = [
  { id: "DS-1042", agent: "Treasury Agent 01", action: "12% → USDC-A", status: "Reasonable", tone: "good", hash: "0x87f2d45ad3ec090927bdc34e8f76c9cba91c", detail: "Evidence supports a low-volatility allocation within the 15% mandate." },
  { id: "DS-1043", agent: "Treasury Agent 01", action: "40% → MEME-X", status: "Negligent", tone: "warn", hash: "0xd41f719a6a273c39af115225e9ce07198e2b", detail: "The committed action exceeds the treasury mandate by 25 percentage points." },
  { id: "DS-1044", agent: "Treasury Agent 01", action: "Story rewritten", status: "Fabricated", tone: "bad", hash: "0x345cb1c4f85285b4a09fed72c6afb031610e", detail: "The revealed testimony digest differs from the timestamped commitment." },
];

declare global { interface Window { ethereum?: { request(args: { method: string }): Promise<string[]> } } }

export function WalletNav() {
  const [wallet, setWallet] = useState("");
  async function connect() {
    if (!window.ethereum) return setWallet("Wallet unavailable");
    const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWallet(`${address.slice(0, 6)}…${address.slice(-4)}`);
  }
  return <nav><a className="brand" href="#top">DONSTRA<span>•</span></a><div><a href="#protocol">Protocol</a><a href="#receipts">Receipts</a><button onClick={connect}>{wallet || "Connect wallet"}</button></div></nav>;
}

export function ReceiptDashboard() {
  const [selected, setSelected] = useState<Case>(cases[2]);
  const [stage, setStage] = useState(0);
  return (
    <section className="receipts" id="receipts">
      <header><div><p className="eyebrow">Receipt trail</p><h2>Three decisions. Three outcomes.</h2></div><span className="network">● GenLayer Studionet</span></header>
      <div className="case-grid">{cases.map((item) => <button type="button" key={item.id} className={`case ${item.tone} ${selected.id === item.id ? "selected" : ""}`} onClick={() => { setSelected(item); setStage(0); }}><div className="case-top"><span>{item.id}</span><span>{item.status}</span></div><p>{item.agent}</p><h3>{item.action}</h3><div className="hash">{item.hash.slice(0, 12)}…{item.hash.slice(-4)}</div><span className="open">Inspect receipt ↗</span></button>)}</div>
      <article className="receipt-detail" id="demo">
        <div><p className="eyebrow">Selected receipt / {selected.id}</p><h3>{selected.action}</h3><p>{selected.detail}</p><dl><div><dt>Committed</dt><dd>14:31:08 UTC</dd></div><div><dt>Action bound</dt><dd>14:31:11 UTC</dd></div><div><dt>Bond</dt><dd>0.001 GEN</dd></div><div><dt>Verdict</dt><dd>{selected.status}</dd></div></dl></div>
        <div className="verification"><p className="eyebrow">Challenge simulation</p>{["Commitment located", "Action binding verified", "Testimony revealed", selected.status === "Fabricated" ? "Hash mismatch detected" : "GenLayer consensus reached"].map((label, index) => <div className={index < stage ? "done" : ""} key={label}><span>{index < stage ? "✓" : index + 1}</span>{label}</div>)}<button onClick={() => setStage((current) => current >= 4 ? 0 : current + 1)}>{stage >= 4 ? "Reset proof" : "Run next check"}</button></div>
      </article>
    </section>
  );
}
