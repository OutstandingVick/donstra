"use client";

import { useEffect, useRef, useState } from "react";
import { ComparisonTraces } from "./comparison-traces";
import { ConsoleHeader } from "./console-header";
import { DecisionInspector } from "./decision-inspector";
import { ProtocolTimeline } from "./protocol-timeline";
import { ScenarioSummary } from "./scenario-summary";
import { scenarios, type ScenarioKey } from "../data/scenarios";
import { recordDemoRun } from "../lib/protocol/demo-session";
import { ScenarioOutcome } from "./scenario-outcome";

export function LiveConsole() {
  const [selected, setSelected] = useState<ScenarioKey>("negligent");
  const [visibleSteps, setVisibleSteps] = useState(8);
  const [running, setRunning] = useState(false);
  const [generatedReceiptId, setGeneratedReceiptId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scenario = scenarios[selected];

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function selectScenario(next: ScenarioKey) {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(next);
    setVisibleSteps(8);
    setRunning(false);
    setGeneratedReceiptId(null);
  }

  function runScenario() {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisibleSteps(0);
    setRunning(true);
    setGeneratedReceiptId(null);
    let step = 0;
    timerRef.current = setInterval(() => {
      step += 1;
      setVisibleSteps(step);
      if (step >= 8) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setRunning(false);
        setGeneratedReceiptId(recordDemoRun(selected).id);
      }
    }, 450);
  }

  return (
    <div className="mx-auto w-full max-w-[100rem]">
      <ConsoleHeader selected={selected} running={running} onSelect={selectScenario} onRun={runScenario} />
      <div role="status" aria-live="polite" className="sr-only">{running ? `Running ${scenario.label} scenario. Step ${visibleSteps} of 8.` : `${scenario.label} scenario ready.`}</div>
      <ScenarioSummary scenario={scenario} />
      <ComparisonTraces scenario={scenario} visibleSteps={visibleSteps} />
      <ProtocolTimeline stages={scenario.timeline} completedStages={Math.min(visibleSteps, 6)} />
      {generatedReceiptId && <ScenarioOutcome scenario={scenario} receiptId={generatedReceiptId} />}
      <DecisionInspector scenario={scenario} />
    </div>
  );
}
