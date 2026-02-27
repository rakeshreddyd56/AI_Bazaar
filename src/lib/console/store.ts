import crypto from "crypto";
import type {
  ApiKeyRecord,
  Organization,
  OrganizationMember,
  OrganizationRole,
  UsageSummary,
} from "@/lib/types";
import { clamp, id, nowIso } from "@/lib/utils";

export const DEMO_ORG_ID = "org_demo";
export const DEMO_USER_ID = "user_demo";
export const DEMO_LOCAL_API_KEY = "aibz_demo_local_key";

export type ApiKeyInternal = ApiKeyRecord & {
  keyHash: string;
  createdBy: string;
  rateLimitRpm?: number;
  revokedAt?: string;
};

export type UsageEvent = {
  id: string;
  orgId: string;
  userId: string;
  keyId?: string;
  modelId: string;
  provider: string;
  statusCode: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  heavyModel: boolean;
  stream: boolean;
  createdAt: string;
  errorCode?: string;
};

export type RequestError = {
  id: string;
  orgId: string;
  userId: string;
  modelId: string;
  statusCode: number;
  errorCode: string;
  createdAt: string;
};

type QueueCounters = {
  inFlightByUser: Record<string, number>;
  inFlightByOrg: Record<string, number>;
  queuedByUser: Record<string, number>;
  queuedByOrg: Record<string, number>;
};

type ConsoleState = {
  organizations: Organization[];
  memberships: OrganizationMember[];
  apiKeys: ApiKeyInternal[];
  usageEvents: UsageEvent[];
  requestErrors: RequestError[];
  queue: QueueCounters;
};

const globalConsole = globalThis as typeof globalThis & {
  __aiBazaarConsoleState?: ConsoleState;
};

const hashSalt = process.env.API_KEY_HASH_SALT ?? "ai-bazaar-local-salt";
const hasher = (raw: string) => crypto.createHash("sha256").update(`${hashSalt}:${raw}`).digest("hex");

const nowDayUtc = () => new Date().toISOString().slice(0, 10);

const countFromMap = (bag: Record<string, number>, key: string) => bag[key] ?? 0;
const incrementMap = (bag: Record<string, number>, key: string, by = 1) => {
  bag[key] = (bag[key] ?? 0) + by;
  if (bag[key] <= 0) delete bag[key];
};

const buildBootState = (): ConsoleState => {
  const timestamp = nowIso();
  const org: Organization = {
    id: DEMO_ORG_ID,
    name: "AI Bazaar Demo Org",
    createdAt: timestamp,
  };

  const member: OrganizationMember = {
    orgId: DEMO_ORG_ID,
    userId: DEMO_USER_ID,
    role: "owner",
    createdAt: timestamp,
  };

  const keys: ApiKeyInternal[] = [];

  if (process.env.NODE_ENV !== "production") {
    keys.push({
      id: "key_demo_local",
      orgId: DEMO_ORG_ID,
      label: "Local demo key",
      prefix: DEMO_LOCAL_API_KEY.slice(0, 12),
      status: "active",
      scopes: ["*"],
      createdAt: timestamp,
      lastUsedAt: undefined,
      keyHash: hasher(DEMO_LOCAL_API_KEY),
      createdBy: DEMO_USER_ID,
      rateLimitRpm: undefined,
      revokedAt: undefined,
    });
  }

  return {
    organizations: [org],
    memberships: [member],
    apiKeys: keys,
    usageEvents: [],
    requestErrors: [],
    queue: {
      inFlightByUser: {},
      inFlightByOrg: {},
      queuedByUser: {},
      queuedByOrg: {},
    },
  };
};

const state = () => {
  if (!globalConsole.__aiBazaarConsoleState) {
    globalConsole.__aiBazaarConsoleState = buildBootState();
  }
  return globalConsole.__aiBazaarConsoleState;
};

const roleRank: Record<OrganizationRole, number> = {
  member: 1,
  admin: 2,
  owner: 3,
};

export const hasRole = (actual: OrganizationRole, required: OrganizationRole) =>
  roleRank[actual] >= roleRank[required];

export const ensureOrganization = (orgId: string, name = "AI Bazaar Org") => {
  const internal = state();
  let organization = internal.organizations.find((item) => item.id === orgId);
  if (!organization) {
    organization = {
      id: orgId,
      name,
      createdAt: nowIso(),
    };
    internal.organizations.push(organization);
  }
  return organization;
};

export const ensureMembership = (
  orgId: string,
  userId: string,
  role: OrganizationRole = "member",
) => {
  const internal = state();
  ensureOrganization(orgId);

  let membership = internal.memberships.find((item) => item.orgId === orgId && item.userId === userId);
  if (!membership) {
    membership = {
      orgId,
      userId,
      role,
      createdAt: nowIso(),
    };
    internal.memberships.push(membership);
  }

  return membership;
};

