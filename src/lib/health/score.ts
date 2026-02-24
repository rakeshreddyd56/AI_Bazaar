import type { HealthLevel, Listing } from "@/lib/types";
import { clamp } from "@/lib/utils";

const setupDifficultyScore = (listing: Listing) => {
  const apiKeyPenalty = listing.integration.requiresApiKey ? 20 : 6;
  const sdkPenalty =
    listing.integration.sdkQuality === "high"
      ? 8
      : listing.integration.sdkQuality === "medium"
        ? 15
        : 23;
  const hostPenalty =
    listing.integration.selfHostDifficulty === "easy"
      ? 7
      : listing.integration.selfHostDifficulty === "medium"
        ? 15
        : 24;
  return clamp(apiKeyPenalty + sdkPenalty + hostPenalty, 0, 100);
};

const safetyRiskScore = (listing: Listing) => {
  const base = clamp(listing.risk.safetyScore * 100, 0, 100);
  const misusePenalty = Math.min(20, listing.risk.misuseTags.length * 4);
  return clamp(base + misusePenalty, 0, 100);
};

const complianceRiskScore = (listing: Listing) => {
  const licenseUnknown = listing.compliance.license.toLowerCase() === "unknown" ? 35 : 10;
  const commercialRisk =
    listing.compliance.commercialUse === "allowed"
      ? 8
      : listing.compliance.commercialUse === "restricted"
        ? 32
        : 38;
  return clamp(licenseUnknown + commercialRisk, 0, 100);
};

const levelForScore = (score: number): HealthLevel => {
  if (score <= 33) return "low";
  if (score <= 66) return "medium";
  return "high";
};

export const healthForListing = (listing: Listing) => {
  const setup = setupDifficultyScore(listing);
  const safety = safetyRiskScore(listing);
  const compliance = complianceRiskScore(listing);

  const score = clamp(Math.round(setup * 0.35 + safety * 0.4 + compliance * 0.25), 0, 100);

  const reasons: string[] = [];
  if (setup >= 60) reasons.push("Setup complexity is above average.");
  if (safety >= 60) reasons.push("Safety/misuse exposure requires stronger guardrails.");
  if (compliance >= 60) reasons.push("License/commercial terms require careful review.");
  if (!reasons.length) reasons.push("Good baseline for controlled deployment.");

  return {
    level: levelForScore(score),
    score,
    reasons,
    dimensions: {
      setup,
      safety,
      compliance,
    },
  };
};
