export function requireSuccessfulTransaction(status: "success" | "reverted") {
  if (status !== "success") throw new Error("Transaction reverted onchain. No lifecycle transition was confirmed.");
}

type ChainProvider = { request(args: { method: string; params?: unknown[] }): Promise<unknown> };

export async function ensureWalletChain(provider: ChainProvider, expectedChainId: number) {
  const expectedHex = `0x${expectedChainId.toString(16)}`;
  const current = await provider.request({ method: "eth_chainId" });
  if (current !== expectedHex) {
    await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: expectedHex }] });
  }
  const confirmed = await provider.request({ method: "eth_chainId" });
  if (confirmed !== expectedHex) throw new Error(`Wallet is on the wrong network. Switch to chain ${expectedChainId} before submitting.`);
}
