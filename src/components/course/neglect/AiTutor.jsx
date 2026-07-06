import { useState } from "react";
import { Bot, X, Sparkles, BookOpen, MessageSquare, BrainCircuit, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";

const LESSON_CONTEXT = `You are the AI Tutor inside an AAF CareConnect safeguarding course lesson titled "Recognising Neglect".
The lesson covers: the definition of neglect; the five dimensions (physical, medical, educational, emotional, supervisory); a UK case study of Emily, age 10, who arrives hungry and in dirty clothes; the Recognise → Respond → Record → Report sequence; reporting via the Supervising Social Worker (SSW), Designated Safeguarding Lead (DSL) or MASH; calling 999 in immediate danger; never promising secrecy; the LADO for allegations against those working with children.
Audience: UK foster carers and social workers. Be concise, practical and grounded in UK guidance (Children Act 1989 & 2004, Working Together to Safeguard Children 2023, Keeping Children Safe in Education 2024).`;

const MODES = [
  { key: "explain", label: "Explain simply", icon: BookOpen, prompt: "Explain the key ideas of recognising neglect in simple language for a new foster carer." },
  { key: "summarise", label: "Summarise this lesson", icon: Sparkles, prompt: "Summarise this lesson on recognising neglect in 5 concise bullet points." },
  { key: "examples", label: "Give real-life examples", icon: MessageSquare, prompt: "Give 3 realistic UK fostering examples that illustrate the five dimensions of neglect." },
  { key: "quiz", label: "Quiz me", icon: BrainCircuit, prompt: "Ask me one multiple-choice revision question about recognising neglect, then wait for my answer." },
];

export default function AiTutor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (text) => {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${LESSON_CONTEXT}\n\nLearner request: ${text}`,
      });
      setMessages([...next, { role: "assistant", content: res }]);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "Sorry, I couldn't reach the AI tutor just now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 px-5 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 inline-flex items-center gap-2 font-semibold text-sm transition-colors">
        <Bot size={18} /> AI Tutor
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-fade-in">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center"><Bot size={18} className="text-white" /></div>
                <div>
                  <p className="font-heading font-bold text-slate-900">AI Tutor</p>
                  <p className="text-[11px] text-slate-400">Recognising Neglect · ask anything</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"><X size={16} /></button>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2 border-b border-slate-50">
              {MODES.map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.key} onClick={() => ask(m.prompt)} disabled={loading}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs font-semibold text-slate-700 disabled:opacity-50 transition-colors">
                    <Icon size={14} className="text-blue-600" /> {m.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-slate-400 py-8">
                  <Bot size={28} className="mx-auto mb-2 opacity-30" />
                  Ask me to explain, summarise, give examples, or quiz you on recognising neglect.
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-2xl px-3.5 py-2.5"><Loader2 size={16} className="animate-spin text-slate-400" /></div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(input)}
                placeholder="Ask the AI tutor…" className="flex-1 h-10 px-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => ask(input)} disabled={loading || !input.trim()} className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 disabled:opacity-40 transition-colors"><Send size={16} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}