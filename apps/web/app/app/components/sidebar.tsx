"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";
import { navigationItems } from "./navigation";

type SidebarProps = { open: boolean; onClose: () => void };

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && <button type="button" className="fixed inset-0 z-40 bg-black/70 md:hidden" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 start-0 z-50 flex w-[17rem] flex-col border-e border-white/10 bg-[#0A1109] text-[#E8EDE6] transition-transform duration-150 md:translate-x-0`}>
        <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-5">
          <Link href="/app" className="flex min-h-11 items-center gap-3" onClick={onClose}>
            <span className="grid size-8 place-items-center rounded-lg border border-[#16DB65]/30 bg-[#16DB65]/10 text-[#4BED86]"><ShieldCheck size={18} strokeWidth={2} aria-hidden="true" /></span>
            <span className="text-[15px] font-semibold tracking-[0.18em]">DONSTRA</span>
          </Link>
          <button type="button" className="grid size-11 place-items-center rounded-lg text-white/70 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86] md:hidden" aria-label="Close navigation" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5" aria-label="Application">
          <p className="px-3 pb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/35">Workspace</p>
          <ul className="m-0 grid list-none gap-1 p-0">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/app" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg border px-3 text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4BED86] ${active ? "border-[#16DB65]/25 bg-[#16DB65]/10 text-white" : "border-transparent text-white/55 hover:bg-white/[0.04] hover:text-white"}`}>
                    <Icon size={18} strokeWidth={active ? 2 : 1.5} aria-hidden="true" />
                    <span>{item.label}</span>
                    {!item.enabled && <span className="ms-auto text-xs text-white/25">Phase 2</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-white/70"><span className="size-2 rounded-full bg-amber-300" />Testnet candidate</div>
            <p className="mb-0 mt-2 text-xs leading-5 text-white/35">Live protocol addresses are pending deployment.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
