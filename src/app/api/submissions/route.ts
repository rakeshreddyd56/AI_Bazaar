import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addSubmission } from "@/lib/data/store";
import { logEvent } from "@/lib/observability/events";

const submissionSchema = z.object({
  name: z.string().min(2).max(120),
  websiteUrl: z.string().url(),
  description: z.string().min(20).max(2_000),
  modalities: z
    .array(z.enum(["text", "image", "video", "audio", "code", "agent", "search"]))
    .min(1),
  submittedBy: z.string().min(2).max(120),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid submission payload",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const submission = addSubmission(parsed.data);

  logEvent("api.submissions.create", {
    submission_id: submission.id,
    submitted_by: submission.submittedBy,
    modalities: submission.modalities.join(","),
  });

  return NextResponse.json(
    {
      message: "Submission received and queued for editorial review",
      submission,
    },
    { status: 201 },
  );
}
