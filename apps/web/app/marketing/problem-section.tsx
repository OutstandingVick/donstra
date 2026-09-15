const failureSequence = [
  ["01", "Online", "The agent receives current evidence and appears operational."],
  ["02", "Confident", "Its model assigns high confidence to a decision."],
  ["03", "Wrong", "The proposed action conflicts with its mandate or the evidence."],
  ["04", "Acts anyway", "The irreversible action executes before anyone can inspect the reasoning."],
  ["05", "Explains later", "After the outcome, a new story can be made to sound inevitable."],
] as const;

export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="scroll-mt-20 border-b border-white/10 bg-[#080D07] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#5C1A1B]" aria-hidden="true" />The accountability gap</p>
            <h2 id="problem-title" className="mb-0 mt-7 max-w-[11ch] text-balance text-[clamp(2.8rem,5.6vw,6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">The dangerous part is not that agents can be wrong.</h2>
          </div>
          <div className="lg:pt-16">
            <p className="mb-0 max-w-[36rem] text-pretty text-xl leading-9 text-[#D6E2D3]/70 sm:text-2xl sm:leading-10">It is that they can act first, observe the outcome, and produce a convincing explanation afterward.</p>
          </div>
        </div>

        <div className="mt-20 border-y border-white/10 sm:mt-28">
          <ol className="m-0 list-none p-0">
            {failureSequence.map(([index, title, description], itemIndex) => (
              <li key={title} className={`grid gap-4 py-7 sm:grid-cols-[4rem_11rem_minmax(0,1fr)] sm:items-baseline sm:gap-7 sm:py-8 ${itemIndex > 0 ? "border-t border-white/10" : ""}`}>
                <span className="font-mono text-xs text-[#16DB65]">{index}</span>
                <h3 className="m-0 text-xl font-semibold tracking-[-0.025em] text-[#F3F8F1] sm:text-2xl">{title}</h3>
                <p className="m-0 max-w-[45rem] text-base leading-7 text-[#B7C5B3]/65 sm:text-lg sm:leading-8">{description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-8 border-s-2 border-[#5C1A1B] ps-6 sm:mt-28 sm:ps-9 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] lg:items-end lg:gap-16">
          <p className="m-0 max-w-[24ch] text-balance text-[clamp(2rem,4.3vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.045em] text-[#F3F8F1]">Without a pre-action commitment, accountability begins after the evidence can be rewritten.</p>
          <p className="m-0 max-w-[30rem] text-pretty text-base leading-7 text-[#B7C5B3]/65">Donstra moves the record to the only moment that matters: before the agent knows whether its action will succeed.</p>
        </div>
      </div>
    </section>
  );
}
