import { DEMO_ORG_ID, usageSummaryForOrg } from "@/lib/console/store";
import { defaultQuotaLimits } from "@/lib/inference/quota";

export default function ConsoleUsagePage() {
  const usage = usageSummaryForOrg(DEMO_ORG_ID, defaultQuotaLimits);

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h1 className="text-xl font-semibold">Usage</h1>
        <p className="text-sm text-neutral-400">
          Daily/monthly usage rollups with quota tracking and per-model metrics.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">Daily requests</p>
          <p className="text-lg font-semibold text-white">{usage.daily.requests}</p>
          <p className="text-xs text-neutral-400">Remaining: {usage.daily.quotaRemaining.requests}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">Daily input tokens</p>
          <p className="text-lg font-semibold text-white">{usage.daily.inputTokens.toLocaleString()}</p>
          <p className="text-xs text-neutral-400">Remaining: {usage.daily.quotaRemaining.inputTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-neutral-400">Daily output tokens</p>
          <p className="text-lg font-semibold text-white">{usage.daily.outputTokens.toLocaleString()}</p>
          <p className="text-xs text-neutral-400">Remaining: {usage.daily.quotaRemaining.outputTokens.toLocaleString()}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-2 text-sm font-semibold text-neutral-200">Monthly totals</h2>
        <p className="text-sm text-neutral-300">
          Requests: {usage.monthlyTotals.requests.toLocaleString()} • Input tokens: {usage.monthlyTotals.inputTokens.toLocaleString()} • Output tokens: {usage.monthlyTotals.outputTokens.toLocaleString()}
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Per-model metrics</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-left text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="px-2 py-2">Model</th>
                <th className="px-2 py-2">Requests</th>
                <th className="px-2 py-2">Input</th>
                <th className="px-2 py-2">Output</th>
                <th className="px-2 py-2">Success %</th>
                <th className="px-2 py-2">p95 latency</th>
              </tr>
            </thead>
            <tbody>
              {usage.byModel.map((row) => (
                <tr key={row.modelId} className="border-b border-white/5">
                  <td className="px-2 py-2 font-medium text-neutral-200">{row.modelId}</td>
                  <td className="px-2 py-2">{row.requests}</td>
                  <td className="px-2 py-2">{row.inputTokens.toLocaleString()}</td>
                  <td className="px-2 py-2">{row.outputTokens.toLocaleString()}</td>
                  <td className="px-2 py-2">{row.successRate.toFixed(1)}</td>
                  <td className="px-2 py-2">{row.p95LatencyMs} ms</td>
                </tr>
              ))}
              {usage.byModel.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-4 text-neutral-400">
                    No usage yet. Use Playground to generate events.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">14-day usage sparkline data</h2>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {usage.sparkline.map((day) => (
            <div key={day.day} className="rounded-lg border border-white/10 bg-black/25 px-2 py-2">
              <p className="text-[11px] text-neutral-400">{day.day}</p>
              <p className="text-xs text-neutral-200">Req: {day.requests}</p>
              <p className="text-xs text-neutral-300">In: {day.inputTokens}</p>
              <p className="text-xs text-neutral-300">Out: {day.outputTokens}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
