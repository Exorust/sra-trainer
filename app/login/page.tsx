"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Incorrect password.");
        setPassword("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <span className="text-sm text-slate-900">SRA Trainer</span>
        </div>
      </header>

      {/* Login */}
      <div className="flex-1 flex items-start">
        <div className="max-w-5xl w-full mx-auto px-6 pt-14 border-t border-slate-200">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-6">
            Access Required
          </p>
          <h1 className="text-[3rem] md:text-[4rem] font-normal text-slate-900 leading-[1.08] tracking-[-0.02em] mb-10 max-w-xl">
            Enter the access password to continue.
          </h1>

          <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full border border-slate-200 rounded px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                disabled={loading}
              />
              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!password || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded transition-colors"
            >
              {loading ? "Checking..." : "Continue →"}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-8 border-l-2 border-slate-200 pl-4 max-w-sm leading-relaxed">
            This tool uses the Anthropic API. Access is restricted to authorized users.
          </p>
        </div>
      </div>
    </div>
  );
}
