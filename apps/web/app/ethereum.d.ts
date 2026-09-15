import type { EIP1193Provider } from "viem";

type EthereumProvider = EIP1193Provider & {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
