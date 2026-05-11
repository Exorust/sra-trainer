"use client";

import type { CSSRSDomain } from "@/types";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  domains: CSSRSDomain[];
}

export function CSSRSChecklist({ domains }: Props) {
  const totalSubs = domains.flatMap((d) => d.subItems ?? []).length;
  const coveredSubs = domains.flatMap((d) => d.subItems ?? []).filter((s) => s.covered).length;
  const pct = totalSubs > 0 ? Math.round((coveredSubs / totalSubs) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">C-SSRS Coverage</span>
        <span className="text-sm font-semibold text-blue-600">{pct}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {domains.map((domain) => {
        const subs = domain.subItems ?? [];
        const domainCovered = subs.every((s) => s.covered);
        const domainPartial = subs.some((s) => s.covered) && !domainCovered;

        return (
          <div key={domain.id} className="space-y-1">
            <div className="flex items-center gap-2">
              {domainCovered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : domainPartial ? (
                <div className="w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-50 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
              )}
              <span className={`text-xs font-semibold ${domainCovered ? "text-emerald-700" : domainPartial ? "text-amber-700" : "text-slate-600"}`}>
                {domain.label}
              </span>
            </div>
            <div className="ml-6 space-y-0.5">
              {subs.map((sub) => (
                <div key={sub.id} className="flex items-center gap-1.5">
                  {sub.covered ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-200 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${sub.covered ? "text-emerald-600" : "text-slate-400"}`}>
                    {sub.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
