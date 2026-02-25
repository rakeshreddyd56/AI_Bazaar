"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { CurrencyCode } from "@/lib/currency";

type Props = {
  currency: CurrencyCode;
  variant?: "dark" | "light";
};

export function CurrencySwitch({ currency, variant = "dark" }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();

  const options: Array<{ key: CurrencyCode; label: string }> = [
    { key: "USD", label: "$" },
    { key: "INR", label: "₹" },
    { key: "EUR", label: "€" },
  ];

  const shellClass =
    variant === "dark"
      ? "border-white/20 bg-black/20"
      : "border-neutral-300 bg-white shadow-sm";
  const activeClass =
    variant === "dark"
      ? "bg-white !text-neutral-900 shadow-sm"
      : "bg-neutral-900 !text-white shadow-sm";
  const inactiveClass =
    variant === "dark"
      ? "text-neutral-100 hover:bg-white/15"
      : "text-neutral-700 hover:bg-neutral-100";

  return (
    <div className={`inline-grid grid-cols-3 rounded-full border p-1 ${shellClass}`}>
      {options.map((option) => {
        const query = new URLSearchParams(params.toString());
        query.set("currency", option.key);
        const active = currency === option.key;

        return (
          <Link
            key={option.key}
            href={`${pathname}?${query.toString()}`}
            aria-current={active ? "page" : undefined}
            className={`relative inline-flex min-w-[2.2rem] items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-semibold leading-none tracking-tight transition-colors ${
              active ? activeClass : inactiveClass
            }`}
            title={option.key}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
