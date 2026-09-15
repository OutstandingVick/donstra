"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleOff, LockKeyhole, Radio, Wallet } from "lucide-react";
import { DataField, DemoBanner, PageHeader, StatusBadge } from "../components/forensic-ui";
import { getProtocolAdapter } from "../lib/protocol";

export default function SettingsPage() {
  const adapter = getProtocolAdapter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletDetected, setWalletDetected] = useState(false);
  const config = adapter.getConfig();

  useEffect(() => {
    const provider = window.ethereum;
    queueMicrotask(() => setWalletDetected(Boolean(provider)));
    if (provider) void provider.request({ method: "eth_accounts" }).then((accounts) => setWalletAddress((accounts as string[])[0] ?? null)).catch(() => setWalletAddress(null));
  }, []);

  return <div className="mx-auto w-full max-w-[100rem]">
    <PageHeader eyebrow="Public configuration" title="Settings" description="Inspect browser-visible network and wallet state. Credentials and private operator values are never rendered." />
    <DemoBanner live={config.mode === "live"} />
    <div className="mt-8 grid gap-5 xl:grid-cols-2">
      <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby="network-settings"><div className="flex items-center gap-3 border-b border-white/10 p-5"><Radio size={18} className="text-[#4BED86]" aria-hidden="true" /><h2 id="network-settings" className="m-0 text-base font-semibold text-white">Network state</h2></div><dl className="m-0 divide-y divide-white/[0.07] px-5"><DataField label="Application mode" value={config.mode === "live" ? "Live registry" : "Demo dataset"} /><DataField label="EVM network" value={`${config.evmNetwork} · chain ${config.evmChainId}`} /><DataField label="Public RPC" value={config.evmRpcConfigured ? "Configured" : "Not configured"} /><DataField label="Registry" value={config.registryAddress ?? "Not deployed"} mono /><DataField label="Settlement relay" value={config.relayAddress ?? "Not deployed"} mono /><DataField label="GenLayer adjudicator" value={config.genLayerAddress ?? "Commitment-bound revision not deployed"} mono /></dl></section>
      <section className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]" aria-labelledby="wallet-settings"><div className="flex items-center gap-3 border-b border-white/10 p-5"><Wallet size={18} className="text-[#4BED86]" aria-hidden="true" /><h2 id="wallet-settings" className="m-0 text-base font-semibold text-white">Wallet state</h2></div><div className="p-5"><div className="flex items-center justify-between gap-4"><span className="text-sm text-white/60">Browser wallet</span><StatusBadge label={walletDetected ? "Detected" : "Not detected"} tone={walletDetected ? "good" : "neutral"} /></div><div className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4">{walletAddress ? <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#80F4A9]" aria-hidden="true" /> : <CircleOff size={17} className="mt-0.5 shrink-0 text-white/50" aria-hidden="true" />}<div><p className="m-0 text-sm font-semibold text-white/80">{walletAddress ? "Connected account detected" : "No connected account"}</p><p className="mb-0 mt-1 break-all font-mono text-xs leading-5 text-white/50">{walletAddress ?? "Connect only when a valid live lifecycle action requires a signature."}</p></div></div><div className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/55"><LockKeyhole size={17} className="mt-0.5 shrink-0" aria-hidden="true" /><p className="m-0">This view exposes only public addresses and connection state. RPC credentials, reporter keys, and operator tokens are excluded.</p></div></div></section>
    </div>
  </div>;
}
