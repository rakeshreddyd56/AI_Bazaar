import Link from "next/link";
import { Suspense } from "react";
import { AppModeSwitch } from "@/components/AppModeSwitch";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/console/models", label: "Models" },
  { href: "/console/playground", label: "Playground" },
  { href: "/console/api-keys", label: "API Keys" },
  { href: "/console/usage", label: "Usage" },
  { href: "/console/docs", label: "Docs" },
  { href: "/console/status", label: "Status" },
];

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1119] text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/aibazaar-mark.png"
              alt="AI Bazaar"
              className="h-10 w-10 rounded-lg border border-white/10 bg-black/40 p-1"
            />
            <div>
              <p className="text-sm font-semibold">AI Bazaar Console</p>
              <p className="text-xs text-neutral-400">OpenAI-compatible inference and runtime controls</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Suspense
              fallback={
                <div className="inline-grid grid-cols-2 rounded-full border border-white/20 bg-black/20 p-1 text-xs text-neutral-400">
                  <span className="rounded-full px-3 py-1.5">Marketplace</span>
                  <span className="rounded-full px-3 py-1.5">Console</span>
                </div>
              }
            >
              <AppModeSwitch mode="console" variant="dark" />
            </Suspense>
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-black/45"
            >
              Marketplace
            </Link>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Console
            </p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="block rounded-xl px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
                >
                  {section.label}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="space-y-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
