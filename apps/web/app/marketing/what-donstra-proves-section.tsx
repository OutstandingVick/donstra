import { Check, EyeOff } from "lucide-react";

const provenFacts = [
  "What testimony was committed before execution",
  "Which evidence the testimony referenced",
  "The disclosed confidence and governing mandate",
  "The exact action the agent proposed",
  "Whether disclosed testimony matches the commitment",
  "Whether execution matches the committed action",
  "What adjudication verdict was reached",
] as const;

export function WhatDonstraProvesSection() {
  return (
    <section id="what-donstra-proves" aria-labelledby="what-donstra-proves-title" className="scroll-mt-20 border-y border-white/10 bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,1.1fr)] lg:gap-24">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />What Donstra proves</p>
            <h2 id="what-donstra-proves-title" className="mb-0 mt-7 max-w-[11ch] text-balance text-[clamp(3rem,6vw,6.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]">Not mind-reading. Evidence.</h2>
            <div className="mt-10 flex max-w-[37rem] items-start gap-4 border-s-2 border-[#5C1A1B] ps-5 sm:ps-7">
              <EyeOff size={21} strokeWidth={1.5} className="mt-1 shrink-0 text-[#E4A4A5]" aria-hidden="true" />
              <p className="m-0 text-lg leading-8 text-[#EEDADA]/80">Donstra does not inspect hidden model cognition or claim access to an agent’s private chain of thought. It verifies the testimony the agent chose to commit.</p>
            </div>
          </div>

          <div className="border-t border-white/10">
            <ul className="m-0 list-none p-0" aria-label="Facts Donstra proves">
              {provenFacts.map((fact, index) => (
                <li key={fact} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-white/10 py-5 sm:py-6">
                  <span className="grid size-8 place-items-center rounded-md border border-[#16DB65]/25 bg-[#16DB65]/[0.06] text-[#16DB65]"><Check size={15} strokeWidth={2} aria-hidden="true" /></span>
                  <p className="m-0 self-center text-base leading-7 text-[#D6E2D3]/80 sm:text-lg sm:leading-8"><span className="me-3 font-mono text-xs text-[#D6E2D3]/55">0{index + 1}</span>{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid border-y border-white/10 sm:mt-28 lg:grid-cols-2">
          <div className="py-8 lg:pe-12 lg:py-12">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-[#16DB65]">Cryptography</p>
            <p className="mb-0 mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F3F8F1] sm:text-4xl">Proves authenticity.</p>
            <p className="mb-0 mt-4 max-w-[32rem] text-base leading-7 text-[#B7C5B3]/70">The commitment proves which record existed first and whether later disclosure and execution match it.</p>
          </div>
          <div className="border-t border-white/10 py-8 lg:border-s lg:border-t-0 lg:ps-12 lg:py-12">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-[#E4A4A5]">GenLayer</p>
            <p className="mb-0 mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] text-[#F3F8F1] sm:text-4xl">Judges substance.</p>
            <p className="mb-0 mt-4 max-w-[32rem] text-base leading-7 text-[#B7C5B3]/70">Validators assess the genuine testimony against its evidence, mandate, and resulting action.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
