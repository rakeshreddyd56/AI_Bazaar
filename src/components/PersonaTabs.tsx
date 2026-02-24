"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Persona } from "@/lib/types";

type Props = {
  value: Persona;
  labels: Record<Persona, string>;
  variant?: "dark" | "light";
};

const personas: Persona[] = ["builder", "business", "research"];

export function PersonaTabs({ value, labels, variant = "dark" }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();

  const shellClass =
    variant === "dark"
      ? "border-white/20 bg-black/20"
      : "border-neutral-300 bg-white";

  return (
    <div className={`inline-flex rounded-full border p-1 ${shellClass}`}>
      {personas.map((persona) => {
        const query = new URLSearchParams(params.toString());
        query.set("persona", persona);

        const active = persona === value;
        const activeClass =
          variant === "dark"
            ? "bg-amber-300 text-neutral-900"
            : "bg-neutral-900 text-white";
        const inactiveClass =
          variant === "dark"
            ? "text-neutral-100 hover:bg-white/15"
            : "text-neutral-700 hover:bg-neutral-100";
        return (
          <Link
            key={persona}
            href={`${pathname}?${query.toString()}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active ? activeClass : inactiveClass
            }`}
          >
            {labels[persona]}
          </Link>
        );
      })}
    </div>
  );
}
