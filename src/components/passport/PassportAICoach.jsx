import { Sparkles, ArrowRight, AlertTriangle, Star, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const PRIORITY_CFG = {
  urgent: { badge: "bg-red-100 text-red-700 border-red-200", border: "border-red-300", bg: "bg-red-50/50" },
  high:   { badge: "bg-amber-100 text-amber-700 border-amber-200", border: "border-amber-300", bg: "bg-amber-50/50" },
  medium: { badge: "bg-blue-100 text-blue-700 border-blue-200", border: "border-blue-200", bg: "bg-blue-50/40" },
};

export default function PassportAICoach({ recommendations = [], profile = {} }) {
  const userName = profile?.name || "Practitioner";
  const level = profile?.level || "Bronze Learner";
  const nextLevel = profile?.nextLevel || "Silver Practitioner";
  const pointsToNext = profile?.pointsToNext || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Coach Banner */}
      <div className="card p-6 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl rounded-2xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold">
              <Sparkles size={14} className="text-violet-300" />
              <span>AI Professional Career & Compliance Coach</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-white">
              Personalized Development Insights for {userName}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your verified CPD records, current Level (<span className="text-amber-400 font-bold">{level}</span>),
              and live compliance status, our intelligent system identifies high-impact learning opportunities to accelerate your career progression.
            </p>
          </div>

          <div className="bg-white/10 border border-white/15 rounded-xl p-4 text-center min-w-[180px] flex-shrink-0 backdrop-blur-md">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Next Level Goal</p>
            <p className="text-sm font-bold text-amber-300 mt-1">{nextLevel}</p>
            <p className="text-2xl font-heading font-bold text-white mt-1">{pointsToNext}</p>
            <p className="text-[10px] text-slate-300">points needed to advance</p>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tailored Recommendations ({recommendations.length})
          </h3>
          <span className="text-[10px] font-semibold text-slate-400">Dynamically Updated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => {
            const cfg = PRIORITY_CFG[rec.priority] || PRIORITY_CFG.medium;

            return (
              <div
                key={i}
                className={`card p-5 border ${cfg.border} ${cfg.bg} flex flex-col justify-between hover:shadow-md transition-shadow rounded-2xl`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rec.icon || "💡"}</span>
                      <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${cfg.badge}`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{rec.detail}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-end">
                  {rec.link ? (
                    <Link
                      to={rec.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      <span>{rec.action || "Take Action"}</span>
                      <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">{rec.action}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}