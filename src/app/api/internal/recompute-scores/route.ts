import { NextResponse } from "next/server";
import { allListings, reviewsSummary } from "@/lib/data/store";
import { logEvent } from "@/lib/observability/events";
import { riskFlagForListing } from "@/lib/risk/flags";

export async function POST() {
  const listings = allListings();

  const rows = listings.map((listing) => ({
    id: listing.id,
    riskFlag: listing.riskFlag ?? riskFlagForListing(listing),
    reviewsSummary: reviewsSummary(listing.id),
  }));

  logEvent("api.internal.recompute_scores", {
    listings: rows.length,
  });

  return NextResponse.json({
    recomputed: rows.length,
    rows,
  });
}
