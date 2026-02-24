import { healthForListing } from "@/lib/health/score";
import { resolveLocale } from "@/lib/i18n";
import { listingById, publishedListings, reviewsSummary } from "@/lib/data/store";
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
  persona: request.persona ?? "builder",
  locale: resolveLocale(request.locale),
  intent: request.intent ?? "text",
});

const toComparisonItem = (id: string): ComparisonItem | undefined => {
  const listing = listingById(id);
  if (!listing) return undefined;

  const health = healthForListing(listing);
  const freshnessRef = listing.provenance.lastVerifiedAt ?? listing.updatedAt;
  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    modality: listing.modality,
    capabilities: listing.capabilities,
    limitations: listing.limitations,
    pricingUsd: listing.pricingUsd,
    benchmarks: listing.benchmarks,
    health: {
      level: health.level,
      score: health.score,
      reasons: health.reasons,
    },
    reviewsSummary: reviewsSummary(listing.id),
    updatedAt: listing.updatedAt,
    source: listing.provenance.source,
    lastVerifiedAt: listing.provenance.lastVerifiedAt,
    stale: isStale(freshnessRef),
  };
};

const explanationForIntent = (intent: string, q: string) => {
  switch (intent) {
    case "video":
      return `Prioritized video tools for \"${q}\" using duration, resolution, pricing, and reliability signals.`;
    case "image":
      return `Prioritized image/SVG-capable tools for \"${q}\" with capability and editability signals.`;
    case "code":
      return `Prioritized coding tools/models for \"${q}\" using benchmark quality, cost, and setup friction.`;
    case "search":
      return `Prioritized search and retrieval systems for \"${q}\" using freshness and citation-oriented signals.`;
    default:
      return `Ranked results for \"${q}\" using capability-fit, benchmark quality, cost, recency, and health penalties.`;
  }
};

export const executeSearch = (request: SearchRequest): SearchResult => {
  const normalized = normalizeRequest(request);
  const interpreted = inferIntent(normalized.q);
  const intent = normalized.intent !== "text" ? normalized.intent : interpreted.intent;

  const scored = rankListings(publishedListings(), {
    query: normalized.q,
    intent,
    tokens: interpreted.tokens,
    capabilityFilters: interpreted.capabilityFilters,
    persona: normalized.persona,
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
    explanation: explanationForIntent(intent, normalized.q),
    confidence: Number(interpreted.confidence.toFixed(2)),
    results,
  };
};

export const compareListings = (ids: string[]) =>
  ids
    .map((entry) => toComparisonItem(entry))
    .filter((item): item is ComparisonItem => Boolean(item));

export const comparisonTable = (items: ComparisonItem[]) => {
  const metrics = [
    "health.score",
    "reviewsSummary.rating",
    "capabilities.maxVideoDurationSec",
    "capabilities.maxResolution",
    "capabilities.contextTokens",
    "capabilities.outputsValidSvg",
    "capabilities.supportsImageToVideo",
    "capabilities.voiceCloning",
    "capabilities.toolCalling",
    "benchmarks",
  ] as const;

  const rows = metrics.map((metric) => {
    const values = items.map((item) => {
      if (metric === "health.score") return item.health.score;
      if (metric === "reviewsSummary.rating") return item.reviewsSummary.rating || "-";
      if (metric === "benchmarks") return item.benchmarks;
      if (metric.startsWith("capabilities.")) {
        const key = metric.replace("capabilities.", "");
        return item.capabilities[key] ?? "-";
      }
      return "-";
    });

    return {
      metric,
      values,
    };
  });

  return {
    columns: items.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
    })),
    rows,
  };
};
