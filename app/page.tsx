import Link from "next/link";
import { CASES } from "@/lib/cases";
import { ArrowRight } from "lucide-react";

const difficultyLabel = {
  low: "Introductory",
  moderate: "Intermediate",
  high: "Advanced",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header — no border, matches reference */}
      <header className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-sm text-slate-900 tracking-tight">SRA Trainer</span>
          <nav className="flex items-center gap-6">
            <span className="text-sm text-slate-900 border-b border-blue-600 pb-0.5">Home</span>
            <span className="text-sm text-slate-400">Cases</span>
            <span className="text-sm text-slate-400">About</span>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* Hero — reference style: large regular-weight display text, lots of air */}
        <div className="pt-14 pb-12 border-b border-slate-200">
          <h2 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-normal text-slate-900 leading-[1.08] tracking-[-0.02em] mb-8 max-w-4xl">
            Training suicide risk assessment skills with AI-driven virtual patients.
          </h2>
          <div>
            <p className="text-sm font-semibold text-slate-900">Psychiatry Resident Training Tool</p>
            <p className="text-sm text-slate-500">AI Virtual Patients · C-SSRS Framework · Expert Debrief</p>
          </div>
        </div>

        {/* How it works — inline, no cards */}
        <div className="py-10 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">01 — Interview</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chat with an AI patient in real time. They guard information like real patients — probe to uncover the full picture.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">02 — Track</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The expert panel updates live with C-SSRS coverage, emerging risk signals, and coaching tips after each exchange.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">03 — Debrief</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hidden risk profile revealed. Your questions compared side-by-side with expert recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Case list */}
        <div className="py-10">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400">Select a Case</h3>
            <p className="text-xs text-slate-400">Risk level hidden until debrief</p>
          </div>

          <div>
            {CASES.map((c, i) => (
              <Link key={c.id} href={`/session/${c.id}`} className="group block">
                <div className="flex items-center gap-5 py-6 border-b border-slate-200 hover:bg-slate-50 -mx-6 px-6 transition-colors duration-150">
                  {/* Index */}
                  <span className="text-xs text-slate-300 font-medium w-4 flex-shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0 bg-white">
                    {c.avatarInitials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="font-semibold text-slate-900 text-sm">
                        {c.name}, {c.age}
                      </span>
                      <span className="text-slate-300 text-sm">·</span>
                      <span className="text-sm text-slate-500">{c.occupation}</span>
                    </div>
                    <p className="text-sm text-slate-400 italic">&ldquo;{c.presentingComplaint}&rdquo;</p>
                  </div>

                  {/* Difficulty + arrow */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                      {difficultyLabel[c.riskLevel]}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pb-12">
          <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-slate-200 pl-4">
            <strong className="text-slate-500">Educational use only.</strong> Designed to supplement supervised clinical training, not replace it.
            AI-generated responses are simulations. Always defer to trained clinicians for actual patient care.
          </p>
        </div>
      </main>
    </div>
  );
}
