const testimonyFields = ["Evidence", "Belief", "Confidence", "Mandate", "Exact proposed action"] as const;

const protocolStages = [
  ["01", "Testimony sealed", "The complete decision context is fixed before execution."],
  ["02", "Commitment posted", "A durable digest and agent bond establish the record."],
  ["03", "Exact action executes", "Only the action bound to that commitment can run."],
  ["04", "Challenge remains open", "A challenger can contest the decision within the window."],
  ["05", "GenLayer adjudicates", "Validators judge the genuine testimony—not a rewritten account."],
  ["06", "Economics settle", "Bonds move according to the final verdict."],
] as const;

export function ProtocolSequence() {
  return (
    <div>
      <div className="grid gap-6 border-y border-white/10 py-7 sm:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] sm:items-center sm:gap-10 sm:py-8">
        <p className="m-0 text-sm font-semibold text-[#F3F8F1]">One testimony contains</p>
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0" aria-label="Testimony fields">
          {testimonyFields.map((field) => <li key={field} className="flex items-center gap-2 text-sm text-[#D6E2D3]/75"><span className="size-1 rounded-full bg-[#16DB65]" aria-hidden="true" />{field}</li>)}
        </ul>
      </div>

      <ol className="m-0 list-none p-0" aria-label="How Donstra works">
        {protocolStages.map(([number, title, description], index) => (
          <li key={title} className="relative grid gap-4 py-7 sm:grid-cols-[4rem_15rem_minmax(0,1fr)] sm:items-baseline sm:gap-7 sm:py-8">
            {index > 0 && <span className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden="true" />}
            <span className="font-mono text-xs text-[#16DB65]">{number}</span>
            <h3 className="m-0 text-xl font-semibold tracking-[-0.025em] text-[#F3F8F1] sm:text-2xl">{title}</h3>
            <p className="m-0 max-w-[42rem] text-base leading-7 text-[#B7C5B3]/70 sm:text-lg sm:leading-8">{description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
