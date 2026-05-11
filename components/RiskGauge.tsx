"use client";

interface Props {
  value: number; // 0-100
}

export function RiskGauge({ value }: Props) {
  const clamped = Math.min(100, Math.max(0, value));

  const label =
    clamped < 20 ? "Just starting"
    : clamped < 40 ? "Gathering context"
    : clamped < 60 ? "Good progress"
    : clamped < 80 ? "Strong coverage"
    : "Comprehensive";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">Information Gathered</span>
        <span className="text-sm font-bold text-slate-900 tabular-nums">{clamped}%</span>
      </div>
      <div className="relative w-full bg-slate-100 h-0.5">
        <div
          className="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
