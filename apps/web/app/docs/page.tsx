import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Code2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation — Donstra",
  description: "Understand Donstra's testimony commitments, exact-action binding, GenLayer adjudication, settlement, and local development workflow.",
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "trust-model", label: "What Donstra proves" },
  { id: "architecture", label: "Architecture" },
  { id: "quickstart", label: "Quickstart" },
  { id: "repository", label: "Repository guide" },
  { id: "deployment", label: "Deployment status" },
] as const;

const flow = [
  { number: "01", title: "Seal testimony", detail: "The agent records timestamped evidence, a belief, confidence, mandate, and the exact action it proposes to take." },
  { number: "02", title: "Commit the digest", detail: "Donstra stores the testimony off-chain and commits its canonical digest, action digest, and accountability bond." },
  { number: "03", title: "Execute exactly", detail: "The registry executes the target, calldata, value, chain, and deadline bound to the commitment—not an unrelated later transaction." },
  { number: "04", title: "Challenge and reveal", detail: "The disclosed testimony is re-hashed. A mismatch is a deterministic fabrication result; matching testimony proceeds to judgment." },
  { number: "05", title: "Adjudicate on GenLayer", detail: "Validators compare genuine testimony with evidence, mandate, confidence, and the commitment timestamp." },
  { number: "06", title: "Settle the outcome", detail: "Authenticated reporter attestations relay the finalized result to the EVM registry, which assigns claimable bonds." },
] as const;

const packages = [
  { path: "packages/sdk", purpose: "Typed testimony lifecycle, canonical hashing, validation, and encrypted storage" },
  { path: "packages/genlayer", purpose: "GenLayerJS adjudication adapter and evidence capture" },
  { path: "packages/relay", purpose: "Finality checks, EIP-712 attestations, relay CLI, and operator service" },
  { path: "contracts/genlayer", purpose: "Python Intelligent Contract for validator consensus" },
  { path: "contracts/evm", purpose: "Bonded commitment registry and authenticated settlement relay" },
  { path: "demo", purpose: "Three-receipt terminal demonstration" },
  { path: "apps/web", purpose: "Website, guided console, receipts, and these docs" },
] as const;

