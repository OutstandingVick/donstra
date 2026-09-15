import { Check, Circle, FileWarning, LockKeyhole } from "lucide-react";
import type { Scenario } from "../data/scenarios";

export function ComparisonTraces({ scenario, visibleSteps }: { scenario: Scenario; visibleSteps: number }) {
  return (
    <section className="mt-12" aria-labelledby="comparison-title">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">Same incident, different proof</p>
          <h2 id="comparison-title" className="mb-0 mt-2 text-2xl font-semibold tracking-[-0.025em] text-white">Execution traces</h2>
        </div>
        <p className="m-0 max-w-lg text-sm leading-6 text-white/45">The traces diverge at the point where an explanation must become independently verifiable.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]">
        <div className="grid border-b border-white/10 md:grid-cols-2">
          <TraceHeading title="Without Donstra" detail="A plausible narrative, but no prior commitment" icon={<FileWarning size={18} aria-hidden="true" />} />
          <TraceHeading title="With Donstra" detail="A sealed, executable, challengeable record" icon={<LockKeyhole size={18} aria-hidden="true" />} accent />
        </div>
        <div className="grid md:grid-cols-2">
          <ol className="m-0 list-none p-0 md:border-e md:border-white/10">
            {scenario.withoutDonstra.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/[0.07] p-4 last:border-b-0 sm:p-5">
                <span className={`mt-0.5 grid size-7 place-items-center rounded-md border ${step.state === "unverifiable" ? "border-[#A94C4E]/40 bg-[#5C1A1B]/20 text-[#FF9698]" : "border-white/10 bg-white/[0.035] text-white/45"}`}>
                  {step.state === "unverifiable" ? <FileWarning size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}
                </span>
                <div><p className="m-0 text-sm font-semibold text-white/80">{index + 1}. {step.title}</p><p className="mb-0 mt-1 text-sm leading-6 text-white/40">{step.detail}</p></div>
              </li>
            ))}
          </ol>
          <ol className="m-0 list-none p-0">
            {scenario.withDonstra.map((step, index) => {
              const complete = index < visibleSteps;
              return (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-white/[0.07] p-4 last:border-b-0 sm:p-5">
                  <span className={`mt-0.5 grid size-7 place-items-center rounded-md border ${complete ? "border-[#16DB65]/30 bg-[#16DB65]/10 text-[#4BED86]" : "border-white/10 text-white/25"}`}>
                    {complete ? <Check size={14} aria-hidden="true" /> : <Circle size={10} aria-hidden="true" />}
                  </span>
                  <div className="min-w-0"><p className={`m-0 text-sm font-semibold ${complete ? "text-white/90" : "text-white/35"}`}>{index + 1}. {step.title}</p><p className="mb-0 mt-1 text-sm leading-6 text-white/40">{step.detail}</p>{step.proof && <p className="mb-0 mt-2 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-white/30" title={step.proof}>{step.proof}</p>}</div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TraceHeading({ title, detail, icon, accent = false }: { title: string; detail: string; icon: React.ReactNode; accent?: boolean }) {
  return <div className={`flex items-start gap-3 p-4 sm:p-5 ${accent ? "bg-[linear-gradient(110deg,rgba(22,219,101,0.09),rgba(92,26,27,0.08))]" : ""}`}><span className={accent ? "text-[#4BED86]" : "text-white/40"}>{icon}</span><div><h3 className="m-0 text-sm font-semibold uppercase tracking-[0.1em] text-white/85">{title}</h3><p className="mb-0 mt-1 text-sm text-white/40">{detail}</p></div></div>;
}
