import { NextResponse } from "next/server";

export const openAiErrorResponse = (
  status: number,
  code: string,
  message: string,
  param?: string,
  extraHeaders?: Record<string, string>,
) =>
  NextResponse.json(
    {
      error: {
        message,
        type: status >= 500 ? "server_error" : "invalid_request_error",
        param,
        code,
      },
    },
    {
      status,
      headers: {
        "cache-control": "no-store",
        ...extraHeaders,
      },
    },
  );

const toSseChunk = (payload: unknown) => `data: ${JSON.stringify(payload)}\n\n`;

export const sseResponse = (chunks: unknown[]) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(toSseChunk(chunk)));
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
};

export const chunkText = (text: string, segmentLength = 45) => {
  if (!text) return [] as string[];

  const out: string[] = [];
  for (let i = 0; i < text.length; i += segmentLength) {
    out.push(text.slice(i, i + segmentLength));
  }
  return out;
};
