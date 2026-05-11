import Link from "next/link";
import { CASES } from "@/lib/cases";
import { Brain, ChevronRight, ShieldCheck, BookOpen } from "lucide-react";

const riskColors = {
  low: "text-emerald-600 bg-emerald-50 border-emerald-200",
  moderate: "text-amber-600 bg-amber-50 border-amber-200",
  high: "text-rose-600 bg-rose-50 border-rose-200",
};

const difficultyLabel = {
  low: "Introductory",
  moderate: "Intermediate",
  high: "Advanced",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">SRA Trainer</h1>
            <p className="text-xs text-slate-500">Suicide Risk Assessment · AI Virtual Patients</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-4">
            <ShieldCheck className="w-3 h-3" />
            Psychiatry Resident Training Tool
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Practice Suicide Risk Assessment
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Interact with AI-driven virtual patients presenting with varying levels of suicidal
            ideation. Receive real-time C-SSRS guided coaching and a debrief comparing your
            approach to expert-recommended questions.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: "💬", title: "Interview", desc: "Chat with an AI patient in real time. They respond like real patients — guarding, withholding, opening up." },
            { icon: "📋", title: "Track", desc: "The expert panel updates live: C-SSRS coverage, risk signals, and coaching tips after each exchange." },
            { icon: "🔍", title: "Debrief", desc: "See the hidden risk profile revealed and compare your questions side-by-side with expert-recommended ones." },
          ].map((step) => (
            <div key={step.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-2xl mb-2">{step.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-1">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Select a Case</h3>
          </div>
          <p className="text-sm text-slate-500 ml-6">
            Each case has a hidden risk profile. You won&apos;t know the answer until the debrief.
          </p>
        </div>

        <div className="grid gap-4">
          {CASES.map((c, i) => (
            <Link key={c.id} href={`/session/${c.id}`} className="group">
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${c.avatarColor}`}>
                  {c.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-900">
                      {c.name}, {c.age}
                    </span>
                    <span className="text-slate-400 text-sm">·</span>
                    <span className="text-sm text-slate-500">{c.occupation}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-2">&ldquo;{c.presentingComplaint}&rdquo;</p>
                  <span className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full border ${riskColors[c.riskLevel]}`}>
                    {difficultyLabel[c.riskLevel]}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400 font-medium">Case {i + 1}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Educational use only.</strong> This tool is designed to supplement — not replace — supervised clinical training. AI-generated patient responses are simulations and should not be used for real clinical decision-making. Always defer to trained clinicians for actual patient care.
          </p>
        </div>
      </main>
    </div>
  );
}
