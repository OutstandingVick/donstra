const protocolStages = [
  ["01", "Testimony", "The complete decision context is sealed before execution."],
  ["02", "Commitment", "A durable digest and agent bond establish the record."],
  ["03", "Execution", "Only the action bound to that commitment can run."],
  ["04", "Challenge", "A challenger can contest the decision within the window."],
  ["05", "Adjudication", "Validators judge the genuine testimony, not a rewritten account."],
  ["06", "Settlement", "Bonds move according to the final verdict."],
] as const;

const ringProgress = [
  "bg-[conic-gradient(from_0deg,#16DB65_0_58deg,rgba(243,248,241,0.12)_58deg_360deg)]",
  "bg-[conic-gradient(from_0deg,#16DB65_0_112deg,rgba(243,248,241,0.12)_112deg_360deg)]",
  "bg-[conic-gradient(from_0deg,#16DB65_0_168deg,rgba(243,248,241,0.12)_168deg_360deg)]",
  "bg-[conic-gradient(from_0deg,#16DB65_0_224deg,#5C1A1B_224deg_246deg,rgba(243,248,241,0.12)_246deg_360deg)]",
  "bg-[conic-gradient(from_0deg,#16DB65_0_250deg,#5C1A1B_250deg_302deg,rgba(243,248,241,0.12)_302deg_360deg)]",
  "bg-[conic-gradient(from_0deg,#16DB65_0_260deg,#5C1A1B_260deg_360deg)]",
] as const;

export function ProtocolSequence() {
  return (
    <ol className="m-0 grid list-none gap-x-10 gap-y-16 p-0 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-24" aria-label="How Donstra works">
      {protocolStages.map(([number, title, description], index) => (
        <li key={title} className="mx-auto flex max-w-[24rem] flex-col items-center text-center">
          <span className={`grid size-[4.5rem] place-items-center rounded-full p-[2px] ${ringProgress[index]}`}>
            <span className="grid size-full place-items-center rounded-full bg-[#0D160B] font-mono text-sm font-semibold text-[#F3F8F1]">{number}</span>
          </span>
          <h3 className="mb-0 mt-7 text-xl font-semibold tracking-[-0.03em] text-[#F3F8F1] sm:text-2xl">{title}</h3>
          <p className="mb-0 mt-3 text-base leading-7 text-[#D6E2D3]/60">{description}</p>
        </li>
      ))}
    </ol>
  );
}
