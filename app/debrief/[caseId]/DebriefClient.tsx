"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, AlertTriangle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CSSRSDomain, RiskSignal, Message, PatientCase } from "@/types";

interface SessionData {
  messages: Message[];
  domains: CSSRSDomain[];
  signals: RiskSignal[];
  infoGathered: number;
}

interface Props {
  patientCase: PatientCase;
}

const riskConfig = {
  low: {
    label: "LOW RISK",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800",
    icon: "🟢",
  },
  moderate: {
    label: "MODERATE RISK",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    icon: "🟡",
  },
  high: {
    label: "HIGH RISK",
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800",
    icon: "🔴",
  },
};

const qualityConfig = {
  good: {
    border: "border-emerald-200 bg-emerald-50",
    label: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />,
    text: "Covered",
  },
  partial: {
    border: "border-amber-200 bg-amber-50",
    label: "bg-amber-100 text-amber-700",
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />,
    text: "Partial",
  },
  missed: {
    border: "border-rose-200 bg-rose-50",
    label: "bg-rose-100 text-rose-700",
    icon: <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />,
    text: "Missed",
  },
};

export function DebriefClient({ patientCase }: Props) {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(`session_${patientCase.id}`);
    if (raw) {
      setSessionData(JSON.parse(raw));
    } else {
      router.push(`/session/${patientCase.id}`);
    }
  }, [patientCase.id, router]);

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading debrief...</p>
      </div>
    );
  }

  const { messages, domains, signals } = sessionData;
  const userMessages = messages.filter((m) => m.role === "user");
  const risk = riskConfig[patientCase.riskLevel];

  const totalSubs = domains.flatMap((d) => d.subItems ?? []).length;
  const coveredSubs = domains.flatMap((d) => d.subItems ?? []).filter((s) => s.covered).length;
  const cssrsPct = totalSubs > 0 ? Math.round((coveredSubs / totalSubs) * 100) : 0;

  // Annotate expert questions with whether the user asked something similar
  const annotatedQuestions = patientCase.expertQuestions.map((eq) => {
    const userAskedSimilar = userMessages.some((m) => {
      const content = m.content.toLowerCase();
      const keywords = eq.expertQuestion.toLowerCase().split(" ").filter((w) => w.length > 4);
      return keywords.filter((kw) => content.includes(kw)).length >= 2;
    });

    // If user asked similar, upgrade "missed" to "partial"
    const quality = userAskedSimilar && eq.quality === "missed" ? "partial" : eq.quality;

    // Find the most relevant user question
    const relevantUserQ = userMessages.find((m) => {
      const content = m.content.toLowerCase();
      const keywords = eq.expertQuestion.toLowerCase().split(" ").filter((w) => w.length > 4);
      return keywords.filter((kw) => content.includes(kw)).length >= 2;
    });

    return { ...eq, quality, yourQuestion: relevantUserQ?.content };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">SRA Trainer</h1>
              <p className="text-xs text-slate-500">Session Debrief</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/session/${patientCase.id}`}>
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <Home className="w-3.5 h-3.5" />
                New Case
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Risk Reveal */}
        <div className={`rounded-2xl border-2 ${risk.border} ${risk.bg} p-6`}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{risk.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${risk.badge}`}>
                  {risk.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {patientCase.name}&apos;s hidden profile revealed
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed">{patientCase.revealedRiskExplanation}</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{userMessages.length}</p>
            <p className="text-xs text-slate-500 mt-1">Questions asked</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{cssrsPct}%</p>
            <p className="text-xs text-slate-500 mt-1">C-SSRS coverage</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{signals.length}</p>
            <p className="text-xs text-slate-500 mt-1">Risk signals detected</p>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Question Comparison</h3>
          <p className="text-sm text-slate-500 mb-4">
            Your approach vs. expert-recommended questions for this case.
          </p>
          <div className="space-y-3">
            {annotatedQuestions.map((eq, i) => {
              const qc = qualityConfig[eq.quality];
              return (
                <div key={i} className={`rounded-xl border ${qc.border} p-4`}>
                  <div className="flex items-start gap-2 mb-3">
                    {qc.icon}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${qc.label}`}>
                      {qc.text}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Your question</p>
                      {eq.yourQuestion ? (
                        <p className="text-sm text-slate-800 italic bg-white/60 rounded-lg p-2.5">
                          &ldquo;{eq.yourQuestion}&rdquo;
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 italic bg-white/60 rounded-lg p-2.5">
                          Not asked
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Expert recommendation</p>
                      <p className="text-sm text-slate-800 italic bg-white/60 rounded-lg p-2.5">
                        &ldquo;{eq.expertQuestion}&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/50">
                    <p className="text-xs text-slate-600">
                      <strong>Why this matters:</strong> {eq.annotation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Missed Red Flags */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-1">Key Red Flags in This Case</h3>
          <p className="text-sm text-slate-500 mb-4">
            Signals present in {patientCase.name}&apos;s responses that warranted follow-up.
          </p>
          <div className="grid gap-2">
            {patientCase.keyRedFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-3">
                <span className="text-rose-500 flex-shrink-0 mt-0.5">⚑</span>
                <p className="text-sm text-slate-700">{flag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* C-SSRS Coverage breakdown */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-4">C-SSRS Domain Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {domains.map((domain) => {
              const subs = domain.subItems ?? [];
              const covered = subs.filter((s) => s.covered).length;
              const total = subs.length;
              const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
              return (
                <div key={domain.id} className="bg-white border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-700">{domain.label}</p>
                    <span className={`text-xs font-bold ${pct === 100 ? "text-emerald-600" : pct > 0 ? "text-amber-600" : "text-slate-400"}`}>
                      {covered}/{total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${pct === 100 ? "bg-emerald-500" : pct > 0 ? "bg-amber-400" : "bg-slate-200"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <Link href={`/session/${patientCase.id}`} className="flex-1">
            <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="w-4 h-4" />
              Retry This Case
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              Try Another Case
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
