"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  low: { label: "LOW RISK", accent: "border-blue-600", textAccent: "text-blue-600" },
  moderate: { label: "MODERATE RISK", accent: "border-amber-500", textAccent: "text-amber-600" },
  high: { label: "HIGH RISK", accent: "border-slate-900", textAccent: "text-slate-900" },
};

const qualityConfig = {
  good: {
    border: "border-l-blue-600",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />,
    label: "text-blue-600",
    labelText: "Covered",
  },
  partial: {
    border: "border-l-amber-500",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />,
    label: "text-amber-600",
    labelText: "Partial",
  },
  missed: {
    border: "border-l-slate-300",
    icon: <XCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />,
    label: "text-slate-400",
    labelText: "Missed",
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-slate-400 text-sm">Loading debrief...</p>
      </div>
    );
  }

  const { messages, domains, signals } = sessionData;
  const userMessages = messages.filter((m) => m.role === "user");
  const risk = riskConfig[patientCase.riskLevel];

  const totalSubs = domains.flatMap((d) => d.subItems ?? []).length;
  const coveredSubs = domains.flatMap((d) => d.subItems ?? []).filter((s) => s.covered).length;
  const cssrsPct = totalSubs > 0 ? Math.round((coveredSubs / totalSubs) * 100) : 0;

  const annotatedQuestions = patientCase.expertQuestions.map((eq) => {
    const userAskedSimilar = userMessages.some((m) => {
      const content = m.content.toLowerCase();
      const keywords = eq.expertQuestion.toLowerCase().split(" ").filter((w) => w.length > 4);
      return keywords.filter((kw) => content.includes(kw)).length >= 2;
    });
    const quality = userAskedSimilar && eq.quality === "missed" ? "partial" : eq.quality;
    const relevantUserQ = userMessages.find((m) => {
      const content = m.content.toLowerCase();
      const keywords = eq.expertQuestion.toLowerCase().split(" ").filter((w) => w.length > 4);
      return keywords.filter((kw) => content.includes(kw)).length >= 2;
    });
    return { ...eq, quality, yourQuestion: relevantUserQ?.content };
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C7 1 2 4 2 7.5C2 10.5 4.2 13 7 13C9.8 13 12 10.5 12 7.5C12 4 7 1 7 1Z" fill="white" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-slate-900 tracking-tight">SRA Trainer</span>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-xs text-slate-400">Debrief</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/session/${patientCase.id}`}>
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-200 rounded-none text-slate-600 hover:bg-slate-50">
                <RotateCcw className="w-3 h-3" />
                Retry
              </Button>
            </Link>
            <Link href="/">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-200 rounded-none text-slate-600 hover:bg-slate-50">
                New Case
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* Risk Reveal — typographic, no colored card */}
        <div className={`border-l-4 ${risk.accent} pl-6 py-2`}>
          <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${risk.textAccent}`}>
            {risk.label} — Profile Revealed
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {patientCase.name}&apos;s hidden profile
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl">{patientCase.revealedRiskExplanation}</p>
        </div>

        {/* Stats — editorial large numbers */}
        <div className="grid grid-cols-3 gap-0 border border-slate-200 divide-x divide-slate-200">
          <div className="p-6">
            <p className="text-4xl font-bold text-slate-900 tabular-nums mb-1">{userMessages.length}</p>
            <p className="text-xs text-slate-400 tracking-widest uppercase">Questions asked</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold text-slate-900 tabular-nums mb-1">{cssrsPct}%</p>
            <p className="text-xs text-slate-400 tracking-widest uppercase">C-SSRS coverage</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-bold text-slate-900 tabular-nums mb-1">{signals.length}</p>
            <p className="text-xs text-slate-400 tracking-widest uppercase">Signals detected</p>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div>
          <div className="flex items-baseline gap-3 mb-6 border-b border-slate-200 pb-4">
            <h3 className="font-bold text-slate-900">Question Comparison</h3>
            <p className="text-sm text-slate-400">Your approach vs. expert recommendations</p>
          </div>
          <div className="space-y-0 divide-y divide-slate-100">
            {annotatedQuestions.map((eq, i) => {
              const qc = qualityConfig[eq.quality];
              return (
                <div key={i} className={`border-l-2 ${qc.border} pl-4 py-5`}>
                  <div className="flex items-center gap-2 mb-3">
                    {qc.icon}
                    <span className={`text-xs font-semibold tracking-widest uppercase ${qc.label}`}>
                      {qc.labelText}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">Your question</p>
                      {eq.yourQuestion ? (
                        <p className="text-sm text-slate-700 italic leading-relaxed">
                          &ldquo;{eq.yourQuestion}&rdquo;
                        </p>
                      ) : (
                        <p className="text-sm text-slate-300 italic">Not asked</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">Expert recommendation</p>
                      <p className="text-sm text-slate-700 italic leading-relaxed">
                        &ldquo;{eq.expertQuestion}&rdquo;
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                    <strong className="text-slate-600 not-italic">Why this matters:</strong> {eq.annotation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Red Flags */}
        <div>
          <div className="flex items-baseline gap-3 mb-6 border-b border-slate-200 pb-4">
            <h3 className="font-bold text-slate-900">Key Red Flags</h3>
            <p className="text-sm text-slate-400">Signals present in {patientCase.name}&apos;s responses</p>
          </div>
          <div className="space-y-0 divide-y divide-slate-100">
            {patientCase.keyRedFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-4 py-3">
                <span className="text-xs font-semibold text-slate-300 tabular-nums w-4 flex-shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{flag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* C-SSRS Coverage */}
        <div>
          <div className="flex items-baseline gap-3 mb-6 border-b border-slate-200 pb-4">
            <h3 className="font-bold text-slate-900">C-SSRS Coverage</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {domains.map((domain) => {
              const subs = domain.subItems ?? [];
              const covered = subs.filter((s) => s.covered).length;
              const total = subs.length;
              const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
              return (
                <div key={domain.id} className="border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-700">{domain.label}</p>
                    <span className={`text-xs font-bold tabular-nums ${pct === 100 ? "text-blue-600" : pct > 0 ? "text-slate-700" : "text-slate-300"}`}>
                      {covered}/{total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-0.5">
                    <div
                      className={`h-0.5 transition-all ${pct === 100 ? "bg-blue-600" : pct > 0 ? "bg-slate-400" : "bg-slate-100"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 pt-2 border-t border-slate-200">
          <Link href={`/session/${patientCase.id}`}>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-none text-sm">
              <RotateCcw className="w-4 h-4" />
              Retry This Case
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2 rounded-none border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">
              Try Another Case
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
