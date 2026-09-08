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
  {
    type: "function",
    name: "sourceContract",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "sourceChainId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "quorum",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "isReporter",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const registryAbi = [
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
  { type: "function", name: "minimumAgentBond", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint96" }] },
  { type: "function", name: "minimumChallengeBond", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint96" }] },
  { type: "function", name: "challengeWindow", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint64" }] },
  { type: "function", name: "adjudicationWindow", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint64" }] },
] as const;