function SectionHeading({ number, title, description }: { number: string; title: string; description?: string }) {
  return <div className="mb-8 border-b border-white/10 pb-5"><p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#77E9A1]">{number} / Documentation</p><h2 className="m-0 text-3xl font-semibold tracking-tight text-[#F3F8F1] sm:text-4xl">{title}</h2>{description && <p className="mb-0 mt-4 max-w-2xl text-base leading-7 text-[#B7C5B3]">{description}</p>}</div>;
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#080D07] text-[#F3F8F1] antialiased">
      <a href="#docs-main" className="fixed start-4 top-4 z-50 -translate-y-24 rounded-md bg-[#16DB65] px-4 py-3 text-sm font-semibold text-[#071006] focus:translate-y-0">Skip to documentation</a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080D07]/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10" aria-label="Documentation navigation">
          <div className="flex min-w-0 items-center gap-5 sm:gap-8">
            <Link href="/" aria-label="Donstra home" className="shrink-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16DB65]"><Image src="/donstra-logo.svg" alt="Donstra" width={116} height={30} className="h-7 w-auto" /></Link>
            <span className="border-s border-white/20 ps-5 text-sm font-semibold text-[#B7C5B3] sm:ps-8">Documentation</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a href="https://github.com/OutstandingVick/donstra" target="_blank" rel="noreferrer" className="hidden min-h-11 items-center gap-2 text-[#B7C5B3] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16DB65] sm:inline-flex">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>
            <Link href="/app" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#16DB65] px-4 font-semibold text-[#071006] hover:bg-[#58EE93] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Open app <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:pt-14 xl:grid-cols-[15rem_minmax(0,48rem)_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Documentation contents">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#77E9A1]">On this page</p>
          <nav className="grid grid-cols-2 gap-1 text-sm lg:grid-cols-1" aria-label="Sections">
            {sections.map(({ id, label }) => <a key={id} href={`#${id}`} className="rounded-md border-s-2 border-transparent px-3 py-2.5 leading-5 text-[#B7C5B3] hover:border-[#16DB65] hover:bg-white/[0.04] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#16DB65]">{label}</a>)}
          </nav>
          <div className="mt-7 hidden border-t border-white/10 pt-6 lg:block"><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">More resources</p><a href="https://github.com/OutstandingVick/donstra/blob/main/docs/THREAT_MODEL.md" target="_blank" rel="noreferrer" className="block py-2 text-sm text-[#B7C5B3] hover:text-white">Threat model ↗</a><a href="https://github.com/OutstandingVick/donstra/blob/main/docs/DEPLOYMENT.md" target="_blank" rel="noreferrer" className="block py-2 text-sm text-[#B7C5B3] hover:text-white">Deployment runbook ↗</a></div>
        </aside>

        <main id="docs-main" className="min-w-0">
          <section id="overview" className="scroll-mt-24 border-b border-white/10 pb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#16DB65]/25 bg-[#16DB65]/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#77E9A1]"><BookOpen size={14} aria-hidden="true" /> Start here</div>
            <h1 className="m-0 max-w-[16ch] text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl">Proof before the action.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#C6D3C2]">Donstra proves that an agent committed to its stated evidence and intent before taking a consequential action. It connects that commitment to exact execution, a challenge, GenLayer adjudication, and an enforceable bond outcome.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#quickstart" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#16DB65] px-5 text-sm font-semibold text-[#071006] hover:bg-[#58EE93]">Run locally <ArrowRight size={16} aria-hidden="true" /></a><Link href="/app" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white hover:bg-white/5">Explore the console <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          </section>

          <section id="how-it-works" className="scroll-mt-24 py-16"><SectionHeading number="01" title="How it works" description="A complete path from pre-action testimony to a verifiable consequence." /><ol className="m-0 list-none space-y-0 p-0">{flow.map(({ number, title, detail }) => <li key={number} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/10 py-5 first:pt-0"><span className="font-mono text-sm font-semibold text-[#77E9A1]">{number}</span><div><h3 className="m-0 text-lg font-semibold">{title}</h3><p className="mb-0 mt-2 text-base leading-7 text-[#B7C5B3]">{detail}</p></div></li>)}</ol></section>

          <section id="trust-model" className="scroll-mt-24 py-16"><SectionHeading number="02" title="What Donstra proves" /><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-[#16DB65]/25 bg-[#16DB65]/[0.06] p-6"><ShieldCheck size={24} className="text-[#77E9A1]" aria-hidden="true" /><h3 className="mt-5 text-xl font-semibold">Verifiable claims</h3><ul className="mb-0 mt-4 space-y-3 ps-5 text-base leading-7 text-[#C6D3C2]"><li>A specific testimony digest existed at the registry timestamp.</li><li>The authorized agent committed it.</li><li>The registry executed the bound action.</li><li>The reveal either matches or differs from that commitment.</li><li>GenLayer validators reached a substantive verdict on genuine testimony.</li></ul></div><div className="rounded-xl border border-white/15 bg-white/[0.03] p-6"><h3 className="mt-0 text-xl font-semibold">The important limit</h3><p className="text-base leading-7 text-[#C6D3C2]">Donstra cannot inspect a model’s private thoughts. It proves contemporaneous commitment: the agent adopted this testimony as its accountable basis before executing the action.</p><p className="mb-0 text-base leading-7 text-[#C6D3C2]">Authenticity is checked by cryptography; reasonableness is judged by validator consensus. These are separate questions.</p></div></div></section>

          <section id="architecture" className="scroll-mt-24 py-16"><SectionHeading number="03" title="Architecture" description="Each layer has one responsibility; none asks an LLM to decide whether bytes match." /><div className="overflow-hidden rounded-xl border border-white/15 bg-[#0D160B]"><div className="grid gap-0 sm:grid-cols-3"><div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-e"><p className="font-mono text-xs uppercase tracking-widest text-[#77E9A1]">01 / SDK</p><h3 className="text-lg font-semibold">Commit and reveal</h3><p className="mb-0 text-sm leading-6 text-[#B7C5B3]">Canonical hashes, testimony validation, encrypted storage, and lifecycle coordination.</p></div><div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-e"><p className="font-mono text-xs uppercase tracking-widest text-[#77E9A1]">02 / Registry</p><h3 className="text-lg font-semibold">Execute and escrow</h3><p className="mb-0 text-sm leading-6 text-[#B7C5B3]">Exact-action execution, agent and challenger bonds, deadlines, and claimable funds.</p></div><div className="p-6"><p className="font-mono text-xs uppercase tracking-widest text-[#77E9A1]">03 / GenLayer + relay</p><h3 className="text-lg font-semibold">Judge and settle</h3><p className="mb-0 text-sm leading-6 text-[#B7C5B3]">Validator consensus on genuine testimony, then authenticated reporter attestations to the EVM settlement relay.</p></div></div></div><p className="mt-5 text-sm leading-6 text-[#B7C5B3]">A mismatch produces <code className="text-[#77E9A1]">FABRICATED</code> without an AI call. Matching testimony can be <code className="text-[#77E9A1]">GENUINE_REASONABLE</code>, <code className="text-[#77E9A1]">GENUINE_NEGLIGENT</code>, or <code className="text-[#77E9A1]">INCONCLUSIVE</code>.</p></section>

          <section id="quickstart" className="scroll-mt-24 py-16"><SectionHeading number="04" title="Quickstart" description="Run the three-receipt demo and web app from the repository root." /><div className="overflow-x-auto rounded-xl border border-white/15 bg-[#101A0E]"><div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#B7C5B3]"><Code2 size={15} aria-hidden="true" /> Terminal</div><pre className="m-0 overflow-x-auto p-5 text-sm leading-7 text-[#E8F5E5]"><code>{`git clone https://github.com/OutstandingVick/donstra.git\ncd donstra\nnpm install\nnpm test\nnpm run build\nnpm run demo\nnpm run dev`}</code></pre></div><p className="mt-5 text-base leading-7 text-[#B7C5B3]">The web app runs at <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-white">http://localhost:3000</code>. The terminal demo illustrates reasonable, negligent, and fabricated testimony using local components; it is not a claim that live testnet transactions have completed.</p><p className="text-base leading-7 text-[#B7C5B3]">GenLayer contract tests additionally require Python 3.12+ and dependencies from <code className="text-white">contracts/genlayer/requirements.txt</code>.</p></section>

          <section id="repository" className="scroll-mt-24 py-16"><SectionHeading number="05" title="Repository guide" description="Find the implementation that owns each part of the lifecycle." /><div className="overflow-hidden rounded-xl border border-white/15"><table className="w-full border-collapse text-left text-sm"><thead className="bg-white/[0.05] text-xs uppercase tracking-widest text-[#B7C5B3]"><tr><th scope="col" className="px-4 py-4 font-semibold sm:px-5">Path</th><th scope="col" className="px-4 py-4 font-semibold sm:px-5">Purpose</th></tr></thead><tbody>{packages.map(({ path, purpose }) => <tr key={path} className="border-t border-white/10 align-top"><th scope="row" className="px-4 py-4 font-mono text-xs font-medium text-[#77E9A1] sm:px-5 sm:text-sm">{path}</th><td className="px-4 py-4 leading-6 text-[#C6D3C2] sm:px-5">{purpose}</td></tr>)}</tbody></table></div></section>

          <section id="deployment" className="scroll-mt-24 py-16"><SectionHeading number="06" title="Deployment status" /><div className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-6"><p className="mt-0 flex items-center gap-2 text-sm font-semibold text-amber-200"><span className="size-2 rounded-full bg-amber-300" /> Testnet candidate</p><p className="mb-0 text-base leading-7 text-[#D9DDD2]">The repository includes the protocol implementation, reporter service, tests, demo, and web console. The initial GenLayer contract is finalized on Studionet, but the commitment-bound revision and EVM contracts remain deployment gates. Do not treat the initial address as the final release.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><a href="https://github.com/OutstandingVick/donstra/blob/main/docs/DEPLOYMENT.md" target="_blank" rel="noreferrer" className="group flex min-h-16 items-center justify-between rounded-lg border border-white/15 px-5 text-sm font-semibold hover:border-[#16DB65]/50">Deployment runbook <ArrowUpRight size={17} className="text-[#77E9A1]" aria-hidden="true" /></a><a href="https://github.com/OutstandingVick/donstra/blob/main/docs/THREAT_MODEL.md" target="_blank" rel="noreferrer" className="group flex min-h-16 items-center justify-between rounded-lg border border-white/15 px-5 text-sm font-semibold hover:border-[#16DB65]/50">Threat model <ArrowUpRight size={17} className="text-[#77E9A1]" aria-hidden="true" /></a></div><p className="mt-6 flex items-start gap-2 text-sm leading-6 text-[#B7C5B3]"><Check size={17} className="mt-1 shrink-0 text-[#77E9A1]" aria-hidden="true" /> Hackathon focus: Agentic Commerce Infrastructure, with AI Governance and Onchain Justice as related applications.</p></section>
        </main>
      </div>
      <footer className="border-t border-white/10 bg-[#0D160B] px-5 py-8 text-sm text-[#B7C5B3] sm:px-8"><div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-4"><p className="m-0">Donstra documentation · Proof before action.</p><Link href="/" className="font-semibold text-[#F3F8F1] hover:text-[#77E9A1]">Back to website →</Link></div></footer>
    </div>
  );
}
