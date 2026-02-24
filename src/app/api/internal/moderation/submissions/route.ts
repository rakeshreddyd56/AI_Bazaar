import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listSubmissions, setSubmissionStatus } from "@/lib/data/store";
import { logEvent } from "@/lib/observability/events";

const patchSchema = z.object({
  submissionId: z.string().min(1),
  status: z.enum(["approved", "rejected"]),
  notes: z.string().max(1_000).optional(),
});

const isAuthorized = (request: NextRequest) => {
  const expectedToken = process.env.ADMIN_REVIEW_TOKEN;
  if (!expectedToken) return process.env.NODE_ENV !== "production";
  const provided = request.headers.get("x-admin-token");
  return provided === expectedToken;
};

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = listSubmissions().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ submissions });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid moderation payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const updated = setSubmissionStatus(
    parsed.data.submissionId,
    parsed.data.status,
    parsed.data.notes,
  );

  if (!updated) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  logEvent("api.internal.moderation.submission", {
    submission_id: updated.id,
    status: updated.status,
  });

  return NextResponse.json({
    message: `Submission ${updated.status}`,
    submission: updated,
  });
}
