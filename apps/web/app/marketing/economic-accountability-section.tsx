import { BadgeDollarSign, Gavel, Scale, UsersRound, WalletCards } from "lucide-react";

const accountabilitySteps = [
  { label: "Agent bond", copy: "The agent puts capital behind the decision before it can act.", icon: WalletCards },
  { label: "Challenge", copy: "Anyone with valid grounds can dispute the decision during the open window.", icon: Scale },
  { label: "Challenger bond", copy: "The challenger also posts capital, discouraging empty or malicious disputes.", icon: BadgeDollarSign },
  { label: "Verdict", copy: "GenLayer judges the genuine testimony against its evidence, mandate, and action.", icon: Gavel },
  { label: "Reporter quorum", copy: "Independent reporters must agree before the verdict reaches settlement.", icon: UsersRound },
] as const;

export function EconomicAccountabilitySection() {
  return (
    <section id="economic-accountability" aria-labelledby="economic-accountability-title" className="scroll-mt-20 bg-[#101A0E] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(26rem,1.08fr)] lg:gap-24">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />Economic accountability</p>
            <h2 id="economic-accountability-title" className="mb-0 mt-7 max-w-[12ch] text-balance text-[clamp(3rem,6vw,6.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]">A verdict should change more than a label.</h2>
            <p className="mb-0 mt-8 max-w-[36rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">Donstra does not produce another AI opinion. It connects a verified decision record to money already placed at risk.</p>
          </div>

          <div className="border-y border-white/10">
            <ol className="m-0 list-none p-0" aria-label="Economic accountability process">
              {accountabilitySteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.label} className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:items-baseline sm:gap-6 ${index > 0 ? "border-t border-white/10" : ""}`}>
                    <span className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[#CFF8DC]"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span>
                    <h3 className="m-0 text-lg font-semibold text-[#F3F8F1]">{step.label}</h3>
                    <p className="col-start-2 m-0 text-base leading-7 text-[#B7C5B3]/70 sm:col-start-auto">{step.copy}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
