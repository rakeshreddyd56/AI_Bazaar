import { ingestArenaSecondary } from "@/lib/ingest/arena";
import { ingestArtificialAnalysis } from "@/lib/ingest/artificial-analysis";
import { ingestHelmSecondary } from "@/lib/ingest/helm";
import { ingestHuggingFaceTrending } from "@/lib/ingest/huggingface";
import { ingestLiveBench } from "@/lib/ingest/livebench";
import { ingestOpenRouter } from "@/lib/ingest/openrouter";
import { ingestSWEbench } from "@/lib/ingest/swebench";

export const INGEST_SOURCES = [
  "openrouter",
  "huggingface",
  "swebench",
  "livebench",
  "artificial-analysis",
  "arena-secondary",
  "helm-secondary",
] as const;

export type IngestSource = (typeof INGEST_SOURCES)[number];

export const ingestFromSource = async (source: string) => {
  switch (source) {
    case "openrouter":
      return ingestOpenRouter();
    case "huggingface":
      return ingestHuggingFaceTrending();
    case "swebench":
      return ingestSWEbench();
    case "livebench":
      return ingestLiveBench();
    case "artificial-analysis":
      return ingestArtificialAnalysis();
    case "arena-secondary":
      return ingestArenaSecondary();
    case "helm-secondary":
      return ingestHelmSecondary();
    default:
      throw new Error(`Unsupported source: ${source}`);
  }
};
