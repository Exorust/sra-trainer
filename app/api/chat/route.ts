import Anthropic from "@anthropic-ai/sdk";
import { CASES } from "@/lib/cases";

const client = new Anthropic();

export async function POST(req: Request) {
  const { caseId, messages } = await req.json();

  const patientCase = CASES.find((c) => c.id === caseId);
  if (!patientCase) {
    return new Response("Case not found", { status: 404 });
  }

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system: patientCase.systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
