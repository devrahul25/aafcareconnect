import { useState } from "react";
import { Sparkles, ChevronRight, AlertTriangle, Clock, TrendingUp, BookOpen, X } from "lucide-react";
import { AI_RECOMMENDATIONS } from "@/lib/cpdData";

const PRIORITY_CFG = {
  urgent: { bg: "bg-red-50",    border: "border-red-200",   badge: "bg-red-600 text-white",   icon: AlertTriangle, label: "Urgent" },
  high:   { bg: "bg-amber-50",  border: "border-amber-200", badge: "bg-amber-500 text-white",  icon: TrendingUp,    label: "High Priority" },
  medium: { bg: "bg-blue-50",   border: "border-blue-200",  badge: "bg-blue-600 text-white",   icon: BookOpen,      label: "Recommended" },
};

export default function AICoachCPD() {
  const [dismissed, setDismissed] = useState(new Set());
  const [expanded, setExpanded] = useState(null);

  const visible = AI_RECOMMENDATIONS.filter(r => !dismissed.has(r.id));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card p-5 bg-gradient-to-r from-slate-900 to-blue-950 border-0 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/30">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-bold text-white">AI Professional Development Coach</h3>
              <span className="text-[9px] font-bold bg-blue-500/30 text-blue-300 border border-blue-500/40 rounded-full px-2 py-0.5">BETA</span>
            </div>
            <p className="text-sm text-slate-300">
              Personalised training recommendations based on your role, compliance status, skills matrix and learning history.
            </p>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
              <span>📊 Analysed {AI_RECOMMENDATIONS.length * 3} data points</span>
              <span>·</span>
              <span>🔄 Updated daily</span>
              <span>·</span>
              <span className="text-blue-400 font-semibold">{visible.length} active recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {visible.length === 0 && (
        <div className="card p-8 text-center text-slate-400">
          <Sparkles size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">All recommendations actioned — great work! 🎉</p>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((rec) => {
          const p = PRIORITY_CFG[rec.priority] || PRIORITY_CFG.medium;
          const PIcon = p.icon;
          const isExp = expanded === rec.id;
          return (
            <div key={rec.id} className={`card border ${p.border} ${p.bg} overflow-hidden transition-all duration-200`}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${p.badge}`}>
                        <PIcon size={9} /> {p.label}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white rounded-full px-2 py-0.5">{rec.category}</span>
                      <span className="text-[10px] text-slate-400">{rec.hours}h CPD</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rec.provider}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setExpanded(isExp ? null : rec.id)}
                      className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center text-slate-500 transition-all"
                    >
                      <ChevronRight size={13} className={`transition-transform ${isExp ? "rotate-90" : ""}`} />
                    </button>
                    <button
                      onClick={() => setDismissed(s => new Set(s).add(rec.id))}
                      className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* Expanded reasoning */}
                {isExp && (
                  <div className="mt-3 pt-3 border-t border-white/60 space-y-3 animate-fade-in">
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Why this recommendation?</p>
                      <p className="text-xs text-slate-700 leading-relaxed">{rec.reason}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock size={10} />
                        <span>{rec.dueContext}</span>
                      </div>
                      <button className="h-7 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
                        <BookOpen size={10} /> Find Course
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}