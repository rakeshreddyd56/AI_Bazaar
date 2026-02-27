import { NextRequest, NextResponse } from "next/server";
import {
  inferBestCategoriesForModel,
  modelById,
  modelCompatibilityMatrix,
} from "@/lib/console/models";
import { listingModelLinks } from "@/lib/console/crosswalk";
import { resolveConsoleActor } from "@/lib/inference/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  const { id } = await context.params;
  const model = modelById(id);
  if (!model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }

  const linkedListings = listingModelLinks().filter((link) => link.modelId === model.modelId);

  return NextResponse.json({
    actor: actor.actor,
    model,
    compatibility: modelCompatibilityMatrix(model),
    suggestedCategories: inferBestCategoriesForModel(model),
    linkedListings,
    snippets: {
      js: `const res = await client.chat.completions.create({ model: "${model.modelId}", messages: [{ role: "user", content: "hello" }] });`,
      curl: `curl -X POST https://theaibazaar.com/api/v1/chat/completions -H \"Authorization: Bearer <KEY>\" -H \"Content-Type: application/json\" -d '{\"model\":\"${model.modelId}\",\"messages\":[{\"role\":\"user\",\"content\":\"hello\"}]}'`,
    },
  });
}