export const membershipRole = (orgId: string, userId: string): OrganizationRole | undefined =>
  state().memberships.find((item) => item.orgId === orgId && item.userId === userId)?.role;

export const listApiKeys = (orgId: string) =>
  state().apiKeys
    .filter((item) => item.orgId === orgId)
    .map((item) => ({
      id: item.id,
      orgId: item.orgId,
      label: item.label,
      prefix: item.prefix,
      status: item.status,
      scopes: [...item.scopes],
      createdAt: item.createdAt,
      lastUsedAt: item.lastUsedAt,
    }));

const toInternalKey = (
  key: ApiKeyRecord,
  plaintext: string,
  createdBy: string,
  rateLimitRpm?: number,
): ApiKeyInternal => ({
  ...key,
  keyHash: hasher(plaintext),
  createdBy,
  rateLimitRpm,
  revokedAt: undefined,
});

export const createApiKey = (input: {
  orgId: string;
  label: string;
  scopes: string[];
  createdBy: string;
  rateLimitRpm?: number;
}) => {
  const raw = `aibz_${crypto.randomBytes(18).toString("hex")}`;

  const record: ApiKeyRecord = {
    id: id("key"),
    orgId: input.orgId,
    label: input.label,
    prefix: raw.slice(0, 12),
    status: "active",
    scopes: [...new Set(input.scopes.length ? input.scopes : ["inference:chat", "models:read"])],
    createdAt: nowIso(),
    lastUsedAt: undefined,
  };

  state().apiKeys.unshift(toInternalKey(record, raw, input.createdBy, input.rateLimitRpm));

  return {
    record,
    plaintextKey: raw,
  };
};

export const revokeApiKey = (orgId: string, keyId: string) => {
  const key = state().apiKeys.find((item) => item.id === keyId && item.orgId === orgId);
  if (!key || key.status === "revoked") return undefined;

  key.status = "revoked";
  key.revokedAt = nowIso();
  return key;
};

export const lookupApiKey = (plaintextKey: string) => {
  const internal = state();
  const hashed = hasher(plaintextKey);

  const key = internal.apiKeys.find((candidate) => {
    if (candidate.status !== "active") return false;

    const left = Buffer.from(candidate.keyHash);
    const right = Buffer.from(hashed);
    if (left.length !== right.length) return false;

    return crypto.timingSafeEqual(left, right);
  });

  return key;
};

export const touchApiKey = (keyId: string) => {
  const key = state().apiKeys.find((candidate) => candidate.id === keyId);
  if (!key) return;
  key.lastUsedAt = nowIso();
};

export const recordUsage = (event: Omit<UsageEvent, "id" | "createdAt">) => {
  const usage: UsageEvent = {
    id: id("usage"),
    createdAt: nowIso(),
    ...event,
  };

  state().usageEvents.unshift(usage);
  if (state().usageEvents.length > 8000) {
    state().usageEvents.length = 8000;
  }

  return usage;
};

export const recordRequestError = (error: Omit<RequestError, "id" | "createdAt">) => {
  const entry: RequestError = {
    id: id("err"),
    createdAt: nowIso(),
    ...error,
  };

  state().requestErrors.unshift(entry);
  if (state().requestErrors.length > 4000) {
    state().requestErrors.length = 4000;
  }

  return entry;
};

export const usageEventsForOrg = (orgId: string) =>
  state().usageEvents.filter((event) => event.orgId === orgId);

export const usageEventsForDay = (orgId: string, day = nowDayUtc()) =>
  usageEventsForOrg(orgId).filter((event) => event.createdAt.slice(0, 10) === day);

export const requestErrorsForOrg = (orgId: string, hours = 24) => {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return state().requestErrors.filter((error) => {
    if (error.orgId !== orgId) return false;
    return new Date(error.createdAt).getTime() >= cutoff;
  });
};

