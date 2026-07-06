import { useState } from "react";
import { Play, Pause, Captions, FileText, Gauge, Sparkles, Volume2 } from "lucide-react";

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

export default function VideoBlock({ transcript, title }) {
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [speedOpen, setSpeedOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
      {/* AI presenter video area */}
      <div className="relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 min-h-[260px]">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-2xl shadow-blue-900/40">
            <Sparkles size={28} className="text-white" />
          </div>
          <p className="text-white font-heading font-bold">AI Safeguarding Trainer</p>
          <p className="text-blue-300 text-xs mt-0.5">{title}</p>
          <button
            onClick={() => setPlaying(!playing)}
            className="mt-4 w-12 h-12 rounded-full bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/25 transition mx-auto"
          >
            {playing ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
          </button>
        </div>
        {showCaptions && playing && transcript && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-xl px-4 py-2 bg-black/70 rounded-lg text-white text-sm text-center leading-snug">
            {transcript.slice(0, 120)}…
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900 px-4 py-2.5 flex items-center gap-2.5 flex-wrap">
        <button onClick={() => setPlaying(!playing)} className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors">
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <div className="relative">
          <button onClick={() => setSpeedOpen(!speedOpen)} className="h-7 px-2.5 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1.5 transition-colors">
            <Gauge size={12} /> {speed}×
          </button>
          {speedOpen && (
            <div className="absolute bottom-9 left-0 bg-slate-800 rounded-lg shadow-xl py-1 z-20">
              {SPEEDS.map((s) => (
                <button key={s} onClick={() => { setSpeed(s); setSpeedOpen(false); }} className={`w-full px-4 py-1.5 text-xs text-left hover:bg-slate-700 transition-colors ${s === speed ? "text-blue-400" : "text-slate-200"}`}>{s}×</button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setShowCaptions(!showCaptions)} className={`h-7 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${showCaptions ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}>
          <Captions size={12} /> Captions
        </button>
        <button onClick={() => setShowTranscript(!showTranscript)} className={`h-7 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${showTranscript ? "bg-blue-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}>
          <FileText size={12} /> Transcript
        </button>
        <span className="ml-auto text-[11px] text-slate-400 flex items-center gap-1"><Volume2 size={12} /> AI narration</span>
      </div>

      {showTranscript && transcript && (
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5"><FileText size={12} /> Transcript</p>
          <p className="text-sm text-slate-600 leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
}