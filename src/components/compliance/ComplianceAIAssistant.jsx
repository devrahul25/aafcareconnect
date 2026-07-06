// @ts-nocheck
import { useState } from "react";
import { Sparkles, Send, TrendingDown, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { AGENCY_SCORE, SCORE_TREND } from "@/lib/complianceData";
import { base44 } from "@/api/base44Client";

const INSIGHTS = [
  { icon: TrendingUp,    color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", text: `Compliance improved by ${SCORE_TREND}% this month. Top performers: Sarah Mitchell (100%), Priya Sharma (98%).` },
  { icon: AlertTriangle, color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     text: "James Okafor and Claire Nguyen are high-risk. First Aid and LAC certificates are expired — immediate renewal required." },
  { icon: TrendingDown,  color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   text: "5 staff have overdue Equality & Diversity training. Recommend assigning refresher now to prevent score decline." },
  { icon: Lightbulb,     color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    text: "Predicted risk: 3 additional certificates expire within 60 days. Proactive renewal now avoids a compliance dip." },
];

const QUICK_PROMPTS = [
  "Which staff are high risk?",
  "What training is overdue?",
  "Are we Ofsted ready?",
  "What certificates expire next month?",
];

export default function ComplianceAIAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hello! I'm your AI Compliance Assistant for AAF CareConnect™. 🛡️\n\nYour current agency compliance score is **${AGENCY_SCORE}%** — up ${SCORE_TREND}% this month. I've identified 2 high-risk staff members requiring immediate action.\n\nHow can I help you today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI Compliance Assistant for a UK fostering agency on AAF CareConnect™.
Agency context:
- Overall compliance score: ${AGENCY_SCORE}% (up ${SCORE_TREND}% this month)
- 10 staff total. High risk: James Okafor (62%), Claire Nguyen (51%)
- Expired certs: Paediatric First Aid (James), LAC (Claire), Safeguarding L2 (Claire)
- Overdue training: 5 staff on Equality & Diversity, 3 on First Aid, 2 on Safeguarding
- Ofsted readiness: 92%
User question: ${msg}
Answer in 2-4 sentences. Be specific, data-driven and professional. Focus on compliance, Ofsted, UK fostering regulations.`,
      });
      setMessages(m => [...m, { role: "assistant", content: res }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "I'm having trouble connecting. Please try again shortly." }]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* AI insights */}
      <div className="card p-5 bg-gradient-to-r from-slate-900 to-blue-950 border-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Compliance Intelligence</h3>
            <p className="text-xs text-slate-400">Real-time analysis of your agency's compliance data</p>
          </div>
          <span className="ml-auto text-[9px] font-bold bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-full px-2 py-0.5">LIVE ANALYSIS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INSIGHTS.map((ins, i) => {
            const Icon = ins.icon;
            return (
              <div key={i} className={`${ins.bg} border ${ins.border} rounded-xl p-3 flex items-start gap-3`}>
                <Icon size={15} className={`${ins.color} flex-shrink-0 mt-0.5`} />
                <p className="text-xs text-slate-700 leading-relaxed">{ins.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="card flex flex-col overflow-hidden" style={{ minHeight: 440 }}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900">Ask the Compliance Assistant</span>
        </div>

        {/* Quick prompts */}
        <div className="p-3 border-b border-slate-50 flex gap-2 flex-wrap">
          {QUICK_PROMPTS.map(q => (
            <button key={q} onClick={() => send(q)}
              className="h-7 px-3 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors">
              {q}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
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
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay:`${i*0.1}s` }} />)}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-100 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about compliance, risks, Ofsted readiness…"
            className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400" />
          <button onClick={() => send()} disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 transition-colors">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}