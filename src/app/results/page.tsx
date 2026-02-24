import Link from "next/link";
import { CompareMatrix } from "@/components/CompareMatrix";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { PersonaTabs } from "@/components/PersonaTabs";
import { ResultCard } from "@/components/ResultCard";
import { SearchCommand } from "@/components/SearchCommand";
import { executeSearch } from "@/lib/search/search";
import { dictionaryFor, resolveLocale } from "@/lib/i18n";
import type { Persona } from "@/lib/types";

const personaFromValue = (value?: string): Persona => {
  if (value === "business" || value === "research") return value;
  return "builder";
};

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
  const persona = personaFromValue(
    Array.isArray(params.persona) ? params.persona[0] : params.persona,
  );

  const dict = dictionaryFor(locale);

  if (!q) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <p className="mb-4 text-sm text-neutral-600">Missing query. Start from home search.</p>
        <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">
          Back to AI Bazaar
        </Link>
      </div>
    );
  }

  const result = executeSearch({ q, persona, locale });
  const compareItems = result.results.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f6f6f2]">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-xs font-medium text-neutral-500 hover:underline">
              ← AI Bazaar
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Search Results</h1>
            <p className="text-sm text-neutral-600">{result.explanation}</p>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitch locale={locale} variant="light" />
          </div>
        </header>

        <div className="mb-5">
          <PersonaTabs
            value={persona}
            variant="light"
            labels={{
              builder: dict.builder,
              business: dict.business,
              research: dict.research,
            }}
          />
        </div>

        <div className="mb-6">
          <SearchCommand
            defaultQuery={q}
            locale={locale}
            persona={persona}
            placeholder={dict.searchPlaceholder}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main>
            {result.results.length === 0 ? (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                {dict.noResults}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {result.results.map((item) => (
                  <ResultCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </main>

          <CompareMatrix items={compareItems} title={dict.compareTitle} />
        </div>
      </div>
    </div>
  );
}
