import { ProtocolSequence } from "./protocol-sequence";
import { TechnicalProof } from "./technical-proof";

export function HowDonstraWorksSection() {
  return (
    <section id="how-donstra-works" aria-labelledby="how-donstra-works-title" className="scroll-mt-20 border-y border-white/10 bg-[#101A0E] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.06fr)_minmax(20rem,0.72fr)] lg:items-end lg:gap-20">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />How Donstra works</p>
            <h2 id="how-donstra-works-title" className="mb-0 mt-7 max-w-[13ch] text-balance text-[clamp(2.8rem,5.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">The decision becomes evidence before it becomes action.</h2>
          </div>
          <p className="mb-0 max-w-[37rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">Donstra preserves the full decision context, permits the exact bound action, and keeps a path open for challenge, judgment, and economic consequence.</p>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.58fr)] lg:items-start lg:gap-16 xl:gap-24">
          <ProtocolSequence />
          <div className="lg:sticky lg:top-24">
            <TechnicalProof />
          </div>
        </div>
      </div>
    </section>
  );
}
