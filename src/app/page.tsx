import Link from "next/link";
import { publishedListings } from "@/lib/data/store";
import { dictionaryFor, resolveLocale } from "@/lib/i18n";
import type { Persona } from "@/lib/types";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { PersonaTabs } from "@/components/PersonaTabs";
import { SearchCommand } from "@/components/SearchCommand";
import { BrandLogo } from "@/components/BrandLogo";

const trendingQueries = [
  "best video gen tools for ads",
  "best SVG generation tools",
  "low-cost coding models",
  "best search APIs for RAG",
  "Hindi + English voice cloning tools",
];

const personaFromValue = (value?: string): Persona => {
  if (value === "business" || value === "research") return value;
  return "builder";
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(
    Array.isArray(params.locale) ? params.locale[0] : params.locale,
  );
  const persona = personaFromValue(
    Array.isArray(params.persona) ? params.persona[0] : params.persona,
  );

  const dict = dictionaryFor(locale);
  const recent = [...publishedListings()]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-120px] h-[420px] w-[420px] rounded-full bg-amber-400/25 blur-3xl" />
        <div className="absolute right-[-80px] top-[120px] h-[360px] w-[360px] rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
              India-first • AI discovery marketplace
            </p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{dict.appName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/moderation?${new URLSearchParams({ locale }).toString()}`}
              className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/35"
            >
              Submit / Review
            </Link>
            <LocaleSwitch locale={locale} />
          </div>
        </header>

        <div className="mb-6">
          <PersonaTabs
            value={persona}
            labels={{
              builder: dict.builder,
              business: dict.business,
              research: dict.research,
            }}
          />
        </div>

        <section className="mb-10 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur md:p-8">
          <h2 className="mb-2 text-2xl font-semibold md:text-3xl">{dict.tagline}</h2>
          <p className="mb-5 max-w-3xl text-sm text-neutral-300 md:text-base">
            Search naturally and compare capabilities, limits, pricing, benchmarks, health
            risk, and internal reviews at a granular level.
          </p>
          <SearchCommand
            locale={locale}
            persona={persona}
            placeholder={dict.searchPlaceholder}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {trendingQueries.map((query) => (
              <Link
                key={query}
                href={`/results?${new URLSearchParams({ q: query, locale, persona }).toString()}`}
                className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-neutral-200 transition hover:border-white/50 hover:bg-black/50"
              >
                {query}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h3 className="mb-3 text-lg font-semibold">{dict.trendingIntents}</h3>
            <div className="flex flex-wrap gap-2">
              {["video", "svg", "coding", "agents", "search", "voice"].map((intent) => (
                <Link
                  key={intent}
                  href={`/results?${new URLSearchParams({ q: `best ${intent} tools`, locale, persona }).toString()}`}
                  className="rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-neutral-100 transition hover:bg-white/20"
                >
                  {intent}
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h3 className="mb-3 text-lg font-semibold">{dict.whatChanged}</h3>
            <ul className="space-y-2 text-sm text-neutral-200">
              {recent.map((listing) => (
                <li key={listing.id} className="rounded-xl bg-black/25 px-3 py-2">
                  <div className="flex items-start gap-2">
                    <BrandLogo
                      target={{
                        id: listing.id,
                        slug: listing.slug,
                        name: listing.name,
                        source: listing.provenance.source,
                        sourceUrl: listing.provenance.sourceUrl,
                        tags: listing.tags,
                      }}
                      size="sm"
                    />
                    <div>
                      <div className="font-medium text-neutral-100">{listing.name}</div>
                      <div className="text-xs text-neutral-300">
                        Updated {new Date(listing.updatedAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}
