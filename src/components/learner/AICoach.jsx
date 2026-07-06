// @ts-nocheck
import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, BookOpen, TrendingUp, AlertTriangle, ArrowRight, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RECOMMENDATIONS = [
  {
    id: 1,
    type: "continue",
    icon: TrendingUp,
    color: "bg-blue-600",
    label: "Pick up where you left off",
    title: "Recognising Signs of Abuse",
    reason: "You completed 62% of Safeguarding Level 2 — you're on a roll. Module 3 is next.",
    xp: 120,
    time: "10 min",
  },
  {
    id: 2,
    type: "recommended",
    icon: BookOpen,
    color: "bg-violet-600",
    label: "Recommended for you",
    title: "Therapeutic Parenting in Practice",
    reason: "Based on your Safeguarding progress, carers who take this next see better outcomes in placement stability.",
    xp: 180,
    time: "90 min",
  },
  {
    id: 3,
    type: "urgent",
    icon: AlertTriangle,
    color: "bg-amber-500",
    label: "Expiring soon",
    title: "Fostering Legislation Update 2024",
    reason: "Your mandatory legislation training is due for renewal within 30 days. 30 minutes to complete.",
    xp: 60,
    time: "30 min",
  },
];

export default function AICoach({ userName }) {
  const [expanded, setExpanded] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setQuestion("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert AI learning coach for UK foster carers and social workers on the AAF CareConnect platform. Answer concisely and supportively in 2–3 sentences. The learner asks: "${q}"`,
    });
    setMessages((m) => [...m, { role: "ai", text: typeof res === "string" ? res : res?.response || "I'm here to help — please try again." }]);
    setLoading(false);
  };

  return (
    <section className="card overflow-hidden animate-fade-in">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">AI Learning Coach</p>
            <p className="text-[11px] text-slate-400">Personalised guidance · always on</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">3 recommendations</span>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-50">
          {/* Greeting */}
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-3 mt-3">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Good to see you{userName ? `, ${userName.split(" ")[0]}` : ""}!</span>{" "}
              You've got a 12-day streak going — keep it alive with just 10 minutes today.
            </p>
          </div>

          {/* Recommendation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RECOMMENDATIONS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.id} className="bg-white border border-slate-100 rounded-xl p-3.5 hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-lg ${r.color} flex items-center justify-center`}>
                      <Icon size={12} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{r.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug mb-1.5 group-hover:text-blue-600 transition-colors">
                    {r.title}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{r.reason}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-0.5"><Zap size={10} className="text-amber-500" /> {r.xp} XP</span>
                      <span>{r.time}</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ask the AI coach */}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">Ask your AI Coach anything</p>
            {messages.length > 0 && (
              <div className="space-y-2 mb-2 max-h-40 overflow-y-auto pr-1">
                {messages.map((m, i) => (
                  <div key={i} className={`text-[12px] leading-relaxed px-3 py-2 rounded-lg ${m.role === "user" ? "bg-blue-600 text-white ml-6" : "bg-white text-slate-700 border border-slate-100 mr-6"}`}>
                    {m.text}
                  </div>
                ))}
                {loading && (
                  <div className="bg-white border border-slate-100 text-slate-400 text-[12px] px-3 py-2 rounded-lg mr-6 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                placeholder="e.g. What should I study to improve my safeguarding knowledge?"
                className="flex-1 h-8 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />
              <button
                onClick={sendQuestion}
                disabled={!question.trim() || loading}
                className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Sparkles size={11} /> Ask
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}