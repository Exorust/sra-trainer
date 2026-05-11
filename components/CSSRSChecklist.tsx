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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">Coverage</span>
        <span className="text-sm font-bold text-slate-900 tabular-nums">{pct}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-none h-0.5 mb-4">
        <div
          className="bg-blue-600 h-0.5 transition-all duration-500"
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
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              ) : domainPartial ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 flex-shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-200 flex-shrink-0" />
              )}
              <span className={`text-xs font-semibold tracking-wide ${domainCovered ? "text-blue-600" : domainPartial ? "text-slate-700" : "text-slate-400"}`}>
                {domain.label}
              </span>
            </div>
            <div className="ml-5 space-y-0.5">
              {subs.map((sub) => (
                <div key={sub.id} className="flex items-center gap-1.5">
                  {sub.covered ? (
                    <CheckCircle2 className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-200 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${sub.covered ? "text-slate-700" : "text-slate-400"}`}>
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
