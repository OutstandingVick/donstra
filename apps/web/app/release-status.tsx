const explorer = process.env.NEXT_PUBLIC_EVM_EXPLORER_URL ?? "https://sepolia.etherscan.io";
const registry = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS;
const relay = process.env.NEXT_PUBLIC_RELAY_ADDRESS;
const adjudicator = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS;
const genLayerExplorer = process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL ?? "https://explorer-studio.genlayer.com";
const quorum = process.env.NEXT_PUBLIC_REPORTER_QUORUM ?? "2-of-3";

export function ReleaseStatus() {
  const live = Boolean(registry && relay && adjudicator);
  return (
    <aside className="release-status" aria-label="Deployment status">
      <div><span className={live ? "status-dot live" : "status-dot"} /> <strong>{live ? "Live testnet release" : "Deployment in progress"}</strong></div>
      <div className="release-links">
        {adjudicator && <a href={`${genLayerExplorer}/address/${adjudicator}`} target="_blank" rel="noreferrer">Adjudicator ↗</a>}
        {relay && <a href={`${explorer}/address/${relay}`} target="_blank" rel="noreferrer">Relay ↗</a>}
        {registry && <a href={`${explorer}/address/${registry}`} target="_blank" rel="noreferrer">Registry ↗</a>}
        <span>Reporter quorum {quorum}</span>
      </div>
    </aside>
  );
}
