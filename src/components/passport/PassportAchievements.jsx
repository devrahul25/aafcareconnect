import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

const TIER_CFG = {
  bronze:   { ring: "ring-amber-400",   bg: "bg-gradient-to-br from-amber-50 to-orange-50",   border: "border-amber-200",   label: "Bronze",   text: "text-amber-700"  },
  silver:   { ring: "ring-slate-400",   bg: "bg-gradient-to-br from-slate-50 to-slate-100",   border: "border-slate-300",   label: "Silver",   text: "text-slate-600"  },
  gold:     { ring: "ring-yellow-400",  bg: "bg-gradient-to-br from-yellow-50 to-amber-50",   border: "border-yellow-300",  label: "Gold",     text: "text-yellow-700" },
  platinum: { ring: "ring-violet-400",  bg: "bg-gradient-to-br from-violet-50 to-purple-50",  border: "border-violet-300",  label: "Platinum", text: "text-violet-700" },
};

export default function PassportAchievements({ achievements = [] }) {
  const [celebrated, setCelebrated] = useState(false);

  const earned = achievements.filter(a => a.earned);
  const locked = achievements.filter(a => !a.earned);
  const total = achievements.length || 1;
  const pct = Math.round((earned.length / total) * 100);

  useEffect(() => {
    if (!celebrated && earned.length > 0) {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.4 },
          colors: ["#f59e0b", "#2563eb", "#10b981", "#7c3aed"],
        });
        setCelebrated(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [celebrated, earned.length]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary strip */}
      <div className="card p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🏆</div>
          <div>
            <h3 className="font-heading font-bold text-amber-900 text-lg">
              {earned.length} Achievements Unlocked
            </h3>
            <p className="text-sm text-amber-700">
              {locked.length > 0
                ? `${locked.length} more achievements to unlock. Complete courses and earn CPD hours to level up!`
                : "Outstanding work! You have unlocked all milestone achievements."}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-heading font-bold text-amber-700">{pct}%</p>
            <p className="text-xs text-amber-600 font-semibold">Completed</p>
          </div>
        </div>
      </div>

      {/* Earned badges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Earned Achievements ({earned.length})
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ✓ Verified Accomplishments
          </span>
        </div>
        {earned.length === 0 ? (
          <div className="card p-8 text-center bg-white border border-slate-200">
            <p className="text-xs text-slate-500">No achievements unlocked yet. Enrol in a course to earn your first badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {earned.map(a => {
              const t = TIER_CFG[a.tier] || TIER_CFG.bronze;
              return (
                <div
                  key={a.id}
                  className={`group ${t.bg} border ${t.border} rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl ring-4 ${t.ring} flex items-center justify-center text-3xl mb-3 shadow-sm bg-white group-hover:scale-105 transition-transform`}
                    >
                      {a.icon}
                    </div>
                    <p className={`text-xs font-bold ${t.text} mb-1`}>{a.label}</p>
                    <p className="text-[10px] text-slate-500 leading-snug">{a.desc}</p>
                  </div>
                  <div className="mt-3">
                    <span
                      className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${t.border} ${t.text} bg-white/70`}
                    >
                      {t.label} · Unlocked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Locked Achievements ({locked.length})
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">Next Milestones</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {locked.map(a => {
              const t = TIER_CFG[a.tier] || TIER_CFG.bronze;
              return (
                <div
                  key={a.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-center opacity-60 hover:opacity-85 transition-opacity flex flex-col justify-between"
                >
                  <div>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-200/80 border border-slate-300/50 flex items-center justify-center text-3xl mb-3 shadow-sm grayscale">
                      {a.icon}
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1">{a.label}</p>
                    <p className="text-[10px] text-slate-500 leading-snug">{a.desc}</p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-300 text-slate-500 bg-white">
                      🔒 {t.label} Locked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}