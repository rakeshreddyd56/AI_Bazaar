import Link from "next/link";
import { CategorySidebar } from "@/components/CategorySidebar";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { SearchCommand } from "@/components/SearchCommand";
import { BrandLogo } from "@/components/BrandLogo";
import { categoryDefinitions, isCategorySlug } from "@/lib/categories";
import { publishedListings } from "@/lib/data/store";
import { dictionaryFor, resolveLocale } from "@/lib/i18n";

const trendingQueries = [
  { q: "best video gen tools for ads", category: "video-generation" },
  { q: "best SVG generation tools", category: "svg-vector-brand-design" },
  { q: "top voice cloning models", category: "voice-tts-voice-cloning" },
  { q: "best coding models", category: "coding-models" },
  { q: "best agent frameworks", category: "agent-frameworks" },
  { q: "best AI avatars like HeyGen", category: "ai-avatars-talking-heads" },
] as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(
    Array.isArray(params.locale) ? params.locale[0] : params.locale,
  );
  const categoryParam = Array.isArray(params.category) ? params.category[0] : params.category;
  const category = isCategorySlug(categoryParam) ? categoryParam : "all";

  const dict = dictionaryFor(locale);
  const recent = [...publishedListings()]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-120px] h-[420px] w-[420px] rounded-full bg-amber-400/25 blur-3xl" />
        <div className="absolute right-[-80px] top-[120px] h-[360px] w-[360px] rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/aibazaar-logo.png"
              alt="AI Bazaar"
              className="h-14 w-auto rounded-xl border border-white/10 bg-black/20 p-1"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
                India-first • AI vertical marketplace
              </p>
              <h1 className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">{dict.appName}</h1>
            </div>
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

        <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
          <CategorySidebar locale={locale} selected={category} />

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur md:p-8">
              <h2 className="mb-2 text-2xl font-semibold md:text-3xl">{dict.tagline}</h2>
              <p className="mb-5 max-w-3xl text-sm text-neutral-300 md:text-base">
                Search naturally and compare capabilities, limitations, pricing, benchmarks,
                setup notes, and risk flags for controversial entries.
              </p>
              <SearchCommand
                locale={locale}
                category={category}
                placeholder={dict.searchPlaceholder}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingQueries.map((query) => (
                  <Link
                    key={query.q}
                    href={`/results?${new URLSearchParams({
                      q: query.q,
                      locale,
                      category: query.category,
                    }).toString()}`}
                    className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs text-neutral-200 transition hover:border-white/50 hover:bg-black/50"
                  >
                    {query.q}
                  </Link>
                ))}
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="mb-3 text-lg font-semibold">{dict.trendingIntents}</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryDefinitions.slice(1, 9).map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/results?${new URLSearchParams({
                        q: `best ${entry.slug.replace(/-/g, " ")} tools`,
                        locale,
                        category: entry.slug,
                      }).toString()}`}
                      className="rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-neutral-100 transition hover:bg-white/20"
                    >
                      {entry.label[locale]}
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
                            providerKey: listing.provider?.key,
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
      </div>
    </div>
  );
}
