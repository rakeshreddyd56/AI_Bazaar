import Link from "next/link";
import { Suspense } from "react";
import { AppModeSwitch } from "@/components/AppModeSwitch";
import { CategorySidebar } from "@/components/CategorySidebar";
import { CompareMatrix } from "@/components/CompareMatrix";
import { CurrencySwitch } from "@/components/CurrencySwitch";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { ResultCard } from "@/components/ResultCard";
import { SearchCommand } from "@/components/SearchCommand";
import { isCategorySlug } from "@/lib/categories";
import { resolveCurrency } from "@/lib/currency";
import { executeSearch } from "@/lib/search/search";
import { dictionaryFor, resolveLocale } from "@/lib/i18n";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";

  const locale = resolveLocale(
    Array.isArray(params.locale) ? params.locale[0] : params.locale,
  );
  const currency = resolveCurrency(
    Array.isArray(params.currency) ? params.currency[0] : params.currency,
  );
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const category = isCategorySlug(categoryParam) ? categoryParam : "all";

  const dict = dictionaryFor(locale);

  if (!q) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="mb-4 text-sm text-neutral-600">Missing query. Start from home search.</p>
        <Link
          href={`/?${new URLSearchParams({ locale, currency }).toString()}`}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          Back to AI Bazaar
        </Link>
      </div>
    );
  }

  const result = executeSearch({ q, category, locale });
  const compareItems = result.results.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f6f6f2]">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href={`/?${new URLSearchParams({ locale, currency }).toString()}`}
              className="text-xs font-medium text-neutral-500 hover:underline"
            >
              ← AI Bazaar
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Search Results</h1>
            <p className="text-sm text-neutral-600">{result.explanation}</p>
          </div>
          <div className="flex items-center gap-3">
            <Suspense fallback={<div className="hidden md:block" />}>
              <AppModeSwitch mode="marketplace" variant="light" />
            </Suspense>
            <CurrencySwitch currency={currency} variant="light" />
            <LocaleSwitch locale={locale} variant="light" />
          </div>
        </header>

        <div className="mb-6">
          <SearchCommand
            defaultQuery={q}
            locale={locale}
            category={category}
            currency={currency}
            placeholder={dict.searchPlaceholder}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
          <CategorySidebar locale={locale} selected={category} />

          <main>
            {result.results.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                {dict.noResults}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {result.results.map((item) => (
                  <ResultCard key={item.id} item={item} locale={locale} currency={currency} />
                ))}
              </div>
            )}
          </main>

          <CompareMatrix items={compareItems} title={dict.compareTitle} currency={currency} />
        </div>
      </div>
    </div>
  );
}
