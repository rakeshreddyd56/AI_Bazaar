import { seedListings, seedReviews } from "@/lib/data/seed";
import type { Listing, Review, Submission } from "@/lib/types";
import { average, id, nowIso, normalize } from "@/lib/utils";

type StoreState = {
  listings: Listing[];
  reviews: Review[];
  submissions: Submission[];
};

const globalStore = globalThis as typeof globalThis & {
  __aiBazaarStore?: StoreState;
};

const boot = (): StoreState => ({
  listings: [...seedListings],
  reviews: [...seedReviews],
  submissions: [],
});

const state = (): StoreState => {
  if (!globalStore.__aiBazaarStore) {
    globalStore.__aiBazaarStore = boot();
  }
  return globalStore.__aiBazaarStore;
};

export const allListings = () => [...state().listings];

export const publishedListings = () =>
  state().listings.filter((listing) => listing.published && listing.status === "verified");

export const listingBySlug = (slug: string, includeUnverified = false) => {
  const target = normalize(slug);
  return state().listings.find((listing) => {
    const baseMatch = listing.slug === target;
    if (!baseMatch) return false;
    if (includeUnverified) return true;
    return listing.published && listing.status === "verified";
  });
};

export const listingById = (idValue: string, includeUnverified = false) =>
  state().listings.find((listing) => {
    if (listing.id !== idValue) return false;
    if (includeUnverified) return true;
    return listing.published && listing.status === "verified";
  });

export const listingReviews = (listingId: string) =>
  state().reviews.filter((review) => review.listingId === listingId && !review.flagged);

export const reviewsSummary = (listingId: string) => {
  const reviews = listingReviews(listingId);
  return {
    count: reviews.length,
    rating: Number(average(reviews.map((review) => review.rating)).toFixed(2)),
  };
};

export const addSubmission = (
  payload: Omit<Submission, "id" | "status" | "createdAt">,
): Submission => {
  const submission: Submission = {
    id: id("sub"),
    status: "pending",
    createdAt: nowIso(),
    ...payload,
  };
  state().submissions.unshift(submission);
  return submission;
};

export const listSubmissions = () => [...state().submissions];

export const setSubmissionStatus = (
  submissionId: string,
  status: Submission["status"],
  notes?: string,
) => {
  const submission = state().submissions.find((item) => item.id === submissionId);
  if (!submission) return undefined;
  submission.status = status;
  submission.notes = notes;
  return submission;
};

export const addReview = (
  payload: Omit<Review, "id" | "createdAt" | "flagged">,
): Review => {
  const review: Review = {
    id: id("rev"),
    createdAt: nowIso(),
    flagged: false,
    ...payload,
  };
  state().reviews.unshift(review);
  return review;
};

export const userReviewCountForListing = (userId: string, listingId: string) =>
  state().reviews.filter((review) => review.userId === userId && review.listingId === listingId)
    .length;

export const upsertListings = (
  listings: Array<Partial<Listing> & Pick<Listing, "id" | "name">>,
  options?: { publish?: boolean; verified?: boolean },
) => {
  const current = state();
  let changed = 0;

  for (const partial of listings) {
    const existing = current.listings.find((listing) => listing.id === partial.id);
    if (existing) {
      Object.assign(existing, partial);
      existing.updatedAt = nowIso();
      if (options?.publish !== undefined) existing.published = options.publish;
      if (options?.verified === true) existing.status = "verified";
      changed += 1;
      continue;
    }

    const created: Listing = {
      id: partial.id,
      slug: partial.slug ?? normalize(partial.name),
      name: partial.name,
      summary: partial.summary ?? {
        "en-IN": partial.name,
        "hi-IN": partial.name,
      },
      modality: partial.modality ?? ["text"],
      tags: partial.tags ?? [],
      capabilities: partial.capabilities ?? {},
      limitations: partial.limitations ?? [],
      benchmarks: partial.benchmarks ?? {},
      pricingUsd: partial.pricingUsd,
      quickstart: partial.quickstart ?? [
        {
          "en-IN": "Review docs and configure API key.",
          "hi-IN": "डॉक्स देखें और API key कॉन्फ़िगर करें।",
        },
      ],
      bestFor: partial.bestFor ?? [
        {
          "en-IN": "General AI workflows.",
          "hi-IN": "सामान्य AI workflows।",
        },
      ],
      avoidWhen: partial.avoidWhen ?? [
        {
          "en-IN": "Requirements demand strict compliance review.",
          "hi-IN": "जब strict compliance review आवश्यक हो।",
        },
      ],
      samples: partial.samples ?? [],
      integration: partial.integration ?? {
        requiresApiKey: true,
        sdkQuality: "medium",
        selfHostDifficulty: "medium",
      },
      risk: partial.risk ?? {
        safetyScore: 0.5,
        misuseTags: ["unknown"],
      },
      compliance: partial.compliance ?? {
        license: "unknown",
        commercialUse: "unknown",
      },
      provenance: partial.provenance ?? {
        source: "ingest",
        sourceUrl: "",
        fetchedAt: nowIso(),
      },
      published: options?.publish ?? false,
      status: options?.verified ? "verified" : "unverified",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    current.listings.unshift(created);
    changed += 1;
  }

  return changed;
};
