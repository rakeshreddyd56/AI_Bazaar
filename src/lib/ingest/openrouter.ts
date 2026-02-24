import type { IngestResult, Listing } from "@/lib/types";
import { normalize, nowIso, safeNumber } from "@/lib/utils";

const OPENROUTER_MODELS = "https://openrouter.ai/api/v1/models";

type OpenRouterModel = {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
};

const modelToListing = (
  model: OpenRouterModel,
): Partial<Listing> & Pick<Listing, "id" | "name"> => ({
  id: model.id,
  slug: normalize(model.id),
  name: model.name,
  summary: {
    "en-IN": model.description || model.name,
    "hi-IN": model.description || model.name,
  },
  modality: ["text", "code"],
  tags: ["openrouter", "llm"],
  capabilities: {
    contextTokens: model.context_length ?? 0,
    toolCalling: true,
  },
  pricingUsd: {
    inputPerM: safeNumber(model.pricing?.prompt),
    outputPerM: safeNumber(model.pricing?.completion),
  },
  limitations: [],
  benchmarks: {},
  quickstart: [
    {
      "en-IN": "Obtain API key and call OpenRouter chat completion endpoint.",
      "hi-IN": "API key लें और OpenRouter chat completion endpoint कॉल करें।",
    },
  ],
  bestFor: [
    {
      "en-IN": "Unified multi-model routing.",
      "hi-IN": "unified multi-model routing।",
    },
  ],
  avoidWhen: [
    {
      "en-IN": "Hard requirement for one fixed vendor.",
      "hi-IN": "जब केवल एक fixed vendor की आवश्यकता हो।",
    },
  ],
  samples: [],
  integration: {
    requiresApiKey: true,
    sdkQuality: "high",
    selfHostDifficulty: "easy",
  },
  risk: {
    safetyScore: 0.45,
    misuseTags: ["prompt-injection"],
  },
  compliance: {
    license: "unknown",
    commercialUse: "unknown",
  },
  provenance: {
    source: "openrouter",
    sourceUrl: OPENROUTER_MODELS,
    fetchedAt: nowIso(),
  },
});

export const ingestOpenRouter = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  const errors: string[] = [];

  try {
    const response = await fetch(OPENROUTER_MODELS, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter responded with ${response.status}`);
    }

    const payload = (await response.json()) as { data?: OpenRouterModel[] };
    const models = payload.data ?? [];
    const preview = models.slice(0, 12).map(modelToListing);

    return {
      source: "openrouter",
      fetchedAt,
      received: models.length,
      normalized: preview.length,
      errors,
      preview,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown OpenRouter error");
    return {
      source: "openrouter",
      fetchedAt,
      received: 0,
      normalized: 0,
      errors,
      preview: [],
    };
  }
};
