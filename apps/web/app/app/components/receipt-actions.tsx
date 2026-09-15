"use client";

import { useState } from "react";
import { Check, Download, Link2 } from "lucide-react";
import type { ReceiptRecord } from "../lib/protocol";

export function ReceiptActions({ receipt }: { receipt: ReceiptRecord }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function download() {
    const payload = JSON.stringify(receipt, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${receipt.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div className="flex flex-wrap gap-2">
    <button type="button" onClick={() => void copyLink()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.025] px-4 text-sm font-semibold text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]">{copied ? <Check size={16} className="text-[#80F4A9]" aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}{copied ? "Link copied" : "Copy link"}</button>
    <button type="button" onClick={download} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.025] px-4 text-sm font-semibold text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]"><Download size={16} aria-hidden="true" />Download JSON</button>
  </div>;
}
