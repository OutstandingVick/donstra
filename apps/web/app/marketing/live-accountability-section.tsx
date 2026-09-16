import { FileLock2, Fingerprint, Gavel, Landmark, Play, ShieldAlert } from "lucide-react";

const lifecycle = [
  { number: "01", name: "Testimony", proof: "The decision context existed before the outcome.", icon: FileLock2 },
  { number: "02", name: "Commitment", proof: "Its digest, timestamp, and agent bond are publicly fixed.", icon: Fingerprint },
  { number: "03", name: "Execution", proof: "The action that ran can be compared with the action committed.", icon: Play },
  { number: "04", name: "Challenge", proof: "The challenger, collateral, and dispute window are recorded.", icon: ShieldAlert },
  { number: "05", name: "Adjudication", proof: "The genuine testimony and resulting verdict remain inspectable.", icon: Gavel },
  { number: "06", name: "Settlement", proof: "The verdict determines where the economic consequence lands.", icon: Landmark },
] as const;

export function LiveAccountabilitySection() {
  return (
    <section id="live-accountability" aria-labelledby="live-accountability-title" className="scroll-mt-20 overflow-hidden bg-[#0D160B] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="mx-auto max-w-[66rem] text-center">
          <p className="mb-0 text-xs font-semibold uppercase tracking-[0.18em] text-[#16DB65]">Live accountability flow</p>
          <h2 id="live-accountability-title" className="mb-0 mt-6 text-balance text-[clamp(2.8rem,5.7vw,6rem)] font-semibold leading-[0.98] tracking-[-0.04em]">Every transition leaves something new to verify.</h2>
          <p className="mx-auto mb-0 mt-6 max-w-[42rem] text-pretty text-lg leading-8 text-[#D6E2D3]/65 sm:text-xl sm:leading-9">The record grows with the decision—from a sealed account of intent to a settled consequence—without allowing an earlier fact to be rewritten.</p>
        </div>

        <div className="relative mt-24 sm:mt-32 lg:mt-40">
          <div className="pointer-events-none absolute -inset-x-5 -bottom-10 top-1/2 hidden rounded-b-[2.5rem] border-b border-l border-r border-dashed border-[#D6E2D3]/25 md:block xl:-inset-x-8 xl:-bottom-12" aria-hidden="true">
            <span className="absolute -left-1 -top-1 size-2 rounded-full bg-[#16DB65]" />
            <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[#5C1A1B]" />
          </div>
          <span className="pointer-events-none absolute bottom-8 left-[1.375rem] top-8 w-px border-l border-dashed border-[#D6E2D3]/30 md:hidden" aria-hidden="true" />

          <ol className="relative m-0 grid list-none gap-4 p-0 md:grid-cols-3 md:gap-5 xl:grid-cols-6" aria-label="Live accountability stages">
            {lifecycle.map((stage) => {
              const Icon = stage.icon;
              return (
                <li key={stage.name} className="relative z-10 flex min-h-56 min-w-0 flex-col rounded-[1.25rem] bg-[#F3F8F1] p-5 text-[#0D160B] sm:p-6 xl:min-h-64 xl:p-5">
                  <div className="flex items-center justify-end">
                    <span className="absolute left-5 top-7 font-mono text-[0.68rem] font-semibold tracking-[0.12em] text-[#0D160B]/45 sm:left-6 xl:left-5">{stage.number}</span>
                    <div className="inline-flex min-h-11 min-w-0 items-center gap-2 rounded-full bg-[#0D160B] py-1 pe-1 ps-3 text-[#F3F8F1]">
                      <span className="text-[0.8rem] font-semibold">{stage.name}</span>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F3F8F1] text-[#0D160B]"><Icon size={15} strokeWidth={1.7} aria-hidden="true" /></span>
                    </div>
                  </div>
                  <p className="mb-0 mt-auto max-w-[17rem] pt-8 text-base leading-7 text-[#0D160B]/65 xl:text-sm xl:leading-6">{stage.proof}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-3 text-center sm:mt-24 sm:flex-row sm:gap-5">
          <p className="m-0 text-sm font-semibold text-[#F3F8F1]">One continuous record</p>
          <span className="hidden h-px w-8 bg-gradient-to-r from-[#16DB65] to-[#5C1A1B] sm:block" aria-hidden="true" />
          <p className="m-0 font-mono text-xs text-[#D6E2D3]/55">INTENT → ACTION → JUDGMENT → CONSEQUENCE</p>
        </div>
      </div>
    </section>
  );
}
