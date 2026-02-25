import { BrandLogo } from "@/components/BrandLogo";
import type { ComparisonItem } from "@/lib/types";

type Props = {
  items: ComparisonItem[];
  title: string;
};

const prioritize = [
  "contextTokens",
  "maxVideoDurationSec",
  "maxResolution",
  "supportsImageToVideo",
  "outputsValidSvg",
  "voiceCloning",
  "toolCalling",
  "supportedLanguages",
  "latencyP95Ms",
  "retrievalPrecision",
  "citationCoverage",
];

const labelFor = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase())
    .trim();

const formatValue = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return String(value);
};

const topKeys = (
  items: ComparisonItem[],
  keyspace: "capabilities" | "benchmarks",
  limit: number,
) => {
  const count = new Map<string, number>();

  for (const item of items) {
    const source = keyspace === "capabilities" ? item.capabilities : item.benchmarks;
    for (const key of Object.keys(source)) {
      count.set(key, (count.get(key) ?? 0) + 1);
    }
  }

  const bySignal = [...count.entries()]
    .filter(([, seen]) => seen >= 2)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      const ai = prioritize.indexOf(a[0]);
      const bi = prioritize.indexOf(b[0]);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a[0].localeCompare(b[0]);
    })
    .slice(0, limit)
    .map(([key]) => key);

  if (bySignal.length) return bySignal;

  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
};

export function CompareMatrix({ items, title }: Props) {
  if (!items.length) return null;

  const capabilityKeys = topKeys(items, "capabilities", 8);
  const benchmarkKeys = topKeys(items, "benchmarks", 6);
  const hasRisk = items.some((item) => Boolean(item.riskFlag));

  return (
    <aside className="sticky top-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500">
              <th className="pb-2 pr-4">Metric</th>
              {items.map((item) => (
                <th key={item.id} className="pb-2 pr-4 font-medium text-neutral-700">
                  <div className="flex min-w-[145px] items-center gap-2">
                    <BrandLogo
                      target={{
                        id: item.id,
                        slug: item.slug,
                        name: item.name,
                        source: item.source,
                        providerKey: item.provider.key,
                      }}
                      size="sm"
                    />
                    <div>
                      <span className="max-w-[180px] break-words leading-snug">{item.name}</span>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-neutral-500">
                        {item.provider.name}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Avg rating</td>
              {items.map((item) => (
                <td key={`${item.id}-rating`} className="py-2 pr-4 font-medium text-neutral-800">
                  {formatValue(item.reviewsSummary.rating || "-")}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Input price ($/1M)</td>
              {items.map((item) => (
                <td key={`${item.id}-input`} className="py-2 pr-4 text-neutral-700">
                  {formatValue(item.pricingUsd?.inputPerM)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Output price ($/1M)</td>
              {items.map((item) => (
                <td key={`${item.id}-output`} className="py-2 pr-4 text-neutral-700">
                  {formatValue(item.pricingUsd?.outputPerM)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Monthly price (USD)</td>
              {items.map((item) => (
                <td key={`${item.id}-monthly`} className="py-2 pr-4 text-neutral-700">
                  {formatValue(item.pricingUsd?.monthly)}
                </td>
              ))}
            </tr>
            {hasRisk ? (
              <tr className="border-b border-neutral-100">
                <td className="py-2 pr-4 text-neutral-500">Risk flag</td>
                {items.map((item) => (
                  <td key={`${item.id}-risk`} className="py-2 pr-4 text-neutral-700">
                    {item.riskFlag ? `Risk: ${item.riskFlag.level}` : "-"}
                  </td>
                ))}
              </tr>
            ) : null}
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Freshness</td>
              {items.map((item) => (
                <td key={`${item.id}-fresh`} className="py-2 pr-4 text-neutral-700">
                  {item.stale ? "Stale" : "Fresh"}
                </td>
              ))}
            </tr>
            {capabilityKeys.map((key) => (
              <tr key={key} className="border-b border-neutral-100">
                <td className="py-2 pr-4 text-neutral-500">{labelFor(key)}</td>
                {items.map((item) => (
                  <td key={`${item.id}-${key}`} className="py-2 pr-4 text-neutral-700">
                    {formatValue(item.capabilities[key])}
                  </td>
                ))}
              </tr>
            ))}
            {benchmarkKeys.map((key) => (
              <tr key={`bm-${key}`} className="border-b border-neutral-100">
                <td className="py-2 pr-4 text-neutral-500">{`${labelFor(key)} (benchmark)`}</td>
                {items.map((item) => (
                  <td key={`${item.id}-bm-${key}`} className="py-2 pr-4 text-neutral-700">
                    {formatValue(item.benchmarks[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
