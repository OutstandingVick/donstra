export const registryAbi = [
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
  { type: "event", name: "ActionExecuted", inputs: [{ indexed: true, name: "receiptId", type: "bytes32" }, { indexed: true, name: "target", type: "address" }, { indexed: false, name: "actionTransactionId", type: "bytes32" }] },
  { type: "event", name: "Challenged", inputs: [{ indexed: true, name: "receiptId", type: "bytes32" }, { indexed: true, name: "challenger", type: "address" }, { indexed: false, name: "challengeBond", type: "uint256" }] },
  { type: "event", name: "Resolved", inputs: [{ indexed: true, name: "receiptId", type: "bytes32" }, { indexed: false, name: "verdict", type: "uint8" }, { indexed: false, name: "bondRecipient", type: "address" }] },
  {
    type: "function", name: "commitments", stateMutability: "view", inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "agent", type: "address" }, { name: "testimonyDigest", type: "bytes32" }, { name: "actionDigest", type: "bytes32" },
      { name: "actionTransactionId", type: "bytes32" }, { name: "committedAt", type: "uint64" }, { name: "expiresAt", type: "uint64" },
      { name: "executedAt", type: "uint64" }, { name: "challengedAt", type: "uint64" }, { name: "bond", type: "uint96" },
      { name: "challengeBond", type: "uint96" }, { name: "challenger", type: "address" }, { name: "status", type: "uint8" },
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

export const settlementRelayEventsAbi = [
  { type: "event", name: "SettlementRelayed", inputs: [
    { indexed: true, name: "receiptId", type: "bytes32" },
    { indexed: true, name: "adjudicationTxHash", type: "bytes32" },
    { indexed: false, name: "verdict", type: "uint8" },
    { indexed: false, name: "signerCount", type: "uint256" },
  ] },
  { type: "event", name: "ReporterConfigured", inputs: [
    { indexed: true, name: "reporter", type: "address" },
  ] },
] as const;
