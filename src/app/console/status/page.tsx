import { DEMO_ORG_ID } from "@/lib/console/store";
import { statusForOrg } from "@/lib/console/status";

export default function ConsoleStatusPage() {
  const status = statusForOrg(DEMO_ORG_ID);

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h1 className="text-xl font-semibold">Status</h1>
        <p className="text-sm text-neutral-400">
          Runtime view for model health, success rates, queue depth, and incident timeline.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">Requests (24h)</p>
          <p className="text-lg font-semibold text-white">{status.totals.requests24h}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">Error rate (24h)</p>
          <p className="text-lg font-semibold text-white">{status.totals.errorRate24h.toFixed(2)}%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">p95 latency</p>
          <p className="text-lg font-semibold text-white">{status.totals.p95LatencyMs} ms</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">Queue depth</p>
          <p className="text-lg font-semibold text-white">{status.totals.globalQueueDepth}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Model runtime status</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="px-2 py-2">Model</th>
                <th className="px-2 py-2">State</th>
                <th className="px-2 py-2">Req (24h)</th>
                <th className="px-2 py-2">Success %</th>
                <th className="px-2 py-2">p95 latency</th>
                <th className="px-2 py-2">Queue depth</th>
                <th className="px-2 py-2">Last incident</th>
              </tr>
            </thead>
            <tbody>
              {status.rows.map((row) => (
                <tr key={row.modelId} className="border-b border-white/5">
                  <td className="px-2 py-2 font-medium text-neutral-100">{row.name}</td>
                  <td className="px-2 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        row.runtimeState === "warm"
                          ? "bg-emerald-500/25 text-emerald-200"
                          : row.runtimeState === "loading"
                            ? "bg-amber-500/25 text-amber-200"
                            : "bg-rose-500/25 text-rose-200"
                      }`}
                    >
                      {row.runtimeState}
                    </span>
                  </td>
                  <td className="px-2 py-2">{row.requests24h}</td>
                  <td className="px-2 py-2">{row.successRate.toFixed(1)}</td>
                  <td className="px-2 py-2">{row.p95LatencyMs} ms</td>
                  <td className="px-2 py-2">{row.queueDepth}</td>
                  <td className="px-2 py-2">{row.lastIncidentAt ? new Date(row.lastIncidentAt).toLocaleString("en-IN") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Recent request errors</h2>
        <div className="space-y-2">
          {status.recentErrors.map((error) => (
            <div key={error.id} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-neutral-300">
              {new Date(error.createdAt).toLocaleString("en-IN")} • {error.modelId} • {error.errorCode} • HTTP {error.statusCode}
            </div>
          ))}
          {status.recentErrors.length === 0 ? (
            <p className="text-sm text-neutral-400">No recent errors.</p>
          ) : null}
        </div>
      </section>
    </section>
  );
}
