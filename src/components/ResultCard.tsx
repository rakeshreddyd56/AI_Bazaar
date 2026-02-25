import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { resolveBrand } from "@/lib/branding";
import type { ComparisonItem } from "@/lib/types";

const levelColor = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
} as const;

type Props = {
  item: ComparisonItem;
};

export function ResultCard({ item }: Props) {
  const freshnessLabel = item.stale
    ? "Stale data"
    : `Updated ${new Date(item.lastVerifiedAt ?? item.updatedAt).toLocaleDateString("en-IN")}`;
  const brandTarget = {
    id: item.id,
    slug: item.slug,
    name: item.name,
    source: item.source,
  };
  const brand = resolveBrand(brandTarget);

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <BrandLogo target={brandTarget} size="md" />
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{item.name}</h3>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-500">
              {brand.label}
            </p>
            <p className="text-xs text-neutral-500">{item.modality.join(" • ")}</p>
            <p
              className={`mt-1 text-[11px] ${
                item.stale ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {freshnessLabel}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${levelColor[item.health.level]}`}
        >
          Health: {item.health.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700">
        <div className="rounded-xl bg-neutral-100 p-2">
          <div className="text-neutral-500">Avg rating</div>
          <div className="text-sm font-semibold">{item.reviewsSummary.rating || "-"}</div>
        </div>
        <div className="rounded-xl bg-neutral-100 p-2">
          <div className="text-neutral-500">Reviews</div>
          <div className="text-sm font-semibold">{item.reviewsSummary.count}</div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs font-medium text-neutral-600">Top limitations</p>
        <ul className="space-y-1">
          {item.limitations.slice(0, 2).map((limitation) => (
            <li key={limitation} className="text-xs text-neutral-700">
              • {limitation}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-neutral-500">
          {typeof item.pricingUsd?.monthly === "number"
            ? `~$${item.pricingUsd.monthly}/mo`
            : item.pricingUsd?.inputPerM || item.pricingUsd?.outputPerM
              ? `$${item.pricingUsd.inputPerM ?? 0}/$${item.pricingUsd.outputPerM ?? 0} per 1M`
              : "Pricing varies"}
        </div>
        <Link
          href={`/listings/${item.slug}`}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-900 hover:text-white"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
