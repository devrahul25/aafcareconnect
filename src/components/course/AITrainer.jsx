import { useState } from "react";
import {
  Play, Pause, Captions, FileText, Gauge, Sparkles,
  Send, X, Lightbulb, Volume2
} from "lucide-react";
import KnowledgeCheck from "./KnowledgeCheck";
import { base44 } from "@/api/base44Client";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export default function AITrainer({ lesson, courseTitle }) {
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [askText, setAskText] = useState("");
  const [askAnswer, setAskAnswer] = useState(null);
  const [askLoading, setAskLoading] = useState(false);

  const askAI = async () => {
    if (!askText.trim()) return;
    setAskLoading(true);
    setAskAnswer(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `A UK foster carer is taking the course "${courseTitle}". They are on the lesson "${lesson.title}". As a friendly safeguarding AI tutor, answer this question clearly and concisely (max 120 words), referencing UK guidance where relevant:\n\n"${askText}"`,
      });
      setAskAnswer(typeof res === "string" ? res : res?.response || JSON.stringify(res));
    } catch (e) {
      setAskAnswer("Sorry, the AI tutor isn't available right now. Please try again later.");
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      {/* AI presenter video area */}
      <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 min-h-[280px]">
        {/* Presenter placeholder */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-900/50">
            <Sparkles size={36} className="text-white" />
          </div>
          <p className="text-white font-heading font-bold text-lg">AI Safeguarding Trainer</p>
          <p className="text-blue-300 text-sm mt-0.5">{lesson.title}</p>

          <button
            onClick={() => setPlaying(!playing)}
            className="mt-5 w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all mx-auto"
          >
            {playing ? <Pause size={22} className="text-white" /> : <Play size={22} className="text-white ml-0.5" />}
          </button>
        </div>

        {/* Captions */}
        {showCaptions && playing && lesson.transcript && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-2xl px-4 py-2 bg-black/70 rounded-lg text-white text-sm text-center leading-snug">
            {lesson.transcript.slice(0, 120)}…
          </div>
        )}
      </div>

      {/* Video controls */}
      <div className="bg-slate-950 px-5 py-3 flex items-center gap-4 flex-wrap">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
        >
          {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        {/* Speed control */}
        <div className="relative">
          <button
            onClick={() => setSpeedOpen(!speedOpen)}
            className="h-8 px-3 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Gauge size={13} /> {speed}×
          </button>
          {speedOpen && (
            <div className="absolute bottom-9 left-0 bg-slate-800 rounded-lg shadow-xl py-1 z-20">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSpeed(s); setSpeedOpen(false); }}
                  className={`w-full px-4 py-1.5 text-xs font-medium text-left hover:bg-slate-700 transition-colors ${s === speed ? "text-blue-400" : "text-slate-200"}`}
                >
                  {s}×
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowCaptions(!showCaptions)}
          className={`h-8 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${showCaptions ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
        >
          <Captions size={13} /> Captions
        </button>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className={`h-8 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${showTranscript ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
        >
          <FileText size={13} /> Transcript
        </button>

        <button
          onClick={() => setAskOpen(true)}
          className="ml-auto h-8 px-3 text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles size={13} /> Ask AI Tutor
        </button>
      </div>

      {/* Transcript */}
      {showTranscript && lesson.transcript && (
        <div className="bg-slate-900 px-5 py-3 max-h-40 overflow-y-auto border-t border-white/5">
          <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><FileText size={12}/> Transcript</p>
          <p className="text-sm text-slate-300 leading-relaxed">{lesson.transcript}</p>
        </div>
      )}

      {/* Knowledge checks */}
      {lesson.questions && lesson.questions.length > 0 && (
        <div className="bg-white px-6 py-5 overflow-y-auto border-t border-slate-200">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
            <Lightbulb size={13} className="text-amber-500" /> Knowledge Check
          </p>
          {lesson.questions.map((q, i) => (
            <KnowledgeCheck key={i} question={q} />
          ))}
        </div>
      )}

      {/* Ask AI Tutor modal */}
      {askOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-slate-900 text-sm">Ask AI Tutor</h2>
                  <p className="text-[11px] text-slate-400">{lesson.title}</p>
                </div>
              </div>
              <button onClick={() => { setAskOpen(false); setAskAnswer(null); setAskText(""); }} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <textarea
                value={askText}
                onChange={(e) => setAskText(e.target.value)}
                placeholder="Ask about anything in this lesson — e.g. 'Who do I report a disclosure to after hours?'"
                rows={3}
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              {askLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><div className="w-4 h-4 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" /> Tutor is thinking…</div>}
              {askAnswer && (
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 text-sm text-slate-700 leading-relaxed">{askAnswer}</div>
              )}
              <button
                onClick={askAI}
                disabled={!askText.trim() || askLoading}
                className="w-full h-9 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={13} /> {askLoading ? "Asking…" : "Ask Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}