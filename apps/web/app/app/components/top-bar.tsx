"use client";

import { Menu, Radio, Wallet } from "lucide-react";

type TopBarProps = { onOpenNavigation: () => void };

export function TopBar({ onOpenNavigation }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-white/10 bg-[#0D160B] px-4 text-[#E8EDE6] sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" className="grid size-11 place-items-center rounded-lg border border-white/10 text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86] md:hidden" aria-label="Open navigation" onClick={onOpenNavigation}>
          <Menu size={20} aria-hidden="true" />
        </button>
        <div className="hidden items-center gap-2 text-sm text-white/50 sm:flex">
          <Radio size={16} className="text-[#4BED86]" aria-hidden="true" />
          <span>Sepolia</span>
          <span className="text-white/20">+</span>
          <span>GenLayer Studionet</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60 sm:hidden"><Radio size={16} className="text-[#4BED86]" aria-hidden="true" />Testnets</div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-2 text-xs text-white/40 lg:flex"><span className="size-1.5 rounded-full bg-amber-300" />Mock protocol state</span>
        <button type="button" className="flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.035] px-3 text-sm font-medium text-white/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86]" aria-label="Wallet connection is not available in Phase 1">
          <Wallet size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Wallet not connected</span>
          <span className="sm:hidden">Wallet</span>
        </button>
      </div>
    </header>
  );
}
