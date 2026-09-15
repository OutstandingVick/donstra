"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: ReactNode }) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div id="donstra-app">
      <div className="min-h-screen bg-[#0D160B] font-sans text-[#E8EDE6] antialiased selection:bg-[#16DB65]/30">
      <a href="#main-workspace" className="fixed start-3 top-[-5rem] z-[60] rounded-md bg-[#E8EDE6] px-4 py-2 text-sm font-semibold text-[#0D160B] focus:top-3">Skip to workspace</a>
      <Sidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="min-w-0 md:ps-[17rem]">
        <TopBar onOpenNavigation={() => setNavigationOpen(true)} />
        <main id="main-workspace" className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_72%_0%,rgba(22,219,101,0.08),transparent_24%),radial-gradient(circle_at_95%_12%,rgba(92,26,27,0.16),transparent_28%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
      </div>
    </div>
  );
}
