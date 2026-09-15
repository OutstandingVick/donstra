"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyValue({ value, label = "Copy value" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return <button type="button" onClick={() => void copy()} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.025] px-3 text-xs font-semibold text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]" aria-label={copied ? "Copied" : label}>{copied ? <Check size={14} className="text-[#80F4A9]" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? "Copied" : "Copy"}</button>;
}
