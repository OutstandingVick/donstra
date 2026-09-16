import { BrainCircuit, CircleAlert, FileLock2, FileQuestion, Gauge, RadioTower } from "lucide-react";

const failureStages = [
  { number: "01", title: "Model acts", copy: "An autonomous agent chooses and executes an action.", icon: BrainCircuit, place: "lg:col-start-1 lg:row-start-1" },
  { number: "02", title: "Outcome becomes known", copy: "Markets move, funds transfer, or the decision fails.", icon: RadioTower, place: "lg:col-start-3 lg:row-start-1" },
  { number: "03", title: "Explanation changes", copy: "A cleaner rationale can be produced with hindsight.", icon: FileQuestion, place: "lg:col-start-1 lg:row-start-2" },
  { number: "04", title: "Prior belief is missing", copy: "No durable record proves what the agent believed before acting.", icon: Gauge, place: "lg:col-start-2 lg:row-start-2 lg:h-[12rem] lg:min-h-0 lg:translate-y-20" },
  { number: "05", title: "Nothing is enforceable", copy: "Without proof, responsibility cannot reach settlement.", icon: CircleAlert, place: "lg:col-start-3 lg:row-start-2" },
] as const;

function FailurePanel({ stage }: { stage: (typeof failureStages)[number] }) {
  const Icon = stage.icon;
  const compact = stage.number === "04";
  return (
    <article className={`flex min-h-[16rem] flex-col rounded-2xl bg-[#101A0E] p-7 sm:p-8 ${compact ? "lg:p-6" : ""} ${stage.place}`}>
      <div className="flex items-start justify-between">
        <span className={`grid size-10 place-items-center rounded-full bg-white/[0.045] text-[#B7C5B3] ${compact ? "lg:hidden" : ""}`}><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span>
        <span className="font-mono text-xs text-[#16DB65]">{stage.number}</span>
      </div>
      <div className={`mt-auto pt-10 ${compact ? "lg:pt-3" : ""}`}>
        <h3 className={`m-0 max-w-[17rem] text-xl font-semibold leading-7 tracking-[-0.03em] text-[#F3F8F1] ${compact ? "lg:text-lg lg:leading-6" : ""}`}>{stage.title}</h3>
        <p className={`mb-0 mt-3 max-w-[23rem] text-sm leading-6 text-[#B7C5B3]/65 ${compact ? "lg:mt-1 lg:text-xs lg:leading-5" : ""}`}>{stage.copy}</p>
      </div>
    </article>
  );
}

function TestimonyArtifact() {
  return (
    <article className="relative flex min-h-[28rem] flex-col overflow-hidden rounded-2xl bg-[#111B0F] p-7 sm:p-8 lg:col-start-2 lg:row-start-1 lg:h-[29rem]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#16DB65] to-[#5C1A1B]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-8 top-16 h-48 bg-[radial-gradient(ellipse_at_center,rgba(22,219,101,0.11),transparent_68%)]" aria-hidden="true" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#16DB65]">Before action</p>
          <h3 className="mb-0 mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#F3F8F1]">Testimony artifact</h3>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-[#16DB65]/10 text-[#81ECAB]"><FileLock2 size={19} strokeWidth={1.5} aria-hidden="true" /></span>
      </div>

      <div className="relative my-auto rounded-xl bg-[#091007] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#D6E2D3]/50">DECISION RECORD</span>
          <span className="size-2 rounded-full bg-[#16DB65] shadow-[0_0_14px_rgba(22,219,101,0.7)]" />
        </div>
        <dl className="m-0 mt-2 divide-y divide-white/[0.07]">
          {[
            ["Evidence", "2 referenced records"],
            ["Belief", "Committed before outcome"],
            ["Mandate", "Bound to exact action"],
          ].map(([term, value]) => (
            <div key={term} className="flex items-center justify-between gap-5 py-3">
              <dt className="text-xs text-[#B7C5B3]/55">{term}</dt>
              <dd className="m-0 text-right font-mono text-[0.65rem] text-[#EAF2E7]/75">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-[#16DB65] to-[#5C1A1B]" />
      </div>

      <div className="relative flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.12em]">
        <span className="text-[#D6E2D3]/45">0x8dd6…31ae</span>
        <span className="text-[#81ECAB]">SEALED</span>
      </div>
    </article>
  );
}

export function FailureChain() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:grid-rows-[24rem_17rem]" aria-label="The accountability gap in existing agent systems">
      <FailurePanel stage={failureStages[0]} />
      <FailurePanel stage={failureStages[1]} />
      <FailurePanel stage={failureStages[2]} />
      <TestimonyArtifact />
      <FailurePanel stage={failureStages[3]} />
      <FailurePanel stage={failureStages[4]} />
    </div>
  );
}
