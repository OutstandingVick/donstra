import { AlertCircle, CheckCircle2, CircleDashed, Database, ShieldAlert } from "lucide-react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#4BED86]">{eyebrow}</p><h1 className="mb-0 mt-3 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{title}</h1><p className="mb-0 mt-3 max-w-2xl text-pretty text-base leading-7 text-white/60">{description}</p></div>{action}</header>;
}

export function DemoBanner({ live = false }: { live?: boolean }) {
  return <div className={`mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-6 ${live ? "border-[#16DB65]/25 bg-[#16DB65]/10 text-[#B9F8CF]" : "border-amber-300/20 bg-amber-300/[0.07] text-amber-100/80"}`}>{live ? <CheckCircle2 className="mt-0.5 shrink-0" size={16} aria-hidden="true" /> : <Database className="mt-0.5 shrink-0" size={16} aria-hidden="true" />}<span>{live ? "Live mode: records are read from the configured registry." : "Demo mode: records are illustrative. Contract addresses, reporter addresses, and transaction hashes remain unavailable until verified deployments are configured."}</span></div>;
}

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: "good" | "danger" | "warning" | "neutral" }) {
  const styles = tone === "good" ? "border-[#16DB65]/25 bg-[#16DB65]/10 text-[#80F4A9]" : tone === "danger" ? "border-[#A94C4E]/35 bg-[#5C1A1B]/20 text-[#FFB7B7]" : tone === "warning" ? "border-amber-300/20 bg-amber-300/[0.07] text-amber-100/80" : "border-white/10 bg-white/[0.035] text-white/60";
  const Icon = tone === "good" ? CheckCircle2 : tone === "danger" ? ShieldAlert : tone === "warning" ? AlertCircle : CircleDashed;
  return <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-semibold ${styles}`}><Icon size={13} aria-hidden="true" />{label}</span>;
}

export function DataField({ label, value, mono = false, children }: { label: string; value?: string | null; mono?: boolean; children?: React.ReactNode }) {
  return <div className="min-w-0 py-3"><dt className="text-xs font-medium text-white/50">{label}</dt><dd className={`m-0 mt-1.5 break-words text-sm leading-6 text-white/80 ${mono ? "font-mono text-xs" : ""}`}>{children ?? value ?? "Not available"}</dd></div>;
}

export function LoadNotice({ loading, error, empty, noun }: { loading: boolean; error: string | null; empty: boolean; noun: string }) {
  if (loading) return <p role="status" className="mt-8 rounded-lg border border-white/10 bg-white/[0.025] p-5 text-sm text-white/60">Loading {noun}…</p>;
  if (error) return <p role="alert" className="mt-8 rounded-lg border border-[#A94C4E]/35 bg-[#5C1A1B]/20 p-5 text-sm leading-6 text-[#FFB7B7]">Unable to load {noun}. {error}</p>;
  if (empty) return <p className="mt-8 rounded-lg border border-white/10 bg-white/[0.025] p-5 text-sm text-white/60">No {noun} are available for the configured source.</p>;
  return null;
}
