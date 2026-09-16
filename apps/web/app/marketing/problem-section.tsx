type FailurePanel = {
  index: string;
  title: string;
  copy: string;
  place: string;
  visual: "signal" | "confidence" | "conflict" | "hindsight";
};

const failurePanels: FailurePanel[] = [
  { index: "01", title: "Online", copy: "The agent receives current evidence and appears operational.", place: "lg:col-start-1 lg:row-start-1", visual: "signal" },
  { index: "02", title: "Confident", copy: "Its model assigns high confidence to a decision.", place: "lg:col-start-3 lg:row-start-1", visual: "confidence" },
  { index: "03", title: "Wrong", copy: "The proposed action conflicts with its mandate or the evidence.", place: "lg:col-start-1 lg:row-start-2", visual: "conflict" },
  { index: "05", title: "Explains later", copy: "After the outcome, a new story can be made to sound inevitable.", place: "lg:col-start-3 lg:row-start-2", visual: "hindsight" },
];

function PanelVisual({ kind }: { kind: FailurePanel["visual"] }) {
  if (kind === "signal") {
    return (
      <div className="flex h-10 items-center" aria-hidden="true">
        <span className="relative grid size-2.5 place-items-center">
          <span className="absolute -inset-1.5 rounded-full border border-[#16DB65]/30" />
          <span className="size-2.5 rounded-full bg-[#16DB65]" />
        </span>
        <span className="ms-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#D6E2D3]/45">SIGNAL · LIVE</span>
      </div>
    );
  }
  if (kind === "confidence") {
    return (
      <div className="flex h-10 flex-col justify-center gap-2" aria-hidden="true">
        <div className="h-1 w-28 rounded-full bg-white/10"><div className="h-1 w-[86%] rounded-full bg-[#16DB65]" /></div>
        <span className="font-mono text-[0.65rem] tracking-[0.1em] text-[#D6E2D3]/45">CONFIDENCE 0.86</span>
      </div>
    );
  }
  if (kind === "conflict") {
    return (
      <div className="flex h-10 flex-col justify-center gap-2" aria-hidden="true">
        <div className="h-px w-28 bg-[linear-gradient(90deg,#16DB65_0_46%,transparent_46%,transparent_54%,#5C1A1B_54%)]" />
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#E4A4A5]/80">MANDATE · MISMATCH</span>
      </div>
    );
  }
  return (
    <div className="flex h-10 flex-col justify-center gap-2" aria-hidden="true">
      <div className="h-px w-28 bg-[repeating-linear-gradient(90deg,rgba(214,226,211,0.35)_0_6px,transparent_6px_12px)]" />
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#D6E2D3]/45">STORY · REWRITTEN</span>
    </div>
  );
}

function FailurePanelCard({ panel }: { panel: FailurePanel }) {
  return (
    <article className={`flex min-h-[15rem] flex-col rounded-2xl bg-[#101A0E] p-6 sm:p-8 ${panel.place}`}>
      <PanelVisual kind={panel.visual} />
      <div className="mt-auto pt-8">
        <span className="font-mono text-xs text-[#16DB65]">{panel.index}</span>
        <h3 className="mb-0 mt-2 text-xl font-semibold tracking-[-0.025em] text-[#F3F8F1]">{panel.title}</h3>
        <p className="mb-0 mt-2 max-w-[24rem] text-sm leading-6 text-[#B7C5B3]/70">{panel.copy}</p>
      </div>
    </article>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="scroll-mt-20 border-b border-white/10 bg-[#080D07] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="mx-auto max-w-[56rem] text-center">
          <p className="mb-0 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#5C1A1B]" aria-hidden="true" />The accountability gap<span className="h-px w-8 bg-[#5C1A1B]" aria-hidden="true" /></p>
          <h2 id="problem-title" className="mb-0 mt-7 text-balance text-[clamp(2.6rem,5.6vw,6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">The dangerous part is not that agents can be wrong.</h2>
          <p className="mb-0 mt-7 max-w-[36rem] text-pretty text-xl leading-9 text-[#D6E2D3]/70 mx-auto">It is that they can act first, observe the outcome, and produce a convincing explanation afterward.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:mt-24 sm:gap-6 lg:grid-cols-3 lg:grid-rows-[24rem_17rem]">
          <FailurePanelCard panel={failurePanels[0]} />
          <FailurePanelCard panel={failurePanels[1]} />
          <FailurePanelCard panel={failurePanels[2]} />

          <article className="flex flex-col overflow-hidden rounded-2xl border border-[#16DB65]/15 bg-[#101A0E] bg-[linear-gradient(165deg,rgba(22,219,101,0.09),rgba(92,26,27,0.14))] p-6 sm:p-8 lg:col-start-2 lg:row-start-1 lg:h-[29rem]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#16DB65]">04</span>
              <span className="rounded-md border border-[#5C1A1B]/60 bg-[#5C1A1B]/20 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#F0B9BA]">IRREVERSIBLE</span>
            </div>
            <h3 className="mb-0 mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#F3F8F1] sm:text-3xl">Acts anyway</h3>
            <p className="mb-0 mt-3 max-w-[24rem] text-base leading-7 text-[#D6E2D3]/65">The irreversible action executes before anyone can inspect the reasoning.</p>
            <div className="relative mt-auto hidden pt-16 lg:block" aria-hidden="true">
              <div className="absolute inset-x-0 top-1/2 h-24 bg-[radial-gradient(ellipse_at_center,rgba(92,26,27,0.16),transparent_70%)]" />
              <div className="relative h-px w-full bg-gradient-to-r from-[#16DB65] to-[#5C1A1B]" />
              <div className="relative mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em]">
                <span className="text-[#81ECAB]">DECISION</span>
                <span className="text-[#F0B9BA]">EXECUTED</span>
              </div>
            </div>
            <div className="mt-auto pt-10 lg:hidden" aria-hidden="true">
              <div className="h-px w-full bg-gradient-to-r from-[#16DB65] to-[#5C1A1B]" />
              <div className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em]">
                <span className="text-[#81ECAB]">DECISION</span>
                <span className="text-[#F0B9BA]">EXECUTED</span>
              </div>
            </div>
          </article>

          <FailurePanelCard panel={failurePanels[3]} />

          <article className="flex min-h-[17rem] flex-col justify-between rounded-2xl bg-[#101A0E] p-6 text-center sm:p-8 lg:col-start-2 lg:row-start-2 lg:h-[12rem] lg:min-h-0 lg:translate-y-20 lg:justify-center">
            <span className="mx-auto h-px w-16 bg-gradient-to-r from-[#16DB65] to-[#5C1A1B]" aria-hidden="true" />
            <p className="mx-auto mb-0 mt-6 max-w-[25rem] text-balance text-xl font-medium leading-7 tracking-[-0.03em] text-[#F3F8F1] lg:text-lg lg:leading-6">Without a pre-action commitment, accountability begins after the evidence can be rewritten.</p>
            <p className="mx-auto mb-0 mt-4 max-w-[27rem] text-sm leading-6 text-[#B7C5B3]/65 lg:text-xs lg:leading-5">Donstra moves the record to the only moment that matters: before the agent knows whether its action will succeed.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
