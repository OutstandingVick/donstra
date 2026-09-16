import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";

const proofStages = [
  {
    index: "01",
    label: "Testimony sealed",
    detail: "Evidence · belief · mandate",
    digest: "0x8dd6…31ae",
  },
  {
    index: "02",
    label: "Exact action bound",
    detail: "Target · value · deadline",
    digest: "0x954b…dd2b",
  },
  {
    index: "03",
    label: "Proof survives",
    detail: "Challenge · judgment · settlement",
    digest: "VERIFIABLE",
  },
];

function AgentBlock({ className }: { className: string }) {
  return (
    <div className={`relative aspect-[1.08/1] w-[clamp(12rem,20vw,20rem)] shrink-0 animate-agent-float ${className}`}>
      <div className="absolute inset-[8%] rounded-[2.5rem] border border-white/15 bg-[linear-gradient(145deg,rgba(243,248,241,0.20),rgba(13,22,11,0.92)_48%,rgba(92,26,27,0.50))] shadow-[inset_10px_10px_24px_rgba(255,255,255,0.10),inset_-14px_-18px_28px_rgba(0,0,0,0.55),0_24px_70px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-x-[13%] top-[12%] h-[48%] rounded-[1.8rem] border border-white/10 bg-[#050A05]/90 shadow-[inset_0_8px_18px_rgba(0,0,0,0.75),0_0_34px_rgba(22,219,101,0.12)]">
          <div className="absolute left-[22%] top-[34%] h-[22%] w-[22%] animate-agent-glow rounded-full bg-[#16DB65] shadow-[0_0_12px_#16DB65,0_0_34px_rgba(22,219,101,0.85)]" />
          <div className="absolute right-[22%] top-[34%] h-[22%] w-[22%] animate-agent-glow rounded-full bg-[#81ECAB] shadow-[0_0_12px_#16DB65,0_0_34px_rgba(22,219,101,0.85)] [animation-delay:-1.2s]" />
          <div className="absolute bottom-[16%] left-1/2 h-px w-[28%] -translate-x-1/2 rounded-full bg-white/20" />
        </div>
        <span className="absolute bottom-[13%] left-[22%] size-[8%] rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_30%,rgba(243,248,241,0.42),rgba(92,26,27,0.65)_55%,#091007)]" />
        <span className="absolute bottom-[13%] right-[22%] size-[8%] rounded-full border border-white/15 bg-[radial-gradient(circle_at_35%_30%,rgba(243,248,241,0.42),rgba(92,26,27,0.65)_55%,#091007)]" />
      </div>
    </div>
  );
}

