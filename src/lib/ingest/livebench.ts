import type { IngestResult, Listing } from "@/lib/types";
import { normalize, nowIso } from "@/lib/utils";

const DATASET = "livebench/model_judgment";
const INFO_URL = `https://datasets-server.huggingface.co/info?dataset=${encodeURIComponent(DATASET)}`;
const ROWS_URL = `https://datasets-server.huggingface.co/first-rows?dataset=${encodeURIComponent(DATASET)}&config=default&split=leaderboard`;

type LiveBenchRow = {
  row?: {
    model?: string;
    score?: number;
    category?: string;
  };
};

const rowToListing = (
  row: LiveBenchRow["row"],
): Partial<Listing> & Pick<Listing, "id" | "name"> => {
  const model = row?.model ?? "unknown-model";
  const score = row?.score ?? 0;

  return {
    id: normalize(`livebench-${model}`),
    slug: normalize(`livebench-${model}`),
    name: model,
    summary: {
      "en-IN": `LiveBench model judgment entry (${row?.category ?? "general"}).`,
      "hi-IN": `LiveBench model judgment entry (${row?.category ?? "general"}).`,
    },
    modality: ["text", "code"],
    tags: ["livebench", row?.category ?? "general"],
    capabilities: {
      livebenchCategory: row?.category ?? "general",
    },
    limitations: ["Score may represent one turn/task slice; compare across categories carefully."],
    benchmarks: {
      livebenchScore: score * 100,
    },
    quickstart: [
      {
        "en-IN": "Cross-check category-level breakdown before final model selection.",
        "hi-IN": "अंतिम चयन से पहले category-level breakdown जांचें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Objective benchmark trend tracking.",
        "hi-IN": "objective benchmark trend tracking।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Single-score decision making without qualitative checks.",
        "hi-IN": "qualitative checks बिना single-score से निर्णय लेना।",
      },
    ],
    samples: [],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.38,
      misuseTags: ["benchmark-overfit"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "livebench",
      sourceUrl: INFO_URL,
      fetchedAt: nowIso(),
    },
  };
};

export const ingestLiveBench = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  const errors: string[] = [];

  try {
    const [infoResponse, rowsResponse] = await Promise.all([
      fetch(INFO_URL, { next: { revalidate: 60 * 60 * 4 } }),
      fetch(ROWS_URL, { next: { revalidate: 60 * 60 * 4 } }),
    ]);

    if (!infoResponse.ok || !rowsResponse.ok) {
      throw new Error(
        `LiveBench endpoints failed: info=${infoResponse.status}, rows=${rowsResponse.status}`,
      );
    }

    const infoPayload = (await infoResponse.json()) as {
      dataset_info?: {
        default?: {
          splits?: {
            leaderboard?: {
              num_examples?: number;
            };
          };
        };
      };
    };

    const rowsPayload = (await rowsResponse.json()) as {
      rows?: LiveBenchRow[];
    };

    const rows = rowsPayload.rows ?? [];
    const preview = rows.slice(0, 20).map((row) => rowToListing(row.row)).slice(0, 12);

    const received =
      infoPayload.dataset_info?.default?.splits?.leaderboard?.num_examples ?? rows.length;

    return {
      source: "livebench",
      fetchedAt,
      received,
      normalized: preview.length,
      errors,
      preview,
    };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Unknown LiveBench error");
    return {
      source: "livebench",
      fetchedAt,
      received: 0,
      normalized: 0,
      errors,
      preview: [],
    };
  }
};
