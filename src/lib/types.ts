export type Persona = "builder" | "business" | "research";

export type Intent =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "code"
  | "agent"
  | "search";

export type HealthLevel = "low" | "medium" | "high";

export type LocalizedString = {
  "en-IN": string;
  "hi-IN": string;
};

export interface SearchRequest {
  q: string;
  persona?: Persona;
  locale?: "en-IN" | "hi-IN";
  intent?: Intent;
}

export interface ComparisonItem {
  id: string;
  slug: string;
  name: string;
  modality: Intent[];
  capabilities: Record<string, string | number | boolean>;
  limitations: string[];
  pricingUsd?: {
    inputPerM?: number;
    outputPerM?: number;
    monthly?: number;
  };
  benchmarks: Record<string, number>;
  health: {
    level: HealthLevel;
    score: number;
    reasons: string[];
  };
  reviewsSummary: {
    count: number;
    rating: number;
  };
  updatedAt: string;
  source: string;
  lastVerifiedAt?: string;
  stale: boolean;
}

export interface Listing {
  id: string;
  slug: string;
  name: string;
  summary: LocalizedString;
  modality: Intent[];
  tags: string[];
  capabilities: Record<string, string | number | boolean>;
  limitations: string[];
  benchmarks: Record<string, number>;
  pricingUsd?: {
    inputPerM?: number;
    outputPerM?: number;
    monthly?: number;
  };
  quickstart: LocalizedString[];
  bestFor: LocalizedString[];
  avoidWhen: LocalizedString[];
  samples: Array<{
    type: "image" | "video" | "text" | "code" | "audio" | "svg";
    title: string;
    value: string;
  }>;
  integration: {
    requiresApiKey: boolean;
    sdkQuality: "high" | "medium" | "low";
    selfHostDifficulty: "easy" | "medium" | "hard";
  };
  risk: {
    safetyScore: number;
    misuseTags: string[];
  };
  compliance: {
    license: string;
    commercialUse: "allowed" | "restricted" | "unknown";
  };
  provenance: {
    source: string;
    sourceUrl: string;
    fetchedAt: string;
    lastVerifiedAt?: string;
  };
  published: boolean;
  status: "verified" | "unverified" | "pending_review";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  locale: "en-IN" | "hi-IN";
  createdAt: string;
  flagged: boolean;
}

export interface Submission {
  id: string;
  name: string;
  websiteUrl: string;
  description: string;
  modalities: Intent[];
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  notes?: string;
}

export interface SearchResult {
  request: Required<SearchRequest>;
  intent: Intent;
  explanation: string;
  confidence: number;
  results: ComparisonItem[];
}

export interface IngestResult {
  source: string;
  fetchedAt: string;
  received: number;
  normalized: number;
  errors: string[];
  preview: Array<Partial<Listing> & Pick<Listing, "id" | "name">>;
}

export interface LocaleDictionary {
  appName: string;
  tagline: string;
  searchPlaceholder: string;
  compareTitle: string;
  whatChanged: string;
  trendingIntents: string;
  bestFor: string;
  limitations: string;
  quickstart: string;
  avoidWhen: string;
  reviews: string;
  noResults: string;
  builder: string;
  business: string;
  research: string;
}
