import type { IngestResult } from "@/lib/types";
import { nowIso } from "@/lib/utils";

export const ingestArenaSecondary = async (): Promise<IngestResult> => {
  const fetchedAt = nowIso();
  return {
    source: "arena-secondary",
    fetchedAt,
    received: 0,
    normalized: 0,
    errors: [
      "Arena leaderboard is treated as secondary/manual due anti-bot/API instability in automated ingestion.",
    ],
    preview: [],
  };
};
