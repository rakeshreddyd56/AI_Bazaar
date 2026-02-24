import type { IngestResult } from "@/lib/types";
import { nowIso } from "@/lib/utils";

export const ingestHelmSecondary = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  return {
    source: "helm-secondary",
    fetchedAt,
    received: 0,
    normalized: 0,
    errors: [
      "HELM is tracked as a low-frequency/manual source in v1. Add curated snapshots via editorial workflow.",
    ],
    preview: [],
  };
};
