import type { CategorySlug } from "@/lib/categories";
import { reviewsSummary } from "@/lib/data/store";
import { riskFlagForListing, riskSensitiveQuery } from "@/lib/risk/flags";
import type { Intent, Listing } from "@/lib/types";
import { clamp, tokenize } from "@/lib/utils";

type RankingContext = {
  intent: string;
  tokens: string[];
  capabilityFilters: Record<string, string | number | boolean>;
  category: CategorySlug;
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
  categoryBoost: number;
  riskAdjustment: number;
};

const weights = {
  capabilityFit: 0.3,
  benchmarkQuality: 0.2,
  recency: 0.1,
  costEfficiency: 0.13,
  reliability: 0.17,
  popularity: 0.1,
};

const capabilityScore = (listing: Listing, context: RankingContext) => {
  const hasIntent = listing.modality.includes(context.intent as never);
  let score = hasIntent ? 78 : 8;

  const listingText = [listing.name, ...listing.tags, ...listing.limitations]
    .join(" ")
    .toLowerCase();
  const nameText = listing.name.toLowerCase();
  const matchedTokens = context.tokens.filter((token) => listingText.includes(token));

  score += matchedTokens.length * 1.8;
  if (matchedTokens.length > 0 && matchedTokens.length === context.tokens.length) score += 18;
  if (context.tokens.some((token) => nameText.includes(token))) score += 10;

  const wantsVoice = context.tokens.some((token) =>
    ["voice", "tts", "speech", "audio"].includes(token),
  );
  const wantsAgent = context.tokens.some((token) =>
    ["agent", "agents", "workflow", "orchestration", "autonomous"].includes(token),
  );
  const wantsFramework = context.tokens.some((token) =>
    ["framework", "frameworks", "sdk", "platform"].includes(token),
  );

  if (wantsVoice) {
    const voiceSignalKeys = [
      "voiceCloning",
      "textToSpeech",
      "speechToText",
      "audioToAudio",
      "realtimeStreaming",
      "latencyMsClaim",
      "supportedLanguages",
    ];

    const hasVoiceSignals = voiceSignalKeys.some((key) => {
      const value = listing.capabilities[key];
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return false;
    });

    score += hasVoiceSignals ? 18 : -12;
  }

  if (wantsAgent) {
    const agentSignalKeys = [
      "toolCalling",
      "statefulExecution",
      "multiAgentCoordination",
      "agentHandoffs",
      "workflowState",
      "humanApprovalSteps",
      "handoffs",
    ];

    const hasAgentSignals = agentSignalKeys.some((key) => {
      const value = listing.capabilities[key];
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return false;
    });

    const agentTagBoost = listing.tags.some((tag) =>
      ["agent", "agents", "workflow", "orchestration", "framework"].some((entry) =>
        tag.includes(entry),
      ),
    )
      ? 10
      : 0;

    score += hasAgentSignals ? 14 + agentTagBoost : -10;
  }

  if (wantsFramework) {
    const hasFrameworkSignal = listing.tags.some((tag) =>
      ["framework", "sdk", "workflow", "orchestration", "platform"].some((entry) =>
        tag.includes(entry),
      ),
    );
    score += hasFrameworkSignal ? 22 : -15;
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

const reliabilityScore = (listing: Listing) => {
  const benchmark = benchmarkScore(listing);
  const safety = clamp(listing.risk.safetyScore * 100, 0, 100);
  const compliance =
    listing.compliance.commercialUse === "allowed"
      ? 90
      : listing.compliance.commercialUse === "restricted"
        ? 58
        : 45;

  return clamp(benchmark * 0.55 + (100 - safety) * 0.25 + compliance * 0.2, 0, 100);
};

const popularityScore = (listing: Listing) => {
  const base = tokenize(listing.provenance.source).includes("rankings") ? 76 : 58;
  const reviewBoost = Math.min(20, reviewsSummary(listing.id).count * 4);
  return clamp(base + reviewBoost, 0, 100);
};

const categoryBoostScore = (listing: Listing, category: CategorySlug) => {
  if (category === "all") return 0;
  if (listing.categoryPrimary === category) return 14;
  if (listing.categorySecondary?.includes(category)) return 8;
  return -4;
};

const riskAdjustmentScore = (listing: Listing, context: RankingContext) => {
  const flag = listing.riskFlag ?? riskFlagForListing(listing);
  if (!flag) return 0;

  const isSensitive = riskSensitiveQuery(context.intent as Intent, context.tokens);

  if (!isSensitive) return 0;
  return flag.level === "high" ? 12 : 6;
};

export const rankListings = (listings: Listing[], context: RankingContext) => {
  const scored: ScoreBreakdown[] = listings.map((listing) => {
    const capabilityFit = capabilityScore(listing, context);
    const benchmarkQuality = benchmarkScore(listing);
    const recency = recencyScore(listing);
    const costEfficiency = costScore(listing);
    const reliability = reliabilityScore(listing);
    const popularity = popularityScore(listing);
    const categoryBoost = categoryBoostScore(listing, context.category);
    const riskAdjustment = riskAdjustmentScore(listing, context);

    const score =
      capabilityFit * weights.capabilityFit +
      benchmarkQuality * weights.benchmarkQuality +
      recency * weights.recency +
      costEfficiency * weights.costEfficiency +
      reliability * weights.reliability +
      popularity * weights.popularity +
      categoryBoost -
      riskAdjustment;

    return {
      id: listing.id,
      score: Number(score.toFixed(2)),
      capabilityFit,
      benchmarkQuality,
      recency,
      costEfficiency,
      reliability,
      popularity,
      categoryBoost,
      riskAdjustment,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
};
