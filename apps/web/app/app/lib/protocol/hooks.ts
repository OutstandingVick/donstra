"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getProtocolAdapter } from ".";
import type { ActionPhase, AgentRecord, DeploymentRecord, Hex, LifecycleAction, ReceiptRecord } from "./types";

type LoadState<T> = { data: T; loading: boolean; error: string | null; refresh: () => Promise<void> };

function useAdapterData<T>(initial: T, loader: () => Promise<T>): LoadState<T> {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await loader());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load protocol data.");
    } finally {
      setLoading(false);
    }
  }, [loader]);
  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh };
}

export function useProtocolReceipts() {
  const adapter = useMemo(() => getProtocolAdapter(), []);
  const loader = useCallback(() => adapter.listReceipts(), [adapter]);
  return { ...useAdapterData<ReceiptRecord[]>([], loader), config: adapter.getConfig() };
}

export function useProtocolReceipt(id: string) {
  const adapter = useMemo(() => getProtocolAdapter(), []);
  const loader = useCallback(() => adapter.getReceipt(id), [adapter, id]);
  return { ...useAdapterData<ReceiptRecord | null>(null, loader), config: adapter.getConfig() };
}

export function useProtocolAgents() {
  const adapter = useMemo(() => getProtocolAdapter(), []);
  const loader = useCallback(() => adapter.listAgents(), [adapter]);
  return { ...useAdapterData<AgentRecord[]>([], loader), config: adapter.getConfig() };
}

export function useProtocolDeployments() {
  const adapter = useMemo(() => getProtocolAdapter(), []);
  const loader = useCallback(() => adapter.listDeployments(), [adapter]);
  return { ...useAdapterData<DeploymentRecord[]>([], loader), config: adapter.getConfig() };
}

export function useProtocolAction(onSuccess: () => Promise<void>) {
  const adapter = useMemo(() => getProtocolAdapter(), []);
  const [phase, setPhase] = useState<ActionPhase>("idle");
  const [message, setMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState<Hex | null>(null);

  const run = useCallback(async (action: LifecycleAction, receipt: ReceiptRecord) => {
    setPhase("confirm");
    setMessage("Confirm the transaction in your wallet.");
    setTransactionHash(null);
    try {
      setPhase("pending");
      setMessage("Transaction submitted. Waiting for confirmation.");
      const result = await adapter.runLifecycleAction(action, receipt);
      setTransactionHash(result.transactionHash);
      setPhase("success");
      setMessage("Transaction confirmed.");
      await onSuccess();
    } catch (cause) {
      setPhase("failure");
      setMessage(cause instanceof Error ? cause.message : "Transaction failed.");
    }
  }, [adapter, onSuccess]);

  return { phase, message, transactionHash, run };
}
