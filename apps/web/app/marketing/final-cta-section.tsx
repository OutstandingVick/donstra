import { FinalCtaActions } from "./final-cta-actions";

export function FinalCtaSection() {
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="scroll-mt-20 overflow-hidden bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="relative mx-auto w-full max-w-[90rem] border-y border-white/10 py-16 text-center sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-[#16DB65]/70 to-transparent" aria-hidden="true" />
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/70">Accountability before action</p>
        <h2 id="final-cta-title" className="mx-auto mb-0 mt-7 max-w-[18ch] text-balance text-[clamp(2.8rem,6vw,6.25rem)] font-semibold leading-[0.97] tracking-[-0.06em]">
          Agents will make mistakes. The question is whether they can rewrite the story afterward.
        </h2>
        <p className="mx-auto mb-0 mt-7 max-w-[43rem] text-pretty text-base leading-7 text-[#D6E2D3]/70 sm:text-lg sm:leading-8">
          Donstra binds testimony to action before the outcome is known, then leaves a record that can be challenged, judged, and settled.
        </p>
        <FinalCtaActions />
      </div>
    </section>
  );
}
