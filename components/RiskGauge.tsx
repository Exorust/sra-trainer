"use client";

interface Props {
  value: number; // 0-100
}

export function RiskGauge({ value }: Props) {
  const clamped = Math.min(100, Math.max(0, value));

  const color =
    clamped < 33
      ? "from-slate-400 to-slate-500"
      : clamped < 66
      ? "from-amber-400 to-amber-500"
      : "from-blue-500 to-blue-600";

  const label =
    clamped < 20
      ? "Just starting"
      : clamped < 40
      ? "Gathering context"
      : clamped < 60
      ? "Good progress"
      : clamped < 80
      ? "Strong coverage"
      : "Comprehensive";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Information Gathered</span>
        <span className="text-sm font-semibold text-slate-700">{clamped}%</span>
      </div>
      <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 text-right">{label}</p>
    </div>
  );
}
