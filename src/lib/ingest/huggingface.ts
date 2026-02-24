import type { IngestResult, Listing } from "@/lib/types";
import { normalize, nowIso } from "@/lib/utils";

const HF_TRENDING = "https://huggingface.co/api/trending?type=model";

type HFTrendingItem = {
  repoData?: {
    id?: string;
    likes?: number;
    pipeline_tag?: string;
    lastModified?: string;
  };
};

const modalityFromPipeline = (pipeline?: string): Listing["modality"] => {
  if (!pipeline) return ["text"];
  if (pipeline.includes("video")) return ["video"];
  if (pipeline.includes("speech") || pipeline.includes("audio")) return ["audio"];
  if (pipeline.includes("image")) return ["image"];
  return ["text"];
};

const itemToListing = (
  item: HFTrendingItem,
): Partial<Listing> & Pick<Listing, "id" | "name"> => {
  const id = item.repoData?.id ?? "unknown-model";
  const name = id;

  return {
    id,
    slug: normalize(id),
    name,
    summary: {
      "en-IN": `Trending model on Hugging Face (${item.repoData?.pipeline_tag ?? "general"}).`,
      "hi-IN": `Hugging Face पर ट्रेंडिंग मॉडल (${item.repoData?.pipeline_tag ?? "general"}).`,
    },
    modality: modalityFromPipeline(item.repoData?.pipeline_tag),
    tags: ["huggingface", "trending", item.repoData?.pipeline_tag ?? "general"],
    capabilities: {
      trendingLikes: item.repoData?.likes ?? 0,
    },
    limitations: ["Benchmark details may require manual validation."],
    benchmarks: {},
    quickstart: [
      {
        "en-IN": "Review model card and test with a constrained prompt set.",
        "hi-IN": "model card देखें और constrained prompt set से test करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Tracking fast-moving open model releases.",
        "hi-IN": "तेजी से बदलती open model releases ट्रैक करना।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Production decisions without benchmark confirmation.",
        "hi-IN": "benchmark पुष्टि के बिना production निर्णय।",
      },
    ],
    samples: [],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.47,
      misuseTags: ["unknown"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "huggingface-trending",
      sourceUrl: HF_TRENDING,
      fetchedAt: nowIso(),
      lastVerifiedAt: item.repoData?.lastModified,
    },
  };
};

export const ingestHuggingFaceTrending = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  const errors: string[] = [];

  try {
    const response = await fetch(HF_TRENDING, {
      next: { revalidate: 60 * 30 },
    });

    if (!response.ok) {
      throw new Error(`Hugging Face responded with ${response.status}`);
    }

    const payload = (await response.json()) as {
      recentlyTrending?: HFTrendingItem[];
    };

    const items = payload.recentlyTrending ?? [];
    const preview = items.slice(0, 12).map(itemToListing);

    return {
      source: "huggingface-trending",
      fetchedAt,
      received: items.length,
      normalized: preview.length,
      errors,
      preview,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown Hugging Face error");
    return {
      source: "huggingface-trending",
      fetchedAt,
      received: 0,
      normalized: 0,
      errors,
      preview: [],
    };
  }
};
