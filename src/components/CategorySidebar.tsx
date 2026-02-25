"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  categoryDefinitions,
  categoryLabel,
  type CategorySlug,
} from "@/lib/categories";

type Props = {
  locale: "en-IN" | "hi-IN";
  selected: CategorySlug;
};

export function CategorySidebar({ locale, selected }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <div className="space-y-3">
      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categoryDefinitions.map((entry) => {
            const query = new URLSearchParams(params.toString());
            query.set("category", entry.slug);
            query.set("locale", locale);
            const active = selected === entry.slug;

            return (
              <Link
                key={entry.slug}
                href={`${pathname}?${query.toString()}`}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {categoryLabel(entry.slug, locale)}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="hidden rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm md:block">
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Categories
        </h2>
        <nav className="space-y-1">
          {categoryDefinitions.map((entry) => {
            const query = new URLSearchParams(params.toString());
            query.set("category", entry.slug);
            query.set("locale", locale);
            const active = selected === entry.slug;

            return (
              <Link
                key={entry.slug}
                href={`${pathname}?${query.toString()}`}
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {categoryLabel(entry.slug, locale)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
