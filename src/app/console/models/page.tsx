import Link from "next/link";
import { CopyTextButton } from "@/components/console/CopyTextButton";
import { listCapabilities, listFamilies, queryModels } from "@/lib/console/models";

type SearchMap = Record<string, string | string[] | undefined>;

export default async function ConsoleModelsPage({
  searchParams,
}: {
  searchParams: Promise<SearchMap>;
}) {
  const params = await searchParams;
  const family = Array.isArray(params.family) ? params.family[0] : params.family;
  const capability = Array.isArray(params.capability) ? params.capability[0] : params.capability;
  const state = Array.isArray(params.state) ? params.state[0] : params.state;
  const modelParam = Array.isArray(params.model) ? params.model[0] : params.model;

  const page = queryModels({
    family,
    capability:
      capability === "tools" ||
      capability === "vision" ||
      capability === "json_mode" ||
      capability === "streaming" ||
      capability === "completion"
        ? capability
        : undefined,
    state: state === "warm" || state === "loading" || state === "cold" ? state : undefined,
    limit: 60,
  });

  const families = listFamilies();
  const capabilities = listCapabilities();
  const visibleModels = modelParam
    ? page.data.filter((model) => model.modelId === modelParam)
    : page.data;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Models</h1>
          <p className="text-sm text-neutral-400">
            Runtime registry with capability flags, context limits, pricing, and route state.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-neutral-300">
          {page.total} models indexed
        </div>
      </header>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">Family</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/console/models" className="rounded-full border border-white/15 px-2 py-1 text-xs text-neutral-200">All</Link>
            {families.map((item) => (
              <Link
                key={item}
                href={`/console/models?family=${item}`}
                className="rounded-full border border-white/15 px-2 py-1 text-xs text-neutral-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">Capability</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/console/models" className="rounded-full border border-white/15 px-2 py-1 text-xs text-neutral-200">All</Link>
            {capabilities.map((item) => (
              <Link
                key={item}
                href={`/console/models?capability=${item}`}
                className="rounded-full border border-white/15 px-2 py-1 text-xs text-neutral-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-400">Runtime state</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/console/models" className="rounded-full border border-white/15 px-2 py-1 text-xs text-neutral-200">All</Link>
            {(["warm", "loading", "cold"] as const).map((item) => (
              <Link
                key={item}
                href={`/console/models?state=${item}`}
                className="rounded-full border border-white/15 px-2 py-1 text-xs text-neutral-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {visibleModels.map((model) => (
          <article key={model.modelId} className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">{model.name}</p>
                <p className="text-xs text-neutral-400">
                  {model.modelId} • {model.family} • {model.provider}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    model.runtimeState === "warm"
                      ? "bg-emerald-500/25 text-emerald-300"
                      : model.runtimeState === "loading"
                        ? "bg-amber-500/25 text-amber-300"
                        : "bg-rose-500/25 text-rose-300"
                  }`}
                >
                  {model.runtimeState}
                </span>
                <CopyTextButton value={model.modelId} label="Copy model id" />
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-300">
              {Object.entries(model.supports)
                .filter(([, enabled]) => enabled)
                .map(([cap]) => (
                  <span key={cap} className="rounded-full border border-white/15 px-2 py-0.5">
                    {cap}
                  </span>
                ))}
            </div>

            <div className="mt-3 grid gap-2 text-xs text-neutral-300 md:grid-cols-4">
              <div className="rounded-lg bg-white/[0.04] px-2 py-1.5">Context: {model.contextLength.toLocaleString()}</div>
              <div className="rounded-lg bg-white/[0.04] px-2 py-1.5">Max output: {model.maxOutputTokens.toLocaleString()}</div>
              <div className="rounded-lg bg-white/[0.04] px-2 py-1.5">
                Pricing: {model.pricingUsd?.inputPerM ?? "-"}/{model.pricingUsd?.outputPerM ?? "-"} per 1M
              </div>
              <div className="rounded-lg bg-white/[0.04] px-2 py-1.5">Class: {model.modelClass}</div>
            </div>

            <details className="mt-3 rounded-lg border border-white/10 bg-black/30 p-2 text-xs text-neutral-300">
              <summary className="cursor-pointer font-medium text-neutral-200">Model detail + compatibility</summary>
              <p className="mt-2 text-neutral-300">{model.description}</p>
              <div className="mt-2 grid gap-1 md:grid-cols-2">
                {Object.entries(model.parameterSupport).map(([key, enabled]) => (
                  <div key={key} className="rounded-md bg-white/[0.04] px-2 py-1">
                    {key}: {enabled ? "supported" : "not supported"}
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-md bg-white/[0.04] p-2 font-mono text-[11px]">
                {`curl -X POST /api/v1/chat/completions -d '{"model":"${model.modelId}"}'`}
              </div>
            </details>
          </article>
        ))}
        {visibleModels.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-neutral-300">
            No model matched the current filter.
          </div>
        ) : null}
      </div>
    </section>
  );
}
