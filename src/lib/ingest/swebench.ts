import type { IngestResult, Listing } from "@/lib/types";
import { id, normalize, nowIso } from "@/lib/utils";

const SWEBENCH_URL = "https://www.swebench.com";

type SweBenchEntry = {
  name?: string;
  resolved?: number;
  date?: string;
  cost?: number | null;
};

type SweBenchCategory = {
  name?: string;
  results?: SweBenchEntry[];
};

const extractJson = (html: string, scriptId: string) => {
  const pattern = new RegExp(`<script[^>]*id=\"${scriptId}\"[^>]*>([\\s\\S]*?)<\\/script>`);
  const match = html.match(pattern);
  return match?.[1]?.trim();
};

const entryToListing = (
  category: string,
  entry: SweBenchEntry,
): Partial<Listing> & Pick<Listing, "id" | "name"> => {
  const name = entry.name ?? `SWE entry ${id("x")}`;
  const listingId = normalize(`swebench-${category}-${name}`);

  return {
    id: listingId,
    slug: listingId,
    name,
    summary: {
      "en-IN": `SWE-bench ${category} benchmark entry with resolved score ${entry.resolved ?? 0}%`,
      "hi-IN": `SWE-bench ${category} benchmark entry, resolved score ${entry.resolved ?? 0}%`,
    },
    modality: ["code", "agent"],
    tags: ["swebench", category.toLowerCase(), "coding"],
    capabilities: {
      swebenchCategory: category,
      automation: true,
    },
    limitations: ["Benchmark entry may represent a full system, not a standalone model."],
    benchmarks: {
      sweBenchResolved: entry.resolved ?? 0,
    },
    pricingUsd:
      entry.cost && Number.isFinite(entry.cost)
        ? {
            monthly: Number(entry.cost),
          }
        : undefined,
    quickstart: [
      {
        "en-IN": "Validate environment and benchmark setup before reproducing score claims.",
        "hi-IN": "स्कोर पुनरुत्पादन से पहले environment और benchmark setup सत्यापित करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Comparing coding-agent systems on standardized tasks.",
        "hi-IN": "standardized tasks पर coding-agent systems की तुलना।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Assuming benchmark score equals production reliability.",
        "hi-IN": "benchmark score को production reliability मान लेना।",
      },
    ],
    samples: [],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.44,
      misuseTags: ["overfitting", "benchmark-gaming"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "swebench",
      sourceUrl: SWEBENCH_URL,
      fetchedAt: nowIso(),
      lastVerifiedAt: entry.date,
    },
  };
};

export const ingestSWEbench = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  const errors: string[] = [];

  try {
    const response = await fetch(SWEBENCH_URL, {
      next: { revalidate: 60 * 60 * 4 },
    });

    if (!response.ok) {
      throw new Error(`SWE-bench responded with ${response.status}`);
    }

    const html = await response.text();
    const raw = extractJson(html, "leaderboard-data");

    if (!raw) {
      throw new Error("Unable to locate leaderboard-data script payload");
    }

    const categories = JSON.parse(raw) as SweBenchCategory[];
    const preview = categories
      .flatMap((category) => {
        const sorted = [...(category.results ?? [])]
          .filter((result) => typeof result.resolved === "number")
          .sort((a, b) => (b.resolved ?? 0) - (a.resolved ?? 0));

        return sorted.slice(0, 3).map((result) =>
          entryToListing(category.name ?? "unknown", result),
        );
      })
      .slice(0, 12);

    const received = categories.reduce(
      (sum, category) => sum + (category.results?.length ?? 0),
      0,
    );

    return {
      source: "swebench",
      fetchedAt,
      received,
      normalized: preview.length,
      errors,
      preview,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown SWE-bench error");
    return {
      source: "swebench",
      fetchedAt,
      received: 0,
      normalized: 0,
      errors,
      preview: [],
    };
  }
};
