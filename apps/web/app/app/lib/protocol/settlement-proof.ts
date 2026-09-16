import { decodeFunctionData, recoverTypedDataAddress, type Address, type Hex } from "viem";
import { settlementRelayCallAbi } from "./registry-abi";

const settlementTypes = { Settlement: [
  { name: "receiptId", type: "bytes32" },
  { name: "adjudicationTxHash", type: "bytes32" },
  { name: "verdict", type: "uint8" },
  { name: "adjudicatedAt", type: "uint64" },
  { name: "validUntil", type: "uint64" },
  { name: "sourceContract", type: "address" },
  { name: "sourceChainId", type: "bytes32" },
] } as const;

export async function recoverSettlementProof(input: Hex, identity: {
  chainId: number;
  relayAddress: Address;
  sourceContract: Address;
  sourceChainId: Hex;
}) {
  const decoded = decodeFunctionData({ abi: settlementRelayCallAbi, data: input });
  if (decoded.functionName !== "settle") throw new Error("Relay transaction is not a settlement call.");
  const [settlement, signatures] = decoded.args;
  const signers = await Promise.all(signatures.map((signature) => recoverTypedDataAddress({
    domain: { name: "Donstra Settlement Relay", version: "1", chainId: identity.chainId, verifyingContract: identity.relayAddress },
    types: settlementTypes,
    primaryType: "Settlement",
    message: { ...settlement, sourceContract: identity.sourceContract, sourceChainId: identity.sourceChainId },
    signature,
  })));
  return { settlement, signatures, signers };
}
