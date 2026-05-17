import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { buildAnalystPrompt } from "@/lib/prompts";
import type { Message, CSSRSDomain, RiskSignal } from "@/types";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages, currentDomains, currentSignals }: {
    messages: Message[];
    currentDomains: CSSRSDomain[];
    currentSignals: RiskSignal[];
  } = await req.json();

  const prompt = buildAnalystPrompt(messages, currentDomains, currentSignals);

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
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
