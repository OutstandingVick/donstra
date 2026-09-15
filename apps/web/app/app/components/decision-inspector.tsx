"use client";

import { useState, type KeyboardEvent } from "react";
import { CheckCircle2, ChevronDown, FileSearch, ShieldX } from "lucide-react";
import type { Scenario } from "../data/scenarios";

const tabs = ["Evidence", "Belief", "Mandate", "Proposed Action", "Executed Action"] as const;
type Tab = (typeof tabs)[number];

export function DecisionInspector({ scenario }: { scenario: Scenario }) {
  const [activeTab, setActiveTab] = useState<Tab>("Evidence");
  const pane = scenario.inspector[activeTab];

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + tabs.length) % tabs.length;
    setActiveTab(tabs[next]);
    document.getElementById(`inspector-tab-${next}`)?.focus();
  }

  return (
    <section className="mb-8 mt-12" aria-labelledby="inspector-title">
      <div className="mb-5">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Committed testimony</p>
        <h2 id="inspector-title" className="mb-0 mt-2 text-2xl font-semibold tracking-[-0.025em] text-white">Decision Inspector</h2>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A1109]">
        <div className="overflow-x-auto border-b border-white/10" role="tablist" aria-label="Decision evidence">
          <div className="flex min-w-max px-2">
            {tabs.map((tab, index) => {
              const active = activeTab === tab;
              return <button id={`inspector-tab-${index}`} key={tab} type="button" role="tab" aria-selected={active} aria-controls="inspector-panel" tabIndex={active ? 0 : -1} onKeyDown={(event) => moveTab(event, index)} onClick={() => setActiveTab(tab)} className={`relative min-h-12 px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4BED86] ${active ? "text-white" : "text-white/55 hover:text-white/70"}`}>{tab}{active && <span className="absolute inset-x-3 bottom-0 h-px bg-[#16DB65]" aria-hidden="true" />}</button>;
            })}
          </div>
        </div>
        <div id="inspector-panel" role="tabpanel" aria-labelledby={`inspector-tab-${tabs.indexOf(activeTab)}`} className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="p-5 sm:p-6">
            <div className="mb-6 flex items-start gap-3"><span className="mt-0.5 text-[#4BED86]"><FileSearch size={18} aria-hidden="true" /></span><p className="m-0 max-w-2xl text-pretty text-base leading-7 text-white/65">{pane.summary}</p></div>
            <dl className="m-0 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              {pane.fields.map((field) => <div key={field.label} className="min-w-0 bg-[#0D160B] p-4"><dt className="text-xs text-white/50">{field.label}</dt><dd className={`m-0 mt-2 break-words text-sm leading-6 ${field.value.startsWith("0x") ? "font-mono text-xs" : ""} ${field.emphasis === "danger" ? "text-[#FF9698]" : field.emphasis === "verified" ? "text-[#80F4A9]" : "text-white/75"}`}>{field.value}</dd></div>)}
            </dl>
            <details className="group mt-5 rounded-lg border border-white/10 bg-white/[0.02]">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4BED86]">View raw representation<ChevronDown size={16} className="transition-transform duration-150 group-open:[transform:rotate(180deg)]" aria-hidden="true" /></summary>
              <pre className="m-0 overflow-x-auto border-t border-white/10 p-4 font-mono text-xs leading-6 text-white/60"><code>{pane.raw}</code></pre>
            </details>
          </div>
          <aside className="border-t border-white/10 bg-white/[0.02] p-5 lg:border-s lg:border-t-0" aria-label="Binding status">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Verification</p>
            <ul className="mb-0 mt-5 grid list-none gap-4 p-0">
              <Status icon={<CheckCircle2 size={16} aria-hidden="true" />} label="Receipt bound" />
              <Status icon={<CheckCircle2 size={16} aria-hidden="true" />} label="Testimony bound" />
              <Status icon={<CheckCircle2 size={16} aria-hidden="true" />} label="Action bound" />
              <Status icon={<CheckCircle2 size={16} aria-hidden="true" />} label="Commitment time bound" />
              <Status icon={scenario.outcome.verdict === "Reasonable" ? <CheckCircle2 size={16} aria-hidden="true" /> : <ShieldX size={16} aria-hidden="true" />} label={scenario.outcome.verdict === "Reasonable" ? "Mandate compliant" : scenario.outcome.verdict === "Inconclusive" ? "Mandate unresolved" : "Mandate non-compliant"} danger={scenario.outcome.verdict !== "Reasonable"} />
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Status({ icon, label, danger = false }: { icon: React.ReactNode; label: string; danger?: boolean }) {
  return <li className={`flex items-center gap-3 text-sm ${danger ? "text-[#FF9698]" : "text-[#80F4A9]"}`}>{icon}<span>{label}</span></li>;
}
