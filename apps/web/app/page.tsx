const cases = [
  { id: "DS-1042", agent: "Treasury Agent 01", action: "12% → USDC-A", status: "Reasonable", tone: "good" },
  { id: "DS-1043", agent: "Treasury Agent 01", action: "40% → MEME-X", status: "Negligent", tone: "warn" },
  { id: "DS-1044", agent: "Treasury Agent 01", action: "Story rewritten", status: "Fabricated", tone: "bad" },
];

export default function Home() {
  return (
    <main>
      <nav><a className="brand" href="#top">DONSTRA<span>•</span></a><div><a href="#protocol">Protocol</a><a href="#receipts">Receipts</a><button>Connect wallet</button></div></nav>
      <section className="hero" id="top">
        <p className="eyebrow">Testimony integrity for the agentic economy</p>
        <h1>Proof before<br/><em>the action.</em></h1>
        <p className="lede">Any system can judge whether an agent&apos;s story sounds reasonable. Donstra proves the story existed before the outcome was known.</p>
        <div className="hero-actions"><a className="primary" href="#receipts">Inspect live receipts</a><a href="#protocol">See the protocol ↓</a></div>
        <div className="proof-strip"><span>Commit</span><b>→</b><span>Execute</span><b>→</b><span>Challenge</span><b>→</b><span>Verify</span><b>→</b><span>Adjudicate</span></div>
      </section>
      <section className="protocol" id="protocol">
        <div><p className="eyebrow">Two layers. One closed loop.</p><h2>Cryptography proves authenticity.<br/>GenLayer judges substance.</h2></div>
        <ol>
          <li><strong>01</strong><div><h3>Seal the testimony</h3><p>Evidence, belief, confidence, mandate, and exact action are committed before execution.</p></div></li>
          <li><strong>02</strong><div><h3>Bind the action</h3><p>The registry executes only the target, calldata, value, chain, and deadline in the commitment.</p></div></li>
          <li><strong>03</strong><div><h3>Resolve the challenge</h3><p>Hash mismatch ends instantly. Matching testimony proceeds to validator consensus.</p></div></li>
        </ol>
      </section>
      <section className="receipts" id="receipts">
        <header><div><p className="eyebrow">Receipt trail</p><h2>Three decisions. Three outcomes.</h2></div><span className="network">● GenLayer Studionet</span></header>
        <div className="case-grid">{cases.map((item) => <article key={item.id} className={item.tone}><div className="case-top"><span>{item.id}</span><span>{item.status}</span></div><p>{item.agent}</p><h3>{item.action}</h3><div className="hash">0x87f2…a91c</div><a href="#demo">Open receipt ↗</a></article>)}</div>
      </section>
      <footer><span>DONSTRA / AGENT TANK 2026</span><span>Commitment is evidence. Judgment is consensus.</span></footer>
    </main>
  );
}

