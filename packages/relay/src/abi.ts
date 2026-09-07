export const settlementRelayAbi = [
  {
    type: "function",
    name: "settle",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "settlement",
        type: "tuple",
        components: [
          { name: "receiptId", type: "bytes32" },
          { name: "adjudicationTxHash", type: "bytes32" },
          { name: "verdict", type: "uint8" },
          { name: "adjudicatedAt", type: "uint64" },
          { name: "validUntil", type: "uint64" },
        ],
      },
      { name: "signatures", type: "bytes[]" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "processed",
    stateMutability: "view",
    inputs: [{ name: "receiptId", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "registry",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const;