export const usageSummaryForOrg = (
  orgId: string,
  quota: {
    userDailyRequests: number;
    userDailyInputTokens: number;
    userDailyOutputTokens: number;
    orgDailyRequests: number;
    orgDailyInputTokens: number;
    orgDailyOutputTokens: number;
  },
): {
  daily: UsageSummary;
  monthlyTotals: { requests: number; inputTokens: number; outputTokens: number };
  byModel: Array<{
    modelId: string;
    requests: number;
    inputTokens: number;
    outputTokens: number;
    successRate: number;
    p95LatencyMs: number;
  }>;
  sparkline: Array<{ day: string; requests: number; inputTokens: number; outputTokens: number }>;
} => {
  const day = nowDayUtc();
  const all = usageEventsForOrg(orgId);
  const today = all.filter((event) => event.createdAt.slice(0, 10) === day);

  const requests = today.length;
  const inputTokens = today.reduce((sum, event) => sum + event.inputTokens, 0);
  const outputTokens = today.reduce((sum, event) => sum + event.outputTokens, 0);

  const monthlyWindow = all.filter((event) => {
    const eventDate = new Date(event.createdAt);
    const now = new Date();
    return (
      eventDate.getUTCFullYear() === now.getUTCFullYear() &&
      eventDate.getUTCMonth() === now.getUTCMonth()
    );
  });

  const monthlyTotals = {
    requests: monthlyWindow.length,
    inputTokens: monthlyWindow.reduce((sum, event) => sum + event.inputTokens, 0),
    outputTokens: monthlyWindow.reduce((sum, event) => sum + event.outputTokens, 0),
  };

  const grouped = new Map<string, UsageEvent[]>();
  for (const event of all) {
    const bag = grouped.get(event.modelId) ?? [];
    bag.push(event);
    grouped.set(event.modelId, bag);
  }

  const byModel = [...grouped.entries()]
    .map(([modelId, events]) => {
      const sortedLatency = [...events].map((event) => event.latencyMs).sort((a, b) => a - b);
      const idx = Math.floor(sortedLatency.length * 0.95);
      const success = events.filter((event) => event.statusCode < 400).length;

      return {
        modelId,
        requests: events.length,
        inputTokens: events.reduce((sum, event) => sum + event.inputTokens, 0),
        outputTokens: events.reduce((sum, event) => sum + event.outputTokens, 0),
        successRate: events.length ? clamp((success / events.length) * 100, 0, 100) : 0,
        p95LatencyMs: sortedLatency[idx] ?? 0,
      };
    })
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 12);

  const sparklineByDay = new Map<string, { requests: number; inputTokens: number; outputTokens: number }>();
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    sparklineByDay.set(date, { requests: 0, inputTokens: 0, outputTokens: 0 });
  }

  for (const event of all) {
    const key = event.createdAt.slice(0, 10);
    if (!sparklineByDay.has(key)) continue;
    const bag = sparklineByDay.get(key)!;
    bag.requests += 1;
    bag.inputTokens += event.inputTokens;
    bag.outputTokens += event.outputTokens;
  }

  const sparkline = [...sparklineByDay.entries()].map(([dayValue, metrics]) => ({
    day: dayValue,
    ...metrics,
  }));

  return {
    daily: {
      orgId,
      day,
      requests,
      inputTokens,
      outputTokens,
      quotaRemaining: {
        requests: Math.max(0, quota.orgDailyRequests - requests),
        inputTokens: Math.max(0, quota.orgDailyInputTokens - inputTokens),
        outputTokens: Math.max(0, quota.orgDailyOutputTokens - outputTokens),
      },
    },
    monthlyTotals,
    byModel,
    sparkline,
  };
};

export const queueSnapshot = (orgId?: string, userId?: string) => {
  const queue = state().queue;

  const orgInFlight = orgId ? countFromMap(queue.inFlightByOrg, orgId) : 0;
  const orgQueued = orgId ? countFromMap(queue.queuedByOrg, orgId) : 0;
  const userInFlight = userId ? countFromMap(queue.inFlightByUser, userId) : 0;
  const userQueued = userId ? countFromMap(queue.queuedByUser, userId) : 0;

  return {
    orgInFlight,
    orgQueued,
    userInFlight,
    userQueued,
    globalInFlight: Object.values(queue.inFlightByOrg).reduce((sum, value) => sum + value, 0),
    globalQueued: Object.values(queue.queuedByOrg).reduce((sum, value) => sum + value, 0),
  };
};

export const acquireInFlight = (orgId: string, userId: string) => {
  const queue = state().queue;
  incrementMap(queue.inFlightByOrg, orgId, 1);
  incrementMap(queue.inFlightByUser, userId, 1);
};

export const releaseInFlight = (orgId: string, userId: string) => {
  const queue = state().queue;
  incrementMap(queue.inFlightByOrg, orgId, -1);
  incrementMap(queue.inFlightByUser, userId, -1);
};

export const noteQueuedAttempt = (orgId: string, userId: string) => {
  const queue = state().queue;
  incrementMap(queue.queuedByOrg, orgId, 1);
  incrementMap(queue.queuedByUser, userId, 1);

  // Best-effort decay for queue indicator in local/in-memory mode.
  setTimeout(() => {
    incrementMap(queue.queuedByOrg, orgId, -1);
    incrementMap(queue.queuedByUser, userId, -1);
  }, 2500);
};

export const currentInFlight = (orgId: string, userId: string) => ({
  org: countFromMap(state().queue.inFlightByOrg, orgId),
  user: countFromMap(state().queue.inFlightByUser, userId),
});

export const currentQueued = (orgId: string, userId: string) => ({
  org: countFromMap(state().queue.queuedByOrg, orgId),
  user: countFromMap(state().queue.queuedByUser, userId),
});
