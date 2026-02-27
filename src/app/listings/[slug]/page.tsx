import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AppModeSwitch } from "@/components/AppModeSwitch";
import { BrandLogo } from "@/components/BrandLogo";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { formatCurrencyValue, resolveCurrency } from "@/lib/currency";
import { listingDetail } from "@/lib/data/listing-view";
import { dictionaryFor, resolveLocale } from "@/lib/i18n";

const riskClass = {
  watchlist: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
} as const;

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const locale = resolveLocale(
    Array.isArray(query.locale) ? query.locale[0] : query.locale,
  );
  const currency = resolveCurrency(
    Array.isArray(query.currency) ? query.currency[0] : query.currency,
  );

  const detail = listingDetail(slug, locale);
  if (!detail) notFound();

  const dict = dictionaryFor(locale);
  const verifiedDate = detail.provenance.lastVerifiedAt ?? detail.updatedAt;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        <header className="mb-3 flex items-center justify-between gap-3">
          <Link
            href={`/results?${new URLSearchParams({
              locale,
              currency,
              category: detail.categoryPrimary ?? "all",
            }).toString()}`}
            className="text-xs font-medium text-neutral-500 hover:underline"
          >
            ← Back to results
          </Link>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="hidden md:block" />}>
              <AppModeSwitch mode="marketplace" variant="light" />
            </Suspense>
            <CurrencySwitch currency={currency} variant="light" />
            <LocaleSwitch locale={locale} variant="light" />
          </div>
        </header>

        <div className="mt-3 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <BrandLogo
                target={{
                  id: detail.id,
                  slug: detail.slug,
                  name: detail.name,
                  source: detail.provenance.source,
                  sourceUrl: detail.provenance.sourceUrl,
                  tags: detail.tags,
                  providerKey: detail.provider?.key,
                }}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{detail.name}</h1>
                <p className="mt-1 text-sm text-neutral-600">{detail.summaryText}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-neutral-700">
                    Provider: {detail.provider?.name ?? "Unknown Provider"}
                  </span>
                  <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-neutral-700">
                    {detail.status}
                  </span>
                  <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-neutral-700">
                    Category: {detail.categoryPrimary ?? "uncategorized"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      detail.stale
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {detail.stale ? "Stale source data" : "Recently verified"}
                  </span>
                  <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-neutral-700">
                    Source: {detail.provenance.source}
                  </span>
                  {detail.consoleModelId ? (
                    <Link
                      href={`/console/models?model=${detail.consoleModelId}`}
                      className="rounded-full border border-neutral-300 px-2 py-0.5 text-neutral-700 underline"
                    >
                      Open in Console
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
            {detail.riskFlag ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${riskClass[detail.riskFlag.level]}`}
              >
                Risk: {detail.riskFlag.level}
              </span>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <section className="rounded-2xl bg-neutral-100 p-4">
              <h2 className="mb-2 text-sm font-semibold text-neutral-800">{dict.bestFor}</h2>
              <ul className="space-y-1 text-xs text-neutral-700">
                {detail.bestForText.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-neutral-100 p-4">
              <h2 className="mb-2 text-sm font-semibold text-neutral-800">{dict.limitations}</h2>
              <ul className="space-y-1 text-xs text-neutral-700">
                {detail.limitations.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-neutral-100 p-4">
              <h2 className="mb-2 text-sm font-semibold text-neutral-800">{dict.avoidWhen}</h2>
              <ul className="space-y-1 text-xs text-neutral-700">
                {detail.avoidWhenText.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900">{dict.quickstart}</h2>
              <ol className="list-decimal space-y-1 pl-4 text-xs text-neutral-700">
                {detail.quickstartText.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>

              <h3 className="mt-4 text-xs font-semibold text-neutral-900">Setup checklist</h3>
              <ul className="mt-1 space-y-1 text-xs text-neutral-700">
                <li>• API key required: {detail.integration.requiresApiKey ? "Yes" : "No"}</li>
                <li>• SDK quality: {detail.integration.sdkQuality}</li>
                <li>• Self-host difficulty: {detail.integration.selfHostDifficulty}</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-neutral-200 p-4">
              <h2 className="mb-2 text-sm font-semibold text-neutral-900">Usage notes</h2>
              <ul className="space-y-1 text-xs text-neutral-700">
                <li>• Validate model behavior on your own benchmark slices before rollout.</li>
                <li>• Pin version/provider routes for reproducible outputs.</li>
                <li>• Add logging + fallback routes for high-volume workloads.</li>
              </ul>
              <h3 className="mt-4 text-xs font-semibold text-neutral-900">Pricing ({currency})</h3>
              <ul className="mt-1 space-y-1 text-xs text-neutral-700">
                <li>
                  • Input / 1M: {formatCurrencyValue(detail.pricingUsd?.inputPerM, currency)}
                </li>
                <li>
                  • Output / 1M: {formatCurrencyValue(detail.pricingUsd?.outputPerM, currency)}
                </li>
                <li>
                  • Monthly: {formatCurrencyValue(detail.pricingUsd?.monthly, currency, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </li>
              </ul>
            </section>
          </div>

          {detail.riskFlag ? (
            <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h2 className="mb-2 text-sm font-semibold text-amber-900">
                Why this listing is risk-flagged
              </h2>
              <ul className="space-y-1 text-xs text-amber-800">
                {detail.riskFlag.reasons.map((reason) => (
                  <li key={reason}>• {reason}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-4 rounded-2xl border border-neutral-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">Capabilities</h2>
            <ul className="grid grid-cols-1 gap-1 text-xs text-neutral-700 md:grid-cols-2">
              {Object.entries(detail.capabilities).map(([key, value]) => (
                <li key={key} className="flex justify-between gap-2 border-b border-neutral-100 py-1">
                  <span className="text-neutral-500">{key}</span>
                  <span className="font-medium text-neutral-800">{String(value)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-4 rounded-2xl border border-neutral-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">Benchmarks</h2>
            <div className="grid gap-2 md:grid-cols-3">
              {Object.entries(detail.benchmarks).map(([name, value]) => (
                <div key={name} className="rounded-xl bg-neutral-100 px-3 py-2">
                  <div className="text-xs text-neutral-500">{name}</div>
                  <div className="text-sm font-semibold text-neutral-800">{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-neutral-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">{dict.reviews}</h2>
            <p className="mb-3 text-xs text-neutral-500">
              {detail.reviewsSummary.count} reviews • avg {detail.reviewsSummary.rating || "-"}
            </p>

            <div className="space-y-2">
              {detail.reviews.map((review) => (
                <article key={review.id} className="rounded-xl bg-neutral-100 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-neutral-800">{review.title}</h3>
                    <span className="text-xs text-neutral-600">★ {review.rating}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-700">{review.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-neutral-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-neutral-900">Samples</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {detail.samples.map((sample) => (
                <div key={`${sample.type}-${sample.title}`} className="rounded-xl bg-neutral-100 p-3">
                  <p className="text-xs font-semibold text-neutral-800">{sample.title}</p>
                  <p className="mt-1 text-xs text-neutral-700">{sample.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-neutral-200 p-4 text-xs text-neutral-600">
            Last verified: {new Date(verifiedDate).toLocaleString("en-IN")} • Source:{" "}
            <a
              className="font-semibold text-neutral-800 underline"
              href={detail.provenance.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {detail.provenance.sourceUrl}
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
