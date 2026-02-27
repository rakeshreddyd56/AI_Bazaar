import {
  acquireInFlight,
  currentInFlight,
  currentQueued,
  noteQueuedAttempt,
  releaseInFlight,
  usageEventsForDay,
} from "@/lib/console/store";

export type QuotaLimits = {
  userDailyRequests: number;
  userDailyInputTokens: number;
  userDailyOutputTokens: number;
  orgDailyRequests: number;
  orgDailyInputTokens: number;
  orgDailyOutputTokens: number;
  heavyUserDailyRequests: number;
  heavyOrgDailyRequests: number;
  maxConcurrentUser: number;
  maxConcurrentOrg: number;
  maxQueuedUser: number;
  maxQueuedOrg: number;
};

export const defaultQuotaLimits: QuotaLimits = {
  userDailyRequests: 200,
  userDailyInputTokens: 200_000,
  userDailyOutputTokens: 200_000,
  orgDailyRequests: 2_000,
  orgDailyInputTokens: 2_000_000,
  orgDailyOutputTokens: 2_000_000,
  heavyUserDailyRequests: 20,
  heavyOrgDailyRequests: 200,
  maxConcurrentUser: 2,
  maxConcurrentOrg: 20,
  maxQueuedUser: 5,
  maxQueuedOrg: 50,
};

export type QuotaDecision =
  | {
      allowed: true;
      ticket: {
        release: () => void;
      };
      quotaRemaining: {
        requests: number;
        inputTokens: number;
        outputTokens: number;
      };
    }
  | {
      allowed: false;
      status: number;
      retryAfterSec: number;
      code:
        | "quota_user_requests"
        | "quota_user_input_tokens"
        | "quota_user_output_tokens"
        | "quota_org_requests"
        | "quota_org_input_tokens"
        | "quota_org_output_tokens"
        | "quota_heavy_user"
        | "quota_heavy_org"
        | "queue_full"
        | "queue_wait";
      message: string;
    };

const dailyStats = (orgId: string, userId: string) => {
  const dayEvents = usageEventsForDay(orgId);
  const userEvents = dayEvents.filter((entry) => entry.userId === userId);

  return {
    org: {
      requests: dayEvents.length,
      inputTokens: dayEvents.reduce((sum, event) => sum + event.inputTokens, 0),
      outputTokens: dayEvents.reduce((sum, event) => sum + event.outputTokens, 0),
      heavyRequests: dayEvents.filter((event) => event.heavyModel).length,
    },
    user: {
      requests: userEvents.length,
      inputTokens: userEvents.reduce((sum, event) => sum + event.inputTokens, 0),
      outputTokens: userEvents.reduce((sum, event) => sum + event.outputTokens, 0),
      heavyRequests: userEvents.filter((event) => event.heavyModel).length,
    },
  };
};

export const evaluateQuota = (input: {
  orgId: string;
  userId: string;
  promptTokens: number;
  expectedOutputTokens: number;
  heavyModel: boolean;
  limits?: QuotaLimits;
}): QuotaDecision => {
  const limits = input.limits ?? defaultQuotaLimits;
  const stats = dailyStats(input.orgId, input.userId);

  if (stats.user.requests + 1 > limits.userDailyRequests) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 60,
      code: "quota_user_requests",
      message: "User request quota reached for today.",
    };
  }

  if (stats.user.inputTokens + input.promptTokens > limits.userDailyInputTokens) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 60,
      code: "quota_user_input_tokens",
      message: "User input token quota reached for today.",
    };
  }

  if (stats.user.outputTokens + input.expectedOutputTokens > limits.userDailyOutputTokens) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 60,
      code: "quota_user_output_tokens",
      message: "User output token quota reached for today.",
    };
  }

  if (stats.org.requests + 1 > limits.orgDailyRequests) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 60,
      code: "quota_org_requests",
      message: "Organization request quota reached for today.",
    };
  }

  if (stats.org.inputTokens + input.promptTokens > limits.orgDailyInputTokens) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 60,
      code: "quota_org_input_tokens",
      message: "Organization input token quota reached for today.",
    };
  }

  if (stats.org.outputTokens + input.expectedOutputTokens > limits.orgDailyOutputTokens) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 60,
      code: "quota_org_output_tokens",
      message: "Organization output token quota reached for today.",
    };
  }

  if (input.heavyModel && stats.user.heavyRequests + 1 > limits.heavyUserDailyRequests) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 120,
      code: "quota_heavy_user",
      message: "Heavy-model user quota reached for today.",
    };
  }

  if (input.heavyModel && stats.org.heavyRequests + 1 > limits.heavyOrgDailyRequests) {
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 120,
      code: "quota_heavy_org",
      message: "Heavy-model organization quota reached for today.",
    };
  }

  const inflight = currentInFlight(input.orgId, input.userId);
  if (inflight.user >= limits.maxConcurrentUser || inflight.org >= limits.maxConcurrentOrg) {
    const queued = currentQueued(input.orgId, input.userId);

    if (queued.user >= limits.maxQueuedUser || queued.org >= limits.maxQueuedOrg) {
      return {
        allowed: false,
        status: 429,
        retryAfterSec: 5,
        code: "queue_full",
        message: "Queue is full. Retry shortly.",
      };
    }

    noteQueuedAttempt(input.orgId, input.userId);
    return {
      allowed: false,
      status: 429,
      retryAfterSec: 3,
      code: "queue_wait",
      message: "Model queue is busy. Retry in a few seconds.",
    };
  }

  acquireInFlight(input.orgId, input.userId);

  let released = false;
  return {
    allowed: true,
    ticket: {
      release: () => {
        if (released) return;
        releaseInFlight(input.orgId, input.userId);
        released = true;
      },
    },
    quotaRemaining: {
      requests: Math.max(0, limits.orgDailyRequests - (stats.org.requests + 1)),
      inputTokens: Math.max(0, limits.orgDailyInputTokens - (stats.org.inputTokens + input.promptTokens)),
      outputTokens: Math.max(
        0,
        limits.orgDailyOutputTokens - (stats.org.outputTokens + input.expectedOutputTokens),
      ),
    },
  };
};
