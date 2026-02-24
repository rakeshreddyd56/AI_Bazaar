import type { ComparisonItem } from "@/lib/types";

type Props = {
  items: ComparisonItem[];
  title: string;
};

const capabilityValue = (item: ComparisonItem, key: string) => {
  const value = item.capabilities[key];
  if (value === undefined) return "-";
  return String(value);
};

const compareKeys = [
  "maxVideoDurationSec",
  "maxResolution",
  "contextTokens",
  "outputsValidSvg",
  "supportsImageToVideo",
  "voiceCloning",
  "toolCalling",
];

export function CompareMatrix({ items, title }: Props) {
  if (!items.length) return null;

  return (
    <aside className="sticky top-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[380px] text-left text-xs">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500">
              <th className="pb-2 pr-4">Metric</th>
              {items.map((item) => (
                <th key={item.id} className="pb-2 pr-4 font-medium text-neutral-700">
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Health score</td>
              {items.map((item) => (
                <td key={`${item.id}-health`} className="py-2 pr-4 font-medium text-neutral-800">
                  {item.health.score}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-500">Avg rating</td>
              {items.map((item) => (
                <td key={`${item.id}-rating`} className="py-2 pr-4 font-medium text-neutral-800">
                  {item.reviewsSummary.rating || "-"}
                </td>
              ))}
            </tr>
            {compareKeys.map((key) => (
              <tr key={key} className="border-b border-neutral-100">
                <td className="py-2 pr-4 text-neutral-500">{key}</td>
                {items.map((item) => (
                  <td key={`${item.id}-${key}`} className="py-2 pr-4 text-neutral-700">
                    {capabilityValue(item, key)}
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
