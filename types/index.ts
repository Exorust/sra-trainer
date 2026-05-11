export type RiskLevel = "low" | "moderate" | "high";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface CSSRSDomain {
  id: string;
  label: string;
  covered: boolean;
  subItems?: { id: string; label: string; covered: boolean }[];
}

export interface RiskSignal {
  text: string;
  category: "ideation" | "plan" | "intent" | "behavior" | "deterrent" | "context";
  severity: "low" | "moderate" | "high";
}

export interface AnalysisResult {
  coachingTip: string;
  updatedDomains: string[]; // domain IDs now covered
  newSignals: RiskSignal[];
  informationGathered: number; // 0-100 proxy score
}

export interface ExpertQuestion {
  yourQuestion?: string;
  expertQuestion: string;
  annotation: string;
  quality: "good" | "partial" | "missed";
}

export interface PatientCase {
  id: string;
  name: string;
  age: number;
  occupation: string;
  presentingComplaint: string;
  avatarInitials: string;
  avatarColor: string;
  riskLevel: RiskLevel;
  hiddenProfile: string;
  systemPrompt: string;
  expertQuestions: ExpertQuestion[];
  revealedRiskExplanation: string;
  keyRedFlags: string[];
}
