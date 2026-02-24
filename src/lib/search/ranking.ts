import { healthForListing } from "@/lib/health/score";
import { reviewsSummary } from "@/lib/data/store";
import type { Listing, Persona } from "@/lib/types";
import { clamp, tokenize } from "@/lib/utils";

type RankingContext = {
  query: string;
  intent: string;
  tokens: string[];
  capabilityFilters: Record<string, string | number | boolean>;
  persona: Persona;
};

type ScoreBreakdown = {
  id: string;
  score: number;
  capabilityFit: number;
  benchmarkQuality: number;
  recency: number;
  costEfficiency: number;
  reliability: number;
  popularity: number;
  healthPenalty: number;
};

const personaWeights: Record<
  Persona,
  {
    capabilityFit: number;
    benchmarkQuality: number;
    recency: number;
    costEfficiency: number;
    reliability: number;
    popularity: number;
    healthPenalty: number;
  }
> = {
  builder: {
    capabilityFit: 0.28,
    benchmarkQuality: 0.14,
    recency: 0.1,
    costEfficiency: 0.17,
    reliability: 0.15,
    popularity: 0.09,
    healthPenalty: 0.07,
  },
  business: {
    capabilityFit: 0.16,
    benchmarkQuality: 0.12,
    recency: 0.07,
    costEfficiency: 0.12,
    reliability: 0.24,
    popularity: 0.09,
    healthPenalty: 0.2,
  },
  research: {
    capabilityFit: 0.17,
    benchmarkQuality: 0.3,
    recency: 0.11,
    costEfficiency: 0.08,
    reliability: 0.15,
    popularity: 0.07,
    healthPenalty: 0.12,
  },
};

const capabilityScore = (listing: Listing, context: RankingContext) => {
  const hasIntent = listing.modality.includes(context.intent as never);
  let score = hasIntent ? 75 : 30;

  const listingText = [listing.name, ...listing.tags, ...listing.limitations]
    .join(" ")
    .toLowerCase();

  for (const token of context.tokens) {
    if (listingText.includes(token)) score += 1.8;
  }

  for (const [key, value] of Object.entries(context.capabilityFilters)) {
    const listingValue = listing.capabilities[key];

    if (typeof value === "boolean") {
      if (listingValue === value) score += 10;
      else score -= 8;
      continue;
    }

    if (typeof value === "number") {
      if (typeof listingValue === "number") {
        score += listingValue >= value ? 12 : -10;
      }
      continue;
    }

    if (typeof value === "string") {
      if (typeof listingValue === "string" && listingValue.toLowerCase().includes(value)) {
        score += 9;
      }
    }
  }

  return clamp(score, 0, 100);
};

const benchmarkScore = (listing: Listing) => {
  const values = Object.values(listing.benchmarks).filter((value) => Number.isFinite(value));
  if (!values.length) return 40;
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return clamp(avg, 0, 100);
};

const recencyScore = (listing: Listing) => {
  const updated = new Date(listing.updatedAt).getTime();
  const daysOld = (Date.now() - updated) / (1000 * 60 * 60 * 24);
  return clamp(100 - daysOld * 3.5, 0, 100);
};

const costScore = (listing: Listing) => {
  if (!listing.pricingUsd) return 60;
  const perM = (listing.pricingUsd.inputPerM ?? 0) + (listing.pricingUsd.outputPerM ?? 0);
  const monthly = listing.pricingUsd.monthly ?? 0;

  if (perM === 0 && monthly === 0) return 92;
  if (monthly > 0) return clamp(100 - monthly * 0.9, 15, 95);
  return clamp(100 - perM * 2.8, 20, 95);
};

const reliabilityScore = (
  listing: Listing,
  health: ReturnType<typeof healthForListing>,
) => {
  const benchmark = benchmarkScore(listing);
  const safety = health.dimensions.safety;
  const compliance = health.dimensions.compliance;
  return clamp(benchmark * 0.6 + (100 - safety) * 0.2 + (100 - compliance) * 0.2, 0, 100);
};

const popularityScore = (listing: Listing) => {
  const base = tokenize(listing.provenance.source).includes("rankings") ? 76 : 58;
  const reviewBoost = Math.min(20, reviewsSummary(listing.id).count * 4);
  return clamp(base + reviewBoost, 0, 100);
};

export const rankListings = (listings: Listing[], context: RankingContext) => {
  const weights = personaWeights[context.persona];

  const scored: ScoreBreakdown[] = listings.map((listing) => {
    const health = healthForListing(listing);
    const capabilityFit = capabilityScore(listing, context);
    const benchmarkQuality = benchmarkScore(listing);
    const recency = recencyScore(listing);
    const costEfficiency = costScore(listing);
    const reliability = reliabilityScore(listing, health);
    const popularity = popularityScore(listing);
    const healthPenalty = health.score;

    const score =
      capabilityFit * weights.capabilityFit +
      benchmarkQuality * weights.benchmarkQuality +
      recency * weights.recency +
      costEfficiency * weights.costEfficiency +
      reliability * weights.reliability +
      popularity * weights.popularity -
      healthPenalty * weights.healthPenalty;

    return {
      id: listing.id,
      score: Number(score.toFixed(2)),
      capabilityFit,
      benchmarkQuality,
      recency,
      costEfficiency,
      reliability,
      popularity,
      healthPenalty,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
};
