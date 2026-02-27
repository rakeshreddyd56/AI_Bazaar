import type { CategorySlug } from "@/lib/categories";

export type Intent =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "code"
  | "agent"
  | "search";

export type RiskLevel = "watchlist" | "high";
export type HealthLevel = "low" | "medium" | "high";
export type RuntimeState = "warm" | "loading" | "cold";
export type CapabilityKey =
  | "tools"
  | "vision"
  | "json_mode"
  | "streaming"
  | "completion";
export type ConsoleMode = "marketplace" | "console";
export type OrganizationRole = "owner" | "admin" | "member";

export type LocalizedString = {
  "en-IN": string;
  "hi-IN": string;
};

export interface ProviderInfo {
  key: string;
  name: string;
  logoPath: string;
}

export interface ModelRuntimeMeta {
  modelId: string;
  family: string;
  provider: string;
  contextLength: number;
  maxOutputTokens: number;
  runtimeState: RuntimeState;
  supports: Record<CapabilityKey, boolean>;
  pricingUsd?: { inputPerM?: number; outputPerM?: number };
}

export interface ApiKeyRecord {
  id: string;
  orgId: string;
  label: string;
  prefix: string;
  status: "active" | "revoked";
  scopes: string[];
  createdAt: string;
  lastUsedAt?: string;
}

export interface UsageSummary {
  orgId: string;
  day: string;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  quotaRemaining: {
    requests: number;
    inputTokens: number;
    outputTokens: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface OrganizationMember {
  orgId: string;
  userId: string;
  role: OrganizationRole;
  createdAt: string;
}

export interface RiskFlag {
  level: RiskLevel;
  reasons: string[];
}

export interface SearchRequest {
  q: string;
  locale?: "en-IN" | "hi-IN";
  intent?: Intent;
  category?: CategorySlug;
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
  provider: ProviderInfo;
  categoryPrimary: CategorySlug;
  categorySecondary: CategorySlug[];
  riskFlag?: RiskFlag;
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
  categoryPrimary?: CategorySlug;
  categorySecondary?: CategorySlug[];
  provider?: ProviderInfo;
  riskFlag?: RiskFlag;
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
  categories: string;
}
