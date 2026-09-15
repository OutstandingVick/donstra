import { Play, ShieldAlert } from "lucide-react";
import { scenarioOrder, scenarios, type ScenarioKey } from "../data/scenarios";

type ConsoleHeaderProps = {
  selected: ScenarioKey;
  running: boolean;
  onSelect: (scenario: ScenarioKey) => void;
  onRun: () => void;
};

export function ConsoleHeader({ selected, running, onSelect, onRun }: ConsoleHeaderProps) {
  return (
    <section aria-labelledby="console-title">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#4BED86]"><ShieldAlert size={17} aria-hidden="true" />Guided investigation</div>
          <h1 id="console-title" className="m-0 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Live Console</h1>
          <p className="mb-0 mt-3 max-w-2xl text-pretty text-base leading-7 text-white/55">Follow one agent decision from sealed testimony to economic settlement. Every proof shown here is demo data in Phase 1.</p>
        </div>
        <button type="button" onClick={onRun} disabled={running} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#16DB65] px-5 text-sm font-semibold text-[#071006] transition-transform duration-150 active:[transform:scale(0.96)] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto">
          <Play size={17} fill="currentColor" aria-hidden="true" />
          {running ? "Running scenario…" : "Run scenario"}
        </button>
      </div>

      <div className="mt-8 border-b border-white/10">
        <div className="flex gap-1 overflow-x-auto pb-px" role="tablist" aria-label="Scenario">
          {scenarioOrder.map((key) => {
            const scenario = scenarios[key];
            const active = selected === key;
            return (
              <button key={key} type="button" role="tab" aria-selected={active} onClick={() => onSelect(key)} className={`relative min-h-11 shrink-0 px-4 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4BED86] ${active ? "text-white" : "text-white/55 hover:text-white/75"}`}>
                {scenario.label}
                {active && <span className="absolute inset-x-3 -bottom-px h-px bg-[#16DB65]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
