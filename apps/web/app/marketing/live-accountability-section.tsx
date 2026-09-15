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
    <section id="live-accountability" aria-labelledby="live-accountability-title" className="scroll-mt-20 overflow-hidden bg-[#080D07] px-5 py-24 text-[#F3F8F1] sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.72fr)] lg:items-end lg:gap-20">
          <div>
            <p className="mb-0 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" />Live accountability flow</p>
            <h2 id="live-accountability-title" className="mb-0 mt-7 max-w-[14ch] text-balance text-[clamp(2.8rem,5.5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]">Every transition leaves something new to verify.</h2>
          </div>
          <p className="mb-0 max-w-[36rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9">The record grows with the decision—from a sealed account of intent to a settled consequence—without allowing an earlier fact to be rewritten.</p>
        </div>

        <div className="relative mt-16 sm:mt-24">
          <span className="pointer-events-none absolute bottom-0 start-[1.375rem] top-0 w-px bg-gradient-to-b from-[#16DB65] via-[#16DB65]/45 to-[#5C1A1B] lg:inset-x-0 lg:bottom-auto lg:top-[1.375rem] lg:h-px lg:w-auto" aria-hidden="true" />
          <ol className="relative m-0 grid list-none p-0 lg:grid-cols-6" aria-label="Live accountability stages">
            {lifecycle.map((stage) => {
              const Icon = stage.icon;
              return (
                <li key={stage.name} className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-5 pb-10 last:pb-0 lg:block lg:pe-6 lg:pb-0">
                  <span className="relative z-10 grid size-11 place-items-center rounded-full border border-[#16DB65]/35 bg-[#0D160B] text-[#CFF8DC]"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span>
                  <div className="min-w-0 lg:mt-9">
                    <span className="font-mono text-xs text-[#16DB65]">{stage.number}</span>
                    <h3 className="mb-0 mt-2 text-xl font-semibold tracking-[-0.025em] text-[#F3F8F1]">{stage.name}</h3>
                    <p className="mb-0 mt-3 max-w-[24rem] text-base leading-7 text-[#B7C5B3]/70">{stage.proof}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-y border-white/10 py-6 sm:mt-24">
          <p className="m-0 text-sm font-semibold text-[#F3F8F1]">One continuous record</p>
          <p className="m-0 font-mono text-xs text-[#D6E2D3]/60">INTENT → ACTION → JUDGMENT → CONSEQUENCE</p>
        </div>
      </div>
    </section>
  );
}
