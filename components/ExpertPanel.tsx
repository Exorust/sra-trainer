"use client";

import { CSSRSChecklist } from "./CSSRSChecklist";
import { RiskGauge } from "./RiskGauge";
import type { CSSRSDomain, RiskSignal } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";

interface Props {
  domains: CSSRSDomain[];
  signals: RiskSignal[];
  coachingTip: string;
  informationGathered: number;
  messageCount: number;
}

const signalSeverityLabel = {
  low: "text-slate-500 border-slate-200",
  moderate: "text-amber-700 border-amber-300",
  high: "text-slate-900 border-slate-900",
};

const categoryIcons: Record<RiskSignal["category"], string> = {
  ideation: "💭",
  plan: "📋",
  intent: "⚡",
  behavior: "⚠️",
  deterrent: "🛡️",
  context: "📌",
};

export function ExpertPanel({ domains, signals, coachingTip, informationGathered, messageCount }: Props) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="px-4 py-3 border-b border-slate-200">
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">Expert Panel</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="coaching" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b border-slate-200 bg-white h-9 p-0 justify-start gap-0">
            <TabsTrigger
              value="coaching"
              className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 text-slate-400 px-4 h-full font-medium"
            >
              Coaching
            </TabsTrigger>
            <TabsTrigger
              value="cssrs"
              className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 text-slate-400 px-4 h-full font-medium"
            >
              C-SSRS
            </TabsTrigger>
            <TabsTrigger
              value="signals"
              className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 text-slate-400 px-4 h-full font-medium"
            >
              Signals {signals.length > 0 && (
                <span className="ml-1 bg-slate-900 text-white text-[10px] px-1 rounded-sm">{signals.length}</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coaching" className="flex-1 p-4 space-y-5 mt-0">
            <RiskGauge value={informationGathered} />

            {/* Coaching tip — left border accent, no colored bg */}
            <div className="border-l-2 border-blue-600 pl-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5">Coaching Tip</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {messageCount === 0
                  ? "Start by introducing yourself and asking an open-ended question about what brings the patient in today."
                  : coachingTip || "Keep going — try to ask more specific questions about their thoughts and feelings."}
              </p>
            </div>

            {/* C-SSRS quick reference — minimal */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">C-SSRS Reference</p>
              <div className="space-y-1.5 text-xs text-slate-500">
                <p>Ask about <strong className="text-slate-700">wish to be dead</strong> first (passive)</p>
                <p>Probe for <strong className="text-slate-700">active thoughts</strong> if passive ideation found</p>
                <p>Assess <strong className="text-slate-700">plan, intent, means</strong> if active ideation</p>
                <p>Always ask about <strong className="text-slate-700">prior attempts</strong></p>
                <p>Identify <strong className="text-slate-700">deterrents</strong> and protective factors</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cssrs" className="flex-1 p-4 mt-0">
            <CSSRSChecklist domains={domains} />
          </TabsContent>

          <TabsContent value="signals" className="flex-1 p-4 mt-0">
            {signals.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No signals detected yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-3">Signals surface as the patient reveals information.</p>
                {signals.map((signal, i) => (
                  <div key={i} className={`border-l-2 pl-3 py-1 ${signalSeverityLabel[signal.severity]}`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold capitalize">{signal.category}</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">{signal.severity}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{signal.text}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
