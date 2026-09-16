import { ProtocolSequence } from "./protocol-sequence";

export function HowDonstraWorksSection() {
  return (
    <section id="how-donstra-works" aria-labelledby="how-donstra-works-title" className="scroll-mt-20 border-y border-white/10 bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="mx-auto max-w-[62rem] text-center">
          <p className="mb-0 text-xs font-semibold uppercase tracking-[0.18em] text-[#16DB65]">How Donstra works</p>
          <h2 id="how-donstra-works-title" className="mb-0 mt-6 text-balance text-[clamp(2.75rem,5.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">Decisions become evidence first.</h2>
          <p className="mx-auto mb-0 mt-6 max-w-[42rem] text-pretty text-lg leading-8 text-[#D6E2D3]/65 sm:text-xl sm:leading-9">Donstra seals the decision, binds the action, and leaves it open to challenge and settlement.</p>
        </div>

        <div className="mt-16 sm:mt-24 lg:mt-28">
          <ProtocolSequence />
        </div>
      </div>
    </section>
  );
}
