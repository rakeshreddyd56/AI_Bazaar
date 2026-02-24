import { describe, expect, it } from "vitest";
import { healthForListing } from "@/lib/health/score";
import { seedListings } from "@/lib/data/seed";

describe("healthForListing", () => {
  it("is deterministic for the same listing", () => {
    const listing = seedListings.find((item) => item.id === "svgsmith-studio");
    if (!listing) throw new Error("Expected seed listing svgsmith-studio");

    const a = healthForListing(listing);
    const b = healthForListing(listing);

    expect(a).toEqual(b);
  });

  it("returns a bounded score with a level", () => {
    const listing = seedListings.find((item) => item.id === "seedance-pro");
    if (!listing) throw new Error("Expected seed listing seedance-pro");

    const result = healthForListing(listing);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(["low", "medium", "high"]).toContain(result.level);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
