import { Check, Clock3, Fingerprint, Gavel, Link2, Scale } from "lucide-react";

const proofCategories = [
  { number: "01", name: "Testimony authenticity", description: "The disclosed testimony matches the record the agent sealed before acting." },
  { number: "02", name: "Action binding" },
  { number: "03", name: "Commitment timing" },
  { number: "04", name: "Mandate compliance" },
  { number: "05", name: "Settlement binding" },
] as const;

const supportingProofs = [
  { text: "Testimony digest matched", icon: Fingerprint },
  { text: "Action digest matched", icon: Link2 },
  { text: "Committed before execution", icon: Clock3 },
  { text: "Genuine testimony judged by GenLayer", icon: Gavel },
  { text: "Final verdict determines the economic outcome", icon: Scale },
] as const;

export function WhatDonstraProvesSection() {
  return (
    <section id="what-donstra-proves" aria-labelledby="what-donstra-proves-title" className="scroll-mt-20 border-y border-white/10 bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <header className="max-w-[68rem]">
          <p className="mb-0 flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#16DB65]"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />What Donstra proves</p>
          <h2 id="what-donstra-proves-title" className="mb-0 mt-7 max-w-[14ch] text-balance text-[clamp(3rem,6vw,6.25rem)] font-semibold leading-[0.96] tracking-[-0.05em]">Not mind-reading. Evidence.</h2>
        </header>

        <div className="mt-16 grid border-t border-white/10 lg:mt-24 lg:grid-cols-[minmax(0,1.04fr)_minmax(24rem,0.96fr)]">
          <ol className="m-0 list-none border-white/10 p-0 lg:grid lg:grid-rows-[1.8fr_repeat(4,1fr)] lg:border-e" aria-label="Proof categories">
            {proofCategories.map((proof, index) => (
              <li key={proof.name} className={index === 0 ? "border-b border-[#16DB65]/55 bg-[#5C1A1B]/25 px-5 py-7 sm:px-7 sm:py-8 lg:flex lg:flex-col lg:justify-center" : "border-b border-white/10 px-5 py-6 sm:px-7 sm:py-7 lg:flex lg:flex-col lg:justify-center"}>
                <div className="flex items-baseline gap-5">
                  <span className={index === 0 ? "font-mono text-sm font-semibold tracking-[0.08em] text-[#16DB65]" : "font-mono text-sm tracking-[0.08em] text-[#B7C5B3]/55"}>{proof.number}</span>
                  <h3 className={index === 0 ? "m-0 text-xl font-semibold tracking-[-0.02em] text-[#F3F8F1] sm:text-2xl" : "m-0 text-lg font-medium tracking-[-0.01em] text-[#D6E2D3]/75 sm:text-xl"}>{proof.name}</h3>
                </div>
                {"description" in proof ? <p className="mb-0 mt-5 max-w-[38rem] ps-10 text-base leading-7 text-[#EEDADA]/75 sm:ps-12 sm:text-lg sm:leading-8">{proof.description}</p> : null}
              </li>
            ))}
          </ol>

          <div className="lg:ps-10 xl:ps-14">
            <div className="border-b border-white/10 px-5 py-10 sm:px-7 sm:py-12 lg:px-0 lg:pt-10 xl:pb-14">
              <p className="m-0 max-w-[24ch] text-balance text-3xl font-medium leading-[1.08] tracking-[-0.035em] text-[#F3F8F1] sm:text-4xl xl:text-[2.65rem]">Donstra proves what the agent committed before execution—and whether action, judgment, and settlement stayed bound to it.</p>
              <p className="mb-0 mt-7 max-w-[39rem] text-base leading-7 text-[#B7C5B3]/70 sm:text-lg sm:leading-8">It does not inspect hidden cognition or claim access to private chain of thought. It verifies the testimony the agent chose to commit.</p>
            </div>

            <ul className="m-0 list-none p-0" aria-label="Supporting proof details">
              {supportingProofs.map((proof) => {
                const Icon = proof.icon;
                return (
                  <li key={proof.text} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-4 border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6 lg:px-0">
                    <span className="grid size-8 place-items-center border border-[#16DB65]/25 text-[#16DB65]"><Icon size={15} strokeWidth={1.7} aria-hidden="true" /></span>
                    <p className="m-0 text-base leading-7 text-[#D6E2D3]/80">{proof.text}</p>
                  </li>
                );
              })}
            </ul>

            <div className="grid border-b border-white/10 sm:grid-cols-2">
              <div className="px-5 py-7 sm:px-7 lg:px-0 lg:pe-8">
                <div className="flex items-center gap-3"><Check size={15} className="text-[#16DB65]" aria-hidden="true" /><p className="m-0 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#16DB65]">Cryptography</p></div>
                <p className="mb-0 mt-3 text-base font-semibold text-[#F3F8F1]">Proves authenticity.</p>
              </div>
              <div className="border-t border-white/10 px-5 py-7 sm:border-s sm:border-t-0 sm:px-7 lg:pe-0">
                <div className="flex items-center gap-3"><Gavel size={15} className="text-[#E4A4A5]" aria-hidden="true" /><p className="m-0 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#E4A4A5]">GenLayer</p></div>
                <p className="mb-0 mt-3 text-base font-semibold text-[#F3F8F1]">Judges substance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
