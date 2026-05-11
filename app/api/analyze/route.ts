import Anthropic from "@anthropic-ai/sdk";
import { buildAnalystPrompt } from "@/lib/prompts";
import type { Message, CSSRSDomain, RiskSignal } from "@/types";

const client = new Anthropic();

export async function POST(req: Request) {
  const { messages, currentDomains, currentSignals }: {
    messages: Message[];
    currentDomains: CSSRSDomain[];
    currentSignals: RiskSignal[];
  } = await req.json();

  const prompt = buildAnalystPrompt(messages, currentDomains, currentSignals);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";

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
