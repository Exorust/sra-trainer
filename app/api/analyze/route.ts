import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { buildAnalystPrompt } from "@/lib/prompts";
import type { Message, CSSRSDomain, RiskSignal } from "@/types";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, currentDomains, currentSignals }: {
    messages: Message[];
    currentDomains: CSSRSDomain[];
    currentSignals: RiskSignal[];
  } = await req.json();

  const prompt = buildAnalystPrompt(messages, currentDomains, currentSignals);

  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
    maxOutputTokens: 600,
  });

  try {
    const result = JSON.parse(text);
    return Response.json(result);
  } catch {
    return Response.json({
      coachingTip: "Keep going — try to ask more specific questions.",
      updatedDomains: [],
      newSignals: [],
      informationGathered: 0,
    });
  }
}
