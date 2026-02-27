import { describe, expect, it } from "vitest";
import { evaluateQuota } from "@/lib/inference/quota";

describe("quota", () => {
  it("allows request and returns release ticket", () => {
    const decision = evaluateQuota({
      orgId: "org_quota_test_a",
      userId: "user_quota_test_a",
      promptTokens: 120,
      expectedOutputTokens: 180,
      heavyModel: false,
    });

    expect(decision.allowed).toBe(true);
    if (decision.allowed) {
      decision.ticket.release();
    }
  });

  it("returns queue_wait when in-flight limits are exceeded", () => {
    const first = evaluateQuota({
      orgId: "org_quota_test_b",
      userId: "user_quota_test_b",
      promptTokens: 10,
      expectedOutputTokens: 10,
      heavyModel: false,
    });

    const second = evaluateQuota({
      orgId: "org_quota_test_b",
      userId: "user_quota_test_b",
      promptTokens: 10,
      expectedOutputTokens: 10,
      heavyModel: false,
    });

    const third = evaluateQuota({
      orgId: "org_quota_test_b",
      userId: "user_quota_test_b",
      promptTokens: 10,
      expectedOutputTokens: 10,
      heavyModel: false,
    });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    if (!third.allowed) {
      expect(["queue_wait", "queue_full"]).toContain(third.code);
    }

    if (first.allowed) first.ticket.release();
    if (second.allowed) second.ticket.release();
  });
});
