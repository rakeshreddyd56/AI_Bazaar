import { consoleModels } from "@/lib/console/models";
import { queueSnapshot, requestErrorsForOrg, usageEventsForOrg } from "@/lib/console/store";
import { clamp } from "@/lib/utils";

export type ModelStatusRow = {
  modelId: string;
  name: string;
  runtimeState: "warm" | "loading" | "cold";
  requests24h: number;
  successRate: number;
  p95LatencyMs: number;
  queueDepth: number;
  lastIncidentAt?: string;
};

export const statusForOrg = (orgId: string) => {
  const models = consoleModels();
  const events = usageEventsForOrg(orgId);
  const errors = requestErrorsForOrg(orgId, 72);
  const queue = queueSnapshot(orgId);
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  const recentEvents = events.filter((event) => new Date(event.createdAt).getTime() >= cutoff);

  const rows: ModelStatusRow[] = models.map((model) => {
    const modelEvents = recentEvents.filter((event) => event.modelId === model.modelId);
    const modelErrors = errors.filter((error) => error.modelId === model.modelId);
    const sortedLatency = modelEvents
      .map((event) => event.latencyMs)
      .sort((a, b) => a - b);
    const p95Index = Math.floor(sortedLatency.length * 0.95);
    const successCount = modelEvents.filter((event) => event.statusCode < 400).length;

    return {
      modelId: model.modelId,
      name: model.name,
      runtimeState: model.runtimeState,
      requests24h: modelEvents.length,
      successRate: modelEvents.length
        ? clamp((successCount / modelEvents.length) * 100, 0, 100)
        : 100,
      p95LatencyMs: sortedLatency[p95Index] ?? 0,
      queueDepth: queue.orgQueued,
      lastIncidentAt: modelErrors[0]?.createdAt,
    };
  });

  const totals = {
    requests24h: recentEvents.length,
    errorRate24h: recentEvents.length
      ? clamp(
          (recentEvents.filter((event) => event.statusCode >= 400).length / recentEvents.length) * 100,
          0,
          100,
        )
      : 0,
    p95LatencyMs: (() => {
      const sorted = recentEvents.map((event) => event.latencyMs).sort((a, b) => a - b);
      const index = Math.floor(sorted.length * 0.95);
      return sorted[index] ?? 0;
    })(),
    globalQueueDepth: queue.globalQueued,
    inFlight: queue.orgInFlight,
  };

  return {
    rows: rows.sort((a, b) => {
      if (a.runtimeState === b.runtimeState) return b.requests24h - a.requests24h;
      const order = { warm: 0, loading: 1, cold: 2 } as const;
      return order[a.runtimeState] - order[b.runtimeState];
    }),
    totals,
    recentErrors: errors.slice(0, 25),
  };
};
