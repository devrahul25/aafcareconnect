import { useState, useEffect } from "react";
import { ACHIEVEMENTS } from "@/lib/passportData";
import confetti from "canvas-confetti";

const TIER_CFG = {
  bronze:   { ring: "ring-amber-400",   bg: "bg-gradient-to-br from-amber-50 to-orange-50",   border: "border-amber-200",   label: "Bronze",   text: "text-amber-700"  },
  silver:   { ring: "ring-slate-400",   bg: "bg-gradient-to-br from-slate-50 to-slate-100",   border: "border-slate-300",   label: "Silver",   text: "text-slate-600"  },
  gold:     { ring: "ring-yellow-400",  bg: "bg-gradient-to-br from-yellow-50 to-amber-50",   border: "border-yellow-300",  label: "Gold",     text: "text-yellow-700" },
  platinum: { ring: "ring-violet-400",  bg: "bg-gradient-to-br from-violet-50 to-purple-50",  border: "border-violet-300",  label: "Platinum", text: "text-violet-700" },
};

export default function PassportAchievements() {
  const [celebrated, setCelebrated] = useState(false);
  const earned = ACHIEVEMENTS.filter(a => a.earned);
  const locked = ACHIEVEMENTS.filter(a => !a.earned);

  useEffect(() => {
    if (!celebrated) {
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.4 }, colors: ["#f59e0b","#2563eb","#10b981","#7c3aed"] });
        setCelebrated(true);
      }, 600);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary strip */}
      <div className="card p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🏆</div>
          <div>
            <h3 className="font-heading font-bold text-amber-900 text-lg">{earned.length} Achievements Earned</h3>
            <p className="text-sm text-amber-700">{locked.length} more achievements to unlock. Keep developing!</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-heading font-bold text-amber-700">{Math.round((earned.length/ACHIEVEMENTS.length)*100)}%</p>
            <p className="text-xs text-amber-600">Complete</p>
          </div>
        </div>
      </div>

      {/* Earned badges */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Earned Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {earned.map(a => {
            const t = TIER_CFG[a.tier] || TIER_CFG.bronze;
            return (
              <div key={a.id} className={`group ${t.bg} border ${t.border} rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}>
                <div className={`w-16 h-16 mx-auto rounded-2xl ring-4 ${t.ring} flex items-center justify-center text-3xl mb-3 shadow-sm bg-white`}>
                  {a.icon}
                </div>
                <p className={`text-xs font-bold ${t.text} mb-1`}>{a.label}</p>
                <p className="text-[10px] text-slate-500 leading-snug">{a.desc}</p>
                <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full border ${t.border} ${t.text} ${t.bg}`}>{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Locked — Keep Going</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {locked.map(a => {
            const t = TIER_CFG[a.tier] || TIER_CFG.bronze;
            return (
              <div key={a.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center opacity-50 grayscale">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-200 flex items-center justify-center text-3xl mb-3 shadow-sm grayscale">
                  {a.icon}
                </div>
                <p className="text-xs font-bold text-slate-500 mb-1">{a.label}</p>
                <p className="text-[10px] text-slate-400 leading-snug">{a.desc}</p>
                <span className="inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-300 text-slate-400 bg-slate-100">{t.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}