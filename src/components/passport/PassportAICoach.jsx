// @ts-nocheck
import { useState } from "react";
import { Sparkles, ChevronRight, AlertTriangle, TrendingUp, BookOpen, X, Send } from "lucide-react";
import { AI_COACH_RECS, PASSPORT_PROFILE } from "@/lib/passportData";
import { base44 } from "@/api/base44Client";

const PRIORITY_CFG = {
  urgent: { bg: "bg-red-50",   border: "border-red-200",   badge: "bg-red-600 text-white",   icon: AlertTriangle, label: "Urgent" },
  high:   { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500 text-white",  icon: TrendingUp,    label: "High Priority" },
  medium: { bg: "bg-blue-50",  border: "border-blue-200",  badge: "bg-blue-600 text-white",   icon: BookOpen,      label: "Recommended" },
};

export default function PassportAICoach() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hi ${PASSPORT_PROFILE.name.split(" ")[0]}! 👋 I'm your AI Professional Development Coach. I've analysed your passport — you're doing great at **${PASSPORT_PROFILE.level}** status with ${PASSPORT_PROFILE.cpdHours} CPD hours. I have some personalised recommendations ready for you. What would you like to focus on today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI Professional Development Coach for UK foster carers on the AAF CareConnect platform.
The user is: ${PASSPORT_PROFILE.name}, ${PASSPORT_PROFILE.role} at ${PASSPORT_PROFILE.organisation}.
Their profile: ${PASSPORT_PROFILE.cpdHours} CPD hours, ${PASSPORT_PROFILE.certificates} certificates, ${PASSPORT_PROFILE.complianceScore}% compliance, ${PASSPORT_PROFILE.level} status.
Their specialisms: ${PASSPORT_PROFILE.specialisms.join(", ")}.
Their question: ${userMsg}
Give a helpful, specific, professional response in 2-4 sentences. Focus on UK fostering sector, CPD, and professional development.`,
      });
      setMessages(m => [...m, { role: "assistant", content: res }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  const visible = AI_COACH_RECS.filter(r => !dismissed.has(r.id));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header card */}
      <div className="card p-5 bg-gradient-to-r from-slate-900 to-blue-950 border-0 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-bold text-white">AI Professional Development Coach</h3>
              <span className="text-[9px] font-bold bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-full px-2 py-0.5">GPT-POWERED</span>
            </div>
            <p className="text-sm text-slate-300">Personalised recommendations based on your passport, compliance status, career goals and skills matrix.</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
              <span>🎯 {visible.length} active recommendations</span>
              <span>·</span>
              <span>📊 Analysed {PASSPORT_PROFILE.cpdHours}h CPD + {PASSPORT_PROFILE.certificates} certificates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recommendations */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Personalised Recommendations</h3>
          {visible.map((rec, i) => {
            const p = PRIORITY_CFG[rec.priority] || PRIORITY_CFG.medium;
            const PIcon = p.icon;
            return (
              <div key={i} className={`card border ${p.border} ${p.bg} p-4`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{rec.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${p.badge}`}>
                        <PIcon size={9} /> {p.label}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{rec.title}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{rec.detail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="h-7 px-3 text-[10px] font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1 transition-colors">
                        <BookOpen size={10} /> {rec.action}
                      </button>
                      <button onClick={() => setDismissed(s => new Set(s).add(i))} className="h-7 w-7 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center text-slate-400 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat */}
        <div className="card flex flex-col overflow-hidden" style={{ minHeight: 420 }}>
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">Ask Your Coach</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-100 text-slate-800 rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }} />)}
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask about your career, CPD, or next steps…"
              className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
            />
            <button onClick={send} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}