import type { Message, CSSRSDomain, RiskSignal } from "@/types";

export function buildAnalystPrompt(
  conversation: Message[],
  currentDomains: CSSRSDomain[],
  currentSignals: RiskSignal[]
): string {
  const conversationText = conversation
    .map((m) => `${m.role === "user" ? "CLINICIAN" : "PATIENT"}: ${m.content}`)
    .join("\n");

  const coveredDomainIds = currentDomains
    .flatMap((d) => d.subItems ?? [])
    .filter((s) => s.covered)
    .map((s) => s.id);

  const allDomainIds = currentDomains.flatMap((d) =>
    (d.subItems ?? []).map((s) => s.id)
  );

  return `You are an expert psychiatric educator evaluating a trainee's suicide risk assessment conversation in real time.

CONVERSATION SO FAR:
${conversationText}

C-SSRS DOMAINS (sub-item IDs):
All possible: ${allDomainIds.join(", ")}
Already covered: ${coveredDomainIds.join(", ") || "none yet"}

Existing risk signals already flagged: ${currentSignals.map((s) => s.text).join("; ") || "none"}

Based on the LATEST exchange only, respond with a JSON object (no markdown, no explanation, just raw JSON) with this exact shape:
{
  "coachingTip": "One concise sentence of coaching for the trainee based on their last message — what was good, what to try next, or what they missed",
  "updatedDomains": ["array", "of", "sub-item", "IDs", "now covered based on conversation so far"],
  "newSignals": [
    {
      "text": "brief description of the risk signal found",
      "category": "ideation|plan|intent|behavior|deterrent|context",
      "severity": "low|moderate|high"
    }
  ],
  "informationGathered": 0
}

For informationGathered: integer 0-100 representing what % of relevant risk assessment information has been gathered (not the patient's risk level, but coverage of the assessment).

Only include truly NEW signals not already in the existing list. Return an empty array if nothing new.
Only include domain IDs that are genuinely covered by the conversation content.`;
}
