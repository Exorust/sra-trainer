"use client";

import { CSSRSChecklist } from "./CSSRSChecklist";
import { RiskGauge } from "./RiskGauge";
import type { CSSRSDomain, RiskSignal } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertTriangle } from "lucide-react";

interface Props {
  domains: CSSRSDomain[];
  signals: RiskSignal[];
  coachingTip: string;
  informationGathered: number;
  messageCount: number;
}

const signalColors = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  moderate: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-rose-50 text-rose-700 border-rose-200",
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
    <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h2 className="font-semibold text-slate-900 text-sm">Expert Panel</h2>
        <p className="text-xs text-slate-500">Updates after each exchange</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="coaching" className="h-full flex flex-col">
          <TabsList className="w-full rounded-none border-b border-slate-200 bg-white h-9 p-0 justify-start">
            <TabsTrigger value="coaching" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-3 h-full">
              Coaching
            </TabsTrigger>
            <TabsTrigger value="cssrs" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-3 h-full">
              C-SSRS
            </TabsTrigger>
            <TabsTrigger value="signals" className="text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-3 h-full">
              Signals {signals.length > 0 && <span className="ml-1 bg-rose-100 text-rose-600 text-[10px] px-1 rounded-full">{signals.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coaching" className="flex-1 p-4 space-y-4 mt-0">
            <RiskGauge value={informationGathered} />

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-700 mb-1">Coaching Tip</p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {messageCount === 0
                      ? "Start by introducing yourself and asking an open-ended question about what brings the patient in today."
                      : coachingTip || "Keep going — try to ask more specific questions about their thoughts and feelings."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-600 mb-2">C-SSRS Quick Reference</p>
              <div className="space-y-1 text-xs text-slate-500">
                <p>• Ask about <strong>wish to be dead</strong> first (passive)</p>
                <p>• Probe for <strong>active thoughts</strong> if passive ideation found</p>
                <p>• Assess <strong>plan, intent, means</strong> if active ideation</p>
                <p>• Always ask about <strong>prior attempts</strong></p>
                <p>• Identify <strong>deterrents</strong> and protective factors</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cssrs" className="flex-1 p-4 mt-0">
            <CSSRSChecklist domains={domains} />
          </TabsContent>

          <TabsContent value="signals" className="flex-1 p-4 mt-0">
            {signals.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No risk signals detected yet.</p>
                <p className="text-xs text-slate-400 mt-1">Keep asking questions.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 mb-3">Signals surface as the patient reveals information.</p>
                {signals.map((signal, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 text-xs ${signalColors[signal.severity]}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0">{categoryIcons[signal.category]}</span>
                      <div>
                        <span className="font-medium capitalize">{signal.category}</span>
                        <span className="mx-1">·</span>
                        <span className="capitalize opacity-75">{signal.severity} severity</span>
                        <p className="mt-0.5 leading-relaxed">{signal.text}</p>
                      </div>
                    </div>
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
