import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addReview, listingById, userReviewCountForListing } from "@/lib/data/store";
import { logEvent } from "@/lib/observability/events";

const reviewSchema = z.object({
  listingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(4).max(120),
  body: z.string().min(20).max(2_000),
  locale: z.enum(["en-IN", "hi-IN"]).default("en-IN"),
});

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id") ?? "";
  if (!userId) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Add auth integration (Clerk) and forward user id in x-user-id header.",
      },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid review payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const listing = listingById(parsed.data.listingId);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const existingCount = userReviewCountForListing(userId, parsed.data.listingId);
  if (existingCount >= 3) {
    return NextResponse.json(
      {
        error: "Review limit exceeded for this listing",
      },
      { status: 429 },
    );
  }

  const review = addReview({
    ...parsed.data,
    userId,
  });

  logEvent("api.reviews.create", {
    listing_id: parsed.data.listingId,
    user_id: userId,
    rating: parsed.data.rating,
  });

  return NextResponse.json(
    {
      message: "Review submitted",
      review,
    },
    { status: 201 },
  );
}
