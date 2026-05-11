"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpertPanel } from "@/components/ExpertPanel";
import { Button } from "@/components/ui/button";
import { Brain, Send, StopCircle } from "lucide-react";
import { INITIAL_CSSRS_DOMAINS } from "@/lib/cases";
import type { Message, CSSRSDomain, RiskSignal, PatientCase } from "@/types";

interface Props {
  patientCase: PatientCase;
}

export function SessionClient({ patientCase }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [domains, setDomains] = useState<CSSRSDomain[]>(
    JSON.parse(JSON.stringify(INITIAL_CSSRS_DOMAINS))
  );
  const [signals, setSignals] = useState<RiskSignal[]>([]);
  const [coachingTip, setCoachingTip] = useState("");
  const [infoGathered, setInfoGathered] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const runAnalysis = useCallback(
    async (updatedMessages: Message[]) => {
      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            currentDomains: domains,
            currentSignals: signals,
          }),
        });
        const result = await res.json();

        if (result.updatedDomains?.length) {
          setDomains((prev) =>
            prev.map((domain) => ({
              ...domain,
              subItems: (domain.subItems ?? []).map((sub) => ({
                ...sub,
                covered: sub.covered || result.updatedDomains.includes(sub.id),
              })),
              covered:
                (domain.subItems ?? []).every(
                  (sub) => sub.covered || result.updatedDomains.includes(sub.id)
                ),
            }))
          );
        }

        if (result.newSignals?.length) {
          setSignals((prev) => [...prev, ...result.newSignals]);
        }

        if (result.coachingTip) setCoachingTip(result.coachingTip);
        if (typeof result.informationGathered === "number") {
          setInfoGathered((prev) => Math.max(prev, result.informationGathered));
        }
      } catch {
        // silent fail — UI continues
      } finally {
        setIsAnalyzing(false);
      }
    },
    [domains, signals]
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: patientCase.id,
          messages: newMessages,
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullContent };
          return updated;
        });
      }

      const finalMessages = [...newMessages, { role: "assistant" as const, content: fullContent }];
      setIsStreaming(false);
      await runAnalysis(finalMessages);
    } catch {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endSession = () => {
    const sessionData = {
      messages,
      domains,
      signals,
      infoGathered,
    };
    sessionStorage.setItem(`session_${patientCase.id}`, JSON.stringify(sessionData));
    router.push(`/debrief/${patientCase.id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">SRA Trainer</h1>
            <p className="text-xs text-slate-500">Session in progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAnalyzing && (
            <span className="text-xs text-blue-600 animate-pulse">Analyzing...</span>
          )}
          <span className="text-xs text-slate-400">{messages.filter((m) => m.role === "user").length} exchanges</span>
          <Button
            onClick={endSession}
            disabled={messages.length < 2}
            size="sm"
            variant="outline"
            className="text-xs gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <StopCircle className="w-3.5 h-3.5" />
            End &amp; Debrief
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Patient header */}
          <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${patientCase.avatarColor}`}>
              {patientCase.avatarInitials}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                {patientCase.name}, {patientCase.age}
              </p>
              <p className="text-xs text-slate-500">{patientCase.occupation}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                Risk level hidden until debrief
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 ${patientCase.avatarColor}`}>
                  {patientCase.avatarInitials}
                </div>
                <p className="text-slate-900 font-medium mb-1">{patientCase.name} is waiting</p>
                <p className="text-sm text-slate-500 max-w-xs">
                  &ldquo;{patientCase.presentingComplaint}&rdquo;
                </p>
                <p className="text-xs text-slate-400 mt-4">
                  Introduce yourself and ask an open-ended question to begin.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-1 ${patientCase.avatarColor}`}>
                    {patientCase.avatarInitials[0]}
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                  }`}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ml-2 flex-shrink-0 mt-1 bg-blue-100 text-blue-700">
                    You
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question or response..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isStreaming}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                size="sm"
                className="h-10 w-10 p-0 flex-shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 ml-1">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>

        {/* Expert Panel */}
        <div className="w-80 flex-shrink-0 hidden md:flex flex-col">
          <ExpertPanel
            domains={domains}
            signals={signals}
            coachingTip={coachingTip}
            informationGathered={infoGathered}
            messageCount={messages.length}
          />
        </div>
      </div>
    </div>
  );
}
