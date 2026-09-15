import { BrainCircuit, CircleAlert, FileQuestion, Gauge, RadioTower } from "lucide-react";

const failureStages = [
  { number: "01", title: "Model acts", copy: "An autonomous agent chooses and executes an action.", icon: BrainCircuit },
  { number: "02", title: "Outcome becomes known", copy: "Markets move, funds transfer, or the decision fails.", icon: RadioTower },
  { number: "03", title: "Explanation changes", copy: "A cleaner rationale can be produced with hindsight.", icon: FileQuestion },
  { number: "04", title: "Prior belief is missing", copy: "No durable record proves what the agent believed before acting.", icon: Gauge },
  { number: "05", title: "Nothing is enforceable", copy: "Without proof, responsibility cannot reach settlement.", icon: CircleAlert },
] as const;

export function FailureChain() {
  return (
    <ol className="m-0 grid list-none border-y border-white/10 p-0 lg:grid-cols-5" aria-label="The accountability gap in existing agent systems">
      {failureStages.map((stage, index) => {
        const Icon = stage.icon;
        return (
          <li key={stage.title} className={`relative min-w-0 px-1 py-7 lg:px-6 lg:py-8 ${index > 0 ? "border-t border-white/10 lg:border-s lg:border-t-0" : ""}`}>
            <div className="flex items-start gap-5 lg:block">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[#B7C5B3]"><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></span>
              <div className="min-w-0 lg:mt-12">
                <span className="font-mono text-xs text-[#16DB65]">{stage.number}</span>
                <h3 className="mb-0 mt-2 text-xl font-semibold tracking-[-0.025em] text-[#F3F8F1]">{stage.title}</h3>
                <p className="mb-0 mt-3 max-w-[25rem] text-base leading-7 text-[#B7C5B3]/70">{stage.copy}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
