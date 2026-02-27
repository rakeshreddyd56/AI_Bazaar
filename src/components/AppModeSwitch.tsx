"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ConsoleMode } from "@/lib/types";

type Props = {
  mode: ConsoleMode;
  variant?: "dark" | "light";
};

export function AppModeSwitch({ mode, variant = "dark" }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();

  const query = params.toString();
  const homeHref = query ? `/?${query}` : "/";
  const consoleHref = query ? `/console/models?${query}` : "/console/models";

  const shellClass =
    variant === "dark"
      ? "border-white/20 bg-black/20"
      : "border-neutral-300 bg-white shadow-sm";

  const activeClass =
    variant === "dark"
      ? "bg-white text-neutral-900"
      : "bg-neutral-900 text-white";

  const inactiveClass =
    variant === "dark"
      ? "text-neutral-100 hover:bg-white/15"
      : "text-neutral-700 hover:bg-neutral-100";

  const activeMode: ConsoleMode = pathname.startsWith("/console") ? "console" : mode;

  return (
    <div className={`inline-grid grid-cols-2 rounded-full border p-1 ${shellClass}`}>
      <Link
        href={homeHref}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          activeMode === "marketplace" ? activeClass : inactiveClass
        }`}
      >
        Marketplace
      </Link>
      <Link
        href={consoleHref}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          activeMode === "console" ? activeClass : inactiveClass
        }`}
      >
        Console
      </Link>
    </div>
  );
}
