import type { NextRequest } from "next/server";
import {
  DEMO_ORG_ID,
  DEMO_USER_ID,
  ensureMembership,
  hasRole,
  listApiKeys,
  lookupApiKey,
  membershipRole,
  touchApiKey,
  type ApiKeyInternal,
} from "@/lib/console/store";
import type { OrganizationRole } from "@/lib/types";

export type ActorContext = {
  orgId: string;
  userId: string;
  role: OrganizationRole;
  keyId?: string;
};

export const scopeAllows = (scopes: string[], requiredScope: string) => {
  if (scopes.includes("*")) return true;
  if (scopes.includes(requiredScope)) return true;

  const [requiredPrefix] = requiredScope.split(":");
  return scopes.some((scope) => scope.endsWith(":*") && scope.startsWith(`${requiredPrefix}:`));
};

const extractApiKey = (request: NextRequest) => {
  const direct = request.headers.get("x-api-key")?.trim();
  if (direct) return direct;

  const auth = request.headers.get("authorization")?.trim();
  if (!auth) return undefined;

  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim();
};

const roleFromHeader = (request: NextRequest): OrganizationRole | undefined => {
  const raw = request.headers.get("x-org-role")?.toLowerCase();
  if (raw === "owner" || raw === "admin" || raw === "member") return raw;
  return undefined;
};

const fallbackActorFromHeaders = (request: NextRequest): ActorContext => {
  const userId = request.headers.get("x-user-id")?.trim() || DEMO_USER_ID;
  const orgId = request.headers.get("x-org-id")?.trim() || DEMO_ORG_ID;
  const preferredRole = roleFromHeader(request) ?? "owner";

  const membership = ensureMembership(orgId, userId, preferredRole);

  return {
    orgId,
    userId,
    role: membership.role,
  };
};

const inferActorFromApiKey = (
  request: NextRequest,
  apiKey: ApiKeyInternal,
): ActorContext => {
  const userFromHeader = request.headers.get("x-user-id")?.trim();
  const userId = userFromHeader || apiKey.createdBy || DEMO_USER_ID;
  const orgId = apiKey.orgId;

  const existingRole = membershipRole(orgId, userId);
  const membership = ensureMembership(orgId, userId, existingRole ?? "member");

  touchApiKey(apiKey.id);

  return {
    orgId,
    userId,
    role: membership.role,
    keyId: apiKey.id,
  };
};

export const resolveConsoleActor = (request: NextRequest) => {
  if (process.env.NODE_ENV === "production") {
    const userId = request.headers.get("x-user-id")?.trim();
    const orgId = request.headers.get("x-org-id")?.trim();
    if (!userId || !orgId) {
      return {
        ok: false as const,
        status: 401,
        error: "Missing x-user-id or x-org-id headers.",
      };
    }
  }

  return {
    ok: true as const,
    actor: fallbackActorFromHeaders(request),
  };
};

export const requireConsoleRole = (
  actor: ActorContext,
  required: OrganizationRole,
) => {
  if (!hasRole(actor.role, required)) {
    return {
      ok: false as const,
      status: 403,
      error: `Requires ${required} role or higher.`,
    };
  }

  return {
    ok: true as const,
  };
};

export const authenticateInferenceRequest = (
  request: NextRequest,
  requiredScope: string,
) => {
  const keyValue = extractApiKey(request);
  if (!keyValue) {
    return {
      ok: false as const,
      status: 401,
      error: "Missing API key. Provide Authorization: Bearer <key> or x-api-key.",
      code: "missing_api_key",
    };
  }

  const key = lookupApiKey(keyValue);
  if (!key) {
    return {
      ok: false as const,
      status: 401,
      error: "Invalid or revoked API key.",
      code: "invalid_api_key",
    };
  }

  if (!scopeAllows(key.scopes, requiredScope)) {
    return {
      ok: false as const,
      status: 403,
      error: `API key is missing required scope: ${requiredScope}`,
      code: "missing_scope",
    };
  }

  const actor = inferActorFromApiKey(request, key);

  return {
    ok: true as const,
    actor,
    key,
  };
};

export const listScopesForKey = (orgId: string, keyId: string) =>
  listApiKeys(orgId).find((item) => item.id === keyId)?.scopes ?? [];
