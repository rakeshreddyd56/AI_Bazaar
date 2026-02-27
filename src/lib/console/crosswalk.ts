import { modelById } from "@/lib/console/models";
import { publishedListings } from "@/lib/data/store";

export type ListingModelLink = {
  listingId: string;
  listingSlug: string;
  modelId: string;
  confidence: number;
};

export const listingModelLinks = (): ListingModelLink[] =>
  publishedListings()
    .map((listing) => {
      if (modelById(listing.id)) {
        return {
          listingId: listing.id,
          listingSlug: listing.slug,
          modelId: listing.id,
          confidence: 1,
        };
      }

      return null;
    })
    .filter((entry): entry is ListingModelLink => Boolean(entry));
