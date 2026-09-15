import { FailureChain } from "./failure-chain";

export function ExistingSystemsSection() {
  return (
    <section id="accountability-gap" aria-labelledby="accountability-gap-title" className="scroll-mt-20 bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-end lg:gap-20">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />Why existing systems fail</p>
            <h2 id="accountability-gap-title" className="mb-0 mt-7 max-w-[14ch] text-balance text-[clamp(2.8rem,5.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">Most audit trails begin one moment too late.</h2>
          </div>
          <p className="mb-0 max-w-[38rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">They preserve what happened. They do not prove what the agent knew, believed, or intended before the result could influence its story.</p>
        </div>

        <div className="mt-16 sm:mt-24">
          <FailureChain />
        </div>

        <div className="mt-16 grid overflow-hidden rounded-xl border border-[#5C1A1B]/50 bg-[#100B0B] sm:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.48fr)]">
          <p className="m-0 p-7 text-balance text-2xl font-medium leading-9 tracking-[-0.03em] text-[#F3F8F1] sm:p-10 sm:text-3xl sm:leading-10 lg:p-12">A post-hoc explanation may sound reasonable. It is not evidence of prior reasoning.</p>
          <div className="border-t border-[#5C1A1B]/40 bg-[#5C1A1B]/15 p-7 sm:p-10 lg:border-s lg:border-t-0 lg:p-12">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-[#E4A4A5]">What remains unproven</p>
            <p className="mb-0 mt-4 text-base leading-7 text-[#EEDADA]/75">Authenticity, timing, action binding, mandate compliance, and who should bear the consequence.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
