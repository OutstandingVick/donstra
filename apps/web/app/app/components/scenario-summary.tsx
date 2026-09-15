import { AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import type { Scenario } from "../data/scenarios";

export function ScenarioSummary({ scenario }: { scenario: Scenario }) {
  const violatesMandate = scenario.proposedExposure > scenario.mandateExposure;

  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#101B0E]" aria-labelledby="incident-title">
      <div className="h-px bg-gradient-to-r from-[#16DB65] via-[#16DB65]/35 to-[#5C1A1B]" />
      <div className="grid gap-8 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(30rem,0.85fr)] xl:items-center">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#4BED86]">{scenario.eyebrow}</p>
          <h2 id="incident-title" className="mb-0 mt-3 max-w-2xl text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl">{scenario.title}</h2>
          <p className="mb-0 mt-3 max-w-2xl text-pretty text-base leading-7 text-white/55">{scenario.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
          <Metric label="Agent confidence" value={`${scenario.confidence}%`} icon={<Gauge size={16} aria-hidden="true" />} />
          <Metric label="Mandate maximum" value={`${scenario.mandateExposure}%`} />
          <Metric label="Proposed exposure" value={`${scenario.proposedExposure}%`} danger={violatesMandate} />
        </div>
      </div>
      <div className={`flex flex-col gap-3 border-t px-5 py-4 text-sm sm:flex-row sm:items-center sm:px-6 ${violatesMandate ? "border-[#A94C4E]/30 bg-[#5C1A1B]/25 text-[#FFB7B7]" : "border-[#16DB65]/25 bg-[#16DB65]/10 text-[#80F4A9]"}`}>
        {violatesMandate ? <AlertTriangle size={18} className="shrink-0" aria-hidden="true" /> : <span className="size-2 shrink-0 rounded-full bg-[#4BED86]" />}
        <span className="font-semibold">{scenario.result}</span>
        <ArrowRight size={16} className="hidden text-white/50 sm:block" aria-hidden="true" />
        <span className="text-white/55">Confidence is recorded evidence, not permission to exceed policy.</span>
      </div>
    </section>
  );
}

function Metric({ label, value, icon, danger = false }: { label: string; value: string; icon?: React.ReactNode; danger?: boolean }) {
  return (
    <div className="min-w-0 bg-[#0D160B] p-4 sm:p-5">
      <p className="m-0 flex items-center gap-2 text-xs leading-5 text-white/55">{icon}{label}</p>
      <p className={`mb-0 mt-3 text-2xl font-semibold tabular-nums sm:text-3xl ${danger ? "text-[#FF9698]" : "text-white"}`}>{value}</p>
    </div>
  );
}
