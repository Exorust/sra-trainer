import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { CASES } from "@/lib/cases";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  const { caseId, messages } = await req.json();

  const patientCase = CASES.find((c) => c.id === caseId);
  if (!patientCase) {
    return new Response("Case not found", { status: 404 });
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: patientCase.systemPrompt,
    messages,
    maxOutputTokens: 300,
  });

  return result.toTextStreamResponse();
}
