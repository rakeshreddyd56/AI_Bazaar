import type { CategorySlug } from "@/lib/categories";
import { providerFromListing } from "@/lib/branding";
import { inferCategoryForListing, inferSecondaryCategories } from "@/lib/data/catalogue";
import { listingById, publishedListings, reviewsSummary } from "@/lib/data/store";
import { resolveLocale } from "@/lib/i18n";
import { inferIntent } from "@/lib/search/intent";
import { rankListings } from "@/lib/search/ranking";
import type { ComparisonItem, SearchRequest, SearchResult } from "@/lib/types";

const STALE_DAYS = 7;

const isStale = (timestamp?: string) => {
  if (!timestamp) return true;
  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return true;
  const ageInDays = (Date.now() - time) / (1000 * 60 * 60 * 24);
  return ageInDays > STALE_DAYS;
};

const normalizeRequest = (request: SearchRequest): Required<SearchRequest> => ({
  q: request.q.trim(),
  locale: resolveLocale(request.locale),
  intent: request.intent ?? "text",
  category: request.category ?? "all",
});

const toComparisonItem = (id: string): ComparisonItem | undefined => {
  const listing = listingById(id);
  if (!listing) return undefined;

  const freshnessRef = listing.provenance.lastVerifiedAt ?? listing.updatedAt;
  const categoryPrimary =
    listing.categoryPrimary && listing.categoryPrimary !== "all"
      ? listing.categoryPrimary
      : inferCategoryForListing(listing);

  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    modality: listing.modality,
    capabilities: listing.capabilities,
    limitations: listing.limitations,
    pricingUsd: listing.pricingUsd,
    benchmarks: listing.benchmarks,
    provider: listing.provider ?? providerFromListing(listing),
    categoryPrimary,
    categorySecondary:
      listing.categorySecondary ?? inferSecondaryCategories(categoryPrimary, listing),
    riskFlag: listing.riskFlag,
    reviewsSummary: reviewsSummary(listing.id),
    updatedAt: listing.updatedAt,
    source: listing.provenance.source,
    lastVerifiedAt: listing.provenance.lastVerifiedAt,
    stale: isStale(freshnessRef),
  };
};

const explanationForIntent = (intent: string, q: string, category: CategorySlug) => {
  const categoryHint = category === "all" ? "all categories" : `category: ${category}`;

  switch (intent) {
    case "video":
      return `Prioritized video tools for "${q}" using duration, resolution, pricing, and reliability signals (${categoryHint}).`;
    case "image":
      return `Prioritized image/SVG-capable tools for "${q}" with capability and editability signals (${categoryHint}).`;
    case "code":
      return `Prioritized coding tools/models for "${q}" using benchmark quality, cost, setup friction, and category match (${categoryHint}).`;
    case "search":
      return `Prioritized search and retrieval systems for "${q}" using freshness and citation-oriented signals (${categoryHint}).`;
    default:
      return `Ranked results for "${q}" using capability fit, benchmark quality, cost, recency, category match, and reliability (${categoryHint}).`;
  }
};

export const executeSearch = (request: SearchRequest): SearchResult => {
  const normalized = normalizeRequest(request);
  const interpreted = inferIntent(normalized.q);
  const intent = normalized.intent !== "text" ? normalized.intent : interpreted.intent;

  const scopedListings =
    normalized.category === "all"
      ? publishedListings()
      : publishedListings().filter(
          (listing) =>
            listing.categoryPrimary === normalized.category ||
            listing.categorySecondary?.includes(normalized.category),
        );

  const searchPool = scopedListings.length ? scopedListings : publishedListings();

  const scored = rankListings(searchPool, {
    intent,
    tokens: interpreted.tokens,
    capabilityFilters: interpreted.capabilityFilters,
    category: normalized.category,
  });

  const results = scored
    .map((item) => toComparisonItem(item.id))
    .filter((item): item is ComparisonItem => Boolean(item))
    .slice(0, 12);

  return {
    request: {
      ...normalized,
      intent,
    },
    intent,
    explanation: explanationForIntent(intent, normalized.q, normalized.category),
    confidence: Number(interpreted.confidence.toFixed(2)),
    results,
  };
};

export const compareListings = (ids: string[]) =>
  ids
    .map((entry) => toComparisonItem(entry))
    .filter((item): item is ComparisonItem => Boolean(item));

export const comparisonTable = (items: ComparisonItem[]) => {
  const topKeys = (keyspace: "capabilities" | "benchmarks", limit: number) => {
    const count = new Map<string, number>();

    for (const item of items) {
      const source = keyspace === "capabilities" ? item.capabilities : item.benchmarks;
      for (const key of Object.keys(source)) {
        count.set(key, (count.get(key) ?? 0) + 1);
      }
    }

    const common = [...count.entries()]
      .filter(([, seen]) => seen >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => key);

    if (common.length) return common;
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => key);
  };

  const capabilityKeys = topKeys("capabilities", 8);
  const benchmarkKeys = topKeys("benchmarks", 6);
  const anyRiskFlag = items.some((item) => Boolean(item.riskFlag));

  const rows = [
    {
      metric: "reviewsSummary.rating",
      values: items.map((item) => item.reviewsSummary.rating || "-"),
    },
    {
      metric: "pricing.inputPerM",
      values: items.map((item) => item.pricingUsd?.inputPerM ?? "-"),
    },
    {
      metric: "pricing.outputPerM",
      values: items.map((item) => item.pricingUsd?.outputPerM ?? "-"),
    },
    {
      metric: "pricing.monthly",
      values: items.map((item) => item.pricingUsd?.monthly ?? "-"),
    },
    {
      metric: "freshness.stale",
      values: items.map((item) => item.stale),
    },
    ...(anyRiskFlag
      ? [
          {
            metric: "risk.flag",
            values: items.map((item) => item.riskFlag?.level ?? "-"),
          },
        ]
      : []),
    ...capabilityKeys.map((key) => ({
      metric: `capabilities.${key}`,
      values: items.map((item) => item.capabilities[key] ?? "-"),
    })),
    ...benchmarkKeys.map((key) => ({
      metric: `benchmarks.${key}`,
      values: items.map((item) => item.benchmarks[key] ?? "-"),
    })),
  ];

  return {
    columns: items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      provider: item.provider,
    })),
    rows,
  };
};
