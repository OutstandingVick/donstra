import { Braces, Check } from "lucide-react";

const proofBindings = [
  ["Testimony digest", "Canonical decision record"],
  ["Action digest", "Chain · target · value · calldata · deadline"],
  ["Commitment time", "Recorded before execution"],
  ["Settlement binding", "Final verdict determines bond outcome"],
] as const;

export function TechnicalProof() {
  return (
    <aside className="overflow-hidden rounded-xl border border-white/10 bg-[#091007]" aria-labelledby="technical-proof-title">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
        <Braces size={18} strokeWidth={1.5} className="text-[#16DB65]" aria-hidden="true" />
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#B7C5B3]/65">Technical proof</p>
          <h3 id="technical-proof-title" className="m-0 mt-1 text-base font-semibold text-[#F3F8F1]">What the commitment binds</h3>
        </div>
      </div>
      <dl className="m-0 divide-y divide-white/10 px-5 sm:px-6">
        {proofBindings.map(([term, detail]) => (
          <div key={term} className="grid gap-2 py-5 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-5">
            <dt className="flex items-center gap-2 text-sm font-semibold text-[#EAF2E7]"><Check size={15} strokeWidth={2} className="text-[#16DB65]" aria-hidden="true" />{term}</dt>
            <dd className="m-0 font-mono text-xs leading-6 text-[#D6E2D3]/60">{detail}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 border-t border-[#16DB65]/20 bg-[#16DB65]/[0.06] px-5 py-4 text-sm leading-6 text-[#CFF8DC] sm:px-6">Readable decision context first. Machine-verifiable bindings when proof is required.</p>
    </aside>
  );
}
