import { FailureChain } from "./failure-chain";

export function ExistingSystemsSection() {
  return (
    <section id="accountability-gap" aria-labelledby="accountability-gap-title" className="scroll-mt-20 bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="mx-auto max-w-[58rem] text-center">
          <p className="mb-0 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />Why existing systems fail<span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" /></p>
          <h2 id="accountability-gap-title" className="mb-0 mt-7 text-balance text-[clamp(2.8rem,5.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">Most audit trails begin one moment too late.</h2>
          <p className="mx-auto mb-0 mt-7 max-w-[38rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">They preserve what happened. They do not prove what the agent knew, believed, or intended before the result could influence its story.</p>
        </div>

        <div className="mt-16 sm:mt-24">
          <FailureChain />
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 pt-8 sm:mt-24 sm:pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-start lg:gap-16">
          <p className="m-0 max-w-[34rem] text-balance text-2xl font-medium leading-9 tracking-[-0.03em] text-[#F3F8F1] sm:text-3xl sm:leading-10">A post-hoc explanation may sound reasonable. It is not evidence of prior reasoning.</p>
          <div>
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.15em] text-[#E4A4A5]">What remains unproven</p>
            <p className="mb-0 mt-4 max-w-[34rem] text-base leading-7 text-[#EEDADA]/70">Authenticity, timing, action binding, mandate compliance, and who should bear the consequence.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
