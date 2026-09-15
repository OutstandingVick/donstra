import { Check, Clock3, ExternalLink } from "lucide-react";
import type { TimelineStage } from "../data/scenarios";

export function ProtocolTimeline({ stages, completedStages }: { stages: TimelineStage[]; completedStages: number }) {
  return (
    <section className="mt-12" aria-labelledby="timeline-title">
      <div className="mb-5">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Protocol chronology</p>
        <h2 id="timeline-title" className="mb-0 mt-2 text-2xl font-semibold tracking-[-0.025em] text-white">Decision timeline</h2>
      </div>
      <ol className="m-0 grid list-none overflow-hidden rounded-xl border border-white/10 bg-[#0A1109] p-0 lg:grid-cols-6">
        {stages.map((stage, index) => {
          const complete = index < completedStages;
          return (
            <li key={stage.label} className="relative border-b border-white/10 p-4 last:border-b-0 sm:p-5 lg:border-b-0 lg:border-e lg:last:border-e-0">
              <div className="mb-5 flex items-center justify-between">
                <span className={`grid size-7 place-items-center rounded-md border ${complete ? "border-[#16DB65]/30 bg-[#16DB65]/10 text-[#4BED86]" : "border-white/10 text-white/45"}`}>{complete ? <Check size={14} aria-hidden="true" /> : <Clock3 size={14} aria-hidden="true" />}</span>
                <span className="font-mono text-xs text-white/45">0{index + 1}</span>
              </div>
              <h3 className={`m-0 text-sm font-semibold ${complete ? "text-white/90" : "text-white/50"}`}>{stage.label}</h3>
              <dl className="mb-0 mt-4 grid gap-3">
                <Data label="State" value={complete ? "Verified" : "Pending"} accent={complete} />
                <Data label="Timestamp" value={complete ? stage.timestamp : "—"} mono />
                <Data label="Network" value={stage.network} />
                <Data label="Duration" value={complete ? stage.duration : "—"} mono />
                <Data label="Transaction" value={complete ? stage.transactionHash : "Awaiting run"} mono />
              </dl>
              <button type="button" disabled={!complete} className="mt-5 flex min-h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-xs font-semibold text-white/55 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]" aria-label={`Open ${stage.label} transaction in explorer`}>
                Open explorer <ExternalLink size={13} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Data({ label, value, mono = false, accent = false }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return <div className="min-w-0"><dt className="text-xs text-white/50">{label}</dt><dd className={`m-0 mt-1 overflow-hidden text-ellipsis text-xs ${mono ? "font-mono" : ""} ${accent ? "text-[#80F4A9]" : "text-white/55"}`} title={value}>{value}</dd></div>;
}
