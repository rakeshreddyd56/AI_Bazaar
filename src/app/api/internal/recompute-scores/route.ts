import { NextResponse } from "next/server";
import { allListings, reviewsSummary } from "@/lib/data/store";
import { healthForListing } from "@/lib/health/score";
import { logEvent } from "@/lib/observability/events";

export async function POST() {
  const listings = allListings();

  const rows = listings.map((listing) => ({
    id: listing.id,
    health: healthForListing(listing),
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
