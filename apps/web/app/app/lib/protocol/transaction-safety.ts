export function requireSuccessfulTransaction(status: "success" | "reverted") {
  if (status !== "success") throw new Error("Transaction reverted onchain. No lifecycle transition was confirmed.");
}
