import { providerFromListing } from "@/lib/branding";
import { modelById } from "@/lib/console/models";
import { listingBySlug, listingReviews, reviewsSummary } from "@/lib/data/store";
import { resolveLocale } from "@/lib/i18n";
import { riskFlagForListing } from "@/lib/risk/flags";

const isStale = (timestamp?: string) => {
  if (!timestamp) return true;
  const ms = new Date(timestamp).getTime();
  if (Number.isNaN(ms)) return true;
  return (Date.now() - ms) / (1000 * 60 * 60 * 24) > 7;
};

export const listingDetail = (slug: string, locale?: string) => {
  const listing = listingBySlug(slug);
  if (!listing) return undefined;

  const preferredLocale = resolveLocale(locale);
  const freshnessRef = listing.provenance.lastVerifiedAt ?? listing.updatedAt;

  return {
    ...listing,
    provider: listing.provider ?? providerFromListing(listing),
    riskFlag: listing.riskFlag ?? riskFlagForListing(listing),
    summaryText: listing.summary[preferredLocale],
    quickstartText: listing.quickstart.map((step) => step[preferredLocale]),
    bestForText: listing.bestFor.map((step) => step[preferredLocale]),
    avoidWhenText: listing.avoidWhen.map((step) => step[preferredLocale]),
    stale: isStale(freshnessRef),
    reviews: listingReviews(listing.id),
    reviewsSummary: reviewsSummary(listing.id),
    consoleModelId: modelById(listing.id)?.modelId,
  };
};
