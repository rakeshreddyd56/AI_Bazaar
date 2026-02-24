import type { IngestResult, Listing } from "@/lib/types";
import { normalize, nowIso } from "@/lib/utils";

const AA_MODELS = "https://artificialanalysis.ai/api/v2/data/llms/models";

type AAModel = {
  id?: string;
  name?: string;
  evaluations?: Record<string, number>;
  pricing?: {
    input_per_million_tokens?: number;
    output_per_million_tokens?: number;
  };
  median_output_tokens_per_second?: number;
  median_time_to_first_token_seconds?: number;
};

const modelToListing = (
  model: AAModel,
): Partial<Listing> & Pick<Listing, "id" | "name"> => ({
  id: normalize(`aa-${model.id ?? model.name ?? "unknown"}`),
  slug: normalize(`aa-${model.id ?? model.name ?? "unknown"}`),
  name: model.name ?? model.id ?? "Unknown model",
  summary: {
    "en-IN": "Independent benchmark snapshot from Artificial Analysis.",
    "hi-IN": "Artificial Analysis से स्वतंत्र benchmark snapshot।",
  },
  modality: ["text", "code"],
  tags: ["artificial-analysis", "benchmark"],
  capabilities: {
    tokensPerSecond: model.median_output_tokens_per_second ?? 0,
    ttftSeconds: model.median_time_to_first_token_seconds ?? 0,
  },
  limitations: ["Requires API key and daily rate limit awareness."],
  benchmarks: model.evaluations ?? {},
  pricingUsd: {
    inputPerM: model.pricing?.input_per_million_tokens,
    outputPerM: model.pricing?.output_per_million_tokens,
  },
  quickstart: [
    {
      "en-IN": "Store API key server-side and cache responses for quota efficiency.",
      "hi-IN": "quota efficiency के लिए API key server-side रखें और responses cache करें।",
    },
  ],
  bestFor: [
    {
      "en-IN": "Independent model speed/intelligence benchmarking.",
      "hi-IN": "स्वतंत्र model speed/intelligence benchmarking।",
    },
  ],
  avoidWhen: [
    {
      "en-IN": "Client-side direct calls with exposed keys.",
      "hi-IN": "exposed keys के साथ client-side direct calls।",
    },
  ],
  samples: [],
  integration: {
    requiresApiKey: true,
    sdkQuality: "medium",
    selfHostDifficulty: "easy",
  },
  risk: {
    safetyScore: 0.2,
    misuseTags: ["none"],
  },
  compliance: {
    license: "api-terms",
    commercialUse: "allowed",
  },
  provenance: {
    source: "artificial-analysis",
    sourceUrl: AA_MODELS,
    fetchedAt: nowIso(),
  },
});

export const ingestArtificialAnalysis = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  const errors: string[] = [];

  const apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY;
  if (!apiKey) {
    return {
      source: "artificial-analysis",
      fetchedAt,
      received: 0,
      normalized: 0,
      errors: ["Missing ARTIFICIAL_ANALYSIS_API_KEY"],
      preview: [],
    };
  }

  try {
    const response = await fetch(AA_MODELS, {
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) {
      throw new Error(`Artificial Analysis responded with ${response.status}`);
    }

    const payload = (await response.json()) as { data?: AAModel[] };
    const models = payload.data ?? [];
    const preview = models.slice(0, 12).map(modelToListing);

    return {
      source: "artificial-analysis",
      fetchedAt,
      received: models.length,
      normalized: preview.length,
      errors,
      preview,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown Artificial Analysis error");
    return {
      source: "artificial-analysis",
      fetchedAt,
      received: 0,
      normalized: 0,
      errors,
      preview: [],
    };
  }
};
