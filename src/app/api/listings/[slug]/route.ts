import { NextRequest, NextResponse } from "next/server";
import { listingDetail } from "@/lib/data/listing-view";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const locale = request.nextUrl.searchParams.get("locale") ?? "en-IN";

  const listing = listingDetail(slug, locale);
  if (!listing) {
    return NextResponse.json(
      {
        error: "Listing not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(listing);
}
