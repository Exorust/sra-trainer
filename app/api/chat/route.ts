import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { CASES } from "@/lib/cases";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { caseId, messages } = await req.json();

  const patientCase = CASES.find((c) => c.id === caseId);
  if (!patientCase) {
    return new Response("Case not found", { status: 404 });
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: patientCase.systemPrompt,
    messages,
    maxOutputTokens: 300,
  });

  return result.toTextStreamResponse();
}