function ProofStrip() {
  return (
    <div className="mt-20 w-full sm:mt-28" aria-label="Donstra binds an agent's testimony to its action before producing durable proof">
      <div className="flex items-center justify-center gap-5 sm:gap-7">
        <span className="h-px w-10 bg-white/20 sm:w-20" aria-hidden="true" />
        <p className="m-0 text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#D6E2D3]/65">Decision record · Pre-action</p>
        <span className="h-px w-10 bg-white/20 sm:w-20" aria-hidden="true" />
      </div>
      <ol className="m-0 mt-10 grid list-none gap-5 p-0 md:grid-cols-3 md:gap-6 sm:mt-12">
        {proofStages.map((stage) => (
            <li key={stage.label} className="flex min-h-[19rem] flex-col rounded-[1.5rem] bg-[#F3F8F1] p-7 text-[#0D160B] shadow-[0_18px_55px_rgba(0,0,0,0.22)] sm:min-h-[22rem] sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className={`text-[clamp(3.5rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.065em] ${stage.index === "01" ? "text-[#16A852]" : "text-[#0D160B]"}`}>{stage.index}</span>
                <span className="pt-2 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[#0D160B]/45">{stage.digest}</span>
              </div>
              <div className="mt-auto pt-12">
                <h3 className="m-0 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{stage.label}</h3>
                <p className="mb-0 mt-3 max-w-[20rem] text-base leading-7 text-[#0D160B]/60">{stage.detail}</p>
              </div>
            </li>
          ))}
      </ol>
      <div className="mt-6 flex items-center justify-center gap-3 text-center sm:mt-8">
        <span className="size-1.5 rounded-full bg-[#16DB65] shadow-[0_0_12px_rgba(22,219,101,0.8)]" aria-hidden="true" />
        <span className="text-sm text-[#CFF8DC]">Committed before execution</span>
        <span className="font-mono text-xs text-[#16DB65]">SEALED</span>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-white/10 bg-[#0D160B] px-5 pb-20 pt-36 text-[#F3F8F1] sm:px-8 sm:pb-28 sm:pt-44 lg:px-12 lg:pb-32 lg:pt-48">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-[42%] max-w-[36rem] bg-[radial-gradient(ellipse_at_left_center,rgba(22,219,101,0.16),transparent_68%)]" />
        <div className="absolute inset-y-0 right-0 w-[42%] max-w-[36rem] bg-[radial-gradient(ellipse_at_right_center,rgba(92,26,27,0.26),transparent_68%)]" />
        <div className="absolute left-1/2 top-[32%] h-[30rem] w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(22,219,101,0.10),transparent_62%)]" />
        <div className="absolute inset-x-0 top-[32%] h-24 bg-gradient-to-r from-transparent via-[#16DB65]/[0.07] to-transparent" />
        <div className="absolute inset-x-0 top-[32%] h-px bg-gradient-to-r from-[#16DB65]/10 via-[#16DB65]/55 to-[#5C1A1B]/40" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(243,248,241,0.03)_0_1px,transparent_1px_25%)] [mask-image:radial-gradient(ellipse_at_50%_30%,black_10%,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_30%,black_10%,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#080D07]/60 to-transparent" />
        <div className="absolute inset-x-[-10%] top-[31%] flex animate-hero-drift items-center justify-center gap-[clamp(1rem,5vw,6rem)] opacity-35 sm:top-[27%] sm:opacity-45">
          <AgentBlock className="[--agent-rotate:-10deg] [animation-delay:-2s]" />
          <AgentBlock className="[--agent-rotate:4deg] [animation-delay:-5s]" />
          <AgentBlock className="[--agent-rotate:11deg] [animation-delay:-3.5s]" />
        </div>
        <div className="absolute inset-x-0 top-[21%] h-[46%] bg-[radial-gradient(ellipse_at_center,rgba(13,22,11,0.18),rgba(13,22,11,0.72)_70%,#0D160B_100%)]" />
      </div>

      <div className="mx-auto w-full max-w-[90rem]">
        <div className="mx-auto max-w-[62rem] text-center">
          <p className="mb-0 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#B7C5B3]/65"><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" /><span className="hidden sm:inline">Accountability infrastructure for autonomous agents</span><span className="sm:hidden">Accountability for autonomous agents</span><span className="h-px w-8 bg-[#16DB65]" aria-hidden="true" /></p>
          <h1 className="mb-0 mt-8 text-balance text-[clamp(2.75rem,7vw,7rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#F3F8F1]">Agents can rewrite the story. <span className="text-[#81ECAB]">Not the proof.</span></h1>
          <p className="mb-0 mt-8 max-w-[42rem] text-pretty text-lg leading-8 text-[#D6E2D3]/70 sm:text-xl sm:leading-9 mx-auto">Donstra seals what an agent knew, believed, and intended before it acts—then binds that testimony to the exact action for challenge and independent judgment.</p>
          <p className="mb-0 mt-6 max-w-[36rem] text-pretty text-base leading-7 text-[#EAF2E7]/85 mx-auto">Make post-hoc excuses irrelevant for autonomous agents.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/app" className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[#16DB65] px-5 text-sm font-semibold text-[#071006] transition-colors duration-150 hover:bg-[#43E47E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F3F8F1]">Open Live Console <ArrowRight size={17} strokeWidth={2} aria-hidden="true" /></Link>
            <a href="#how-donstra-works" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/15 px-5 text-sm font-semibold text-[#F3F8F1] transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]">View how it works <ArrowDown size={17} strokeWidth={2} aria-hidden="true" /></a>
          </div>
        </div>

        <ProofStrip />
      </div>
    </section>
  );
}
