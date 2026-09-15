import { protocolConfig } from "./config";
import { DemoProtocolAdapter } from "./demo-adapter";
import { EvmProtocolAdapter } from "./evm-adapter";
import type { ProtocolAdapter } from "./types";

let adapter: ProtocolAdapter | undefined;

export function getProtocolAdapter(): ProtocolAdapter {
  if (!adapter) adapter = protocolConfig.mode === "live" ? new EvmProtocolAdapter() : new DemoProtocolAdapter();
  return adapter;
}

export * from "./types";
