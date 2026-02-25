import type { Intent, Listing, RiskFlag } from "@/lib/types";

const highRiskTags = new Set([
  "impersonation",
  "deepfake",
  "social-engineering",
  "safety-critical misuse",
]);

const watchlistTags = new Set([
  "misinformation",
  "copyright",
  "policy-bypass",
  "voice-cloning",
  "open-model-misuse",
  "prompt-injection",
]);

const manualOverrides: Record<string, RiskFlag> = {
  "openclaw-openclaw-agent-core": {
    level: "high",
    reasons: [
      "Public misuse concerns reported around autonomous impersonation workflows.",
      "Policy/compliance guidance is inconsistent across community forks.",
    ],
  },
  "openclaw-openclaw-cli": {
    level: "watchlist",
    reasons: [
      "Mixed public reactions on safety guardrails and abuse handling.",
    ],
  },
  "openclaw-openclaw-code-agent": {
    level: "watchlist",
    reasons: [
      "Mixed public reactions around autonomous coding with external action tooling.",
    ],
  },
};

const unique = (values: string[]) => [...new Set(values)];

export const riskFlagForListing = (listing: Listing): RiskFlag | undefined => {
  const manual = manualOverrides[listing.id];
  if (manual) return manual;

  const tags = new Set(listing.risk.misuseTags.map((entry) => entry.toLowerCase()));
  const high = [...tags].filter((tag) => highRiskTags.has(tag));
  const watch = [...tags].filter((tag) => watchlistTags.has(tag));

  const unclearCommercial = listing.compliance.commercialUse === "unknown";

  if (high.length >= 1 || (high.length === 0 && watch.length >= 2 && unclearCommercial)) {
    return {
      level: "high",
      reasons: unique([
        ...high.map((tag) => `High-risk misuse tag: ${tag}`),
        ...watch.map((tag) => `Risk signal: ${tag}`),
        ...(unclearCommercial
          ? ["Commercial/compliance policy clarity is limited."]
          : []),
      ]),
    };
  }

  if (watch.length >= 1) {
    return {
      level: "watchlist",
      reasons: unique([
        ...watch.map((tag) => `Risk signal: ${tag}`),
        ...(unclearCommercial
          ? ["Commercial/compliance policy clarity is limited."]
          : []),
      ]),
    };
  }

  return undefined;
};

export const riskSensitiveQuery = (intent: Intent, tokens: string[]) => {
  const sensitiveTokens = [
    "safe",
    "safety",
    "compliance",
    "policy",
    "enterprise",
    "deepfake",
    "impersonation",
    "watchlist",
    "risk",
    "regulated",
  ];

  if (intent === "video" || intent === "audio" || intent === "agent") {
    if (tokens.some((token) => ["clone", "voice", "avatar", "agent", "autonomous"].includes(token))) {
      return true;
    }
  }

  return tokens.some((token) => sensitiveTokens.includes(token));
};
