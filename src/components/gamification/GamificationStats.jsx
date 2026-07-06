import { Zap, Flame, Award, Trophy } from "lucide-react";
import { computeLevel, BADGES } from "@/lib/gamification";

export default function GamificationStats({ profile }) {
  const lvl = computeLevel(profile.xp);
  const cards = [
    { label: "Total XP",         value: profile.xp.toLocaleString(),    icon: Zap,    bg: "bg-blue-600",    sub: `Level ${lvl.level} · ${lvl.title}` },
    { label: "Learning Streak",  value: `${profile.streakDays} days`,   icon: Flame,  bg: "bg-orange-500",  sub: profile.streakDays >= 7 ? "On fire!" : "Keep going" },
    { label: "Badges Earned",    value: `${profile.earnedBadges.length} / ${BADGES.length}`, icon: Award, bg: "bg-violet-600", sub: "achievements unlocked" },
    { label: "Courses Completed", value: profile.coursesCompleted,      icon: Trophy, bg: "bg-emerald-600", sub: "lifetime" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-500 leading-tight">{c.label}</p>
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={14} className="text-white" />
                </div>
              </div>
              <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{c.value}</p>
              <p className="text-[11px] text-slate-400">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Level progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="badge bg-blue-600 text-white">Level {lvl.level}</span>
            <span className="text-sm font-semibold text-slate-700">{lvl.title}</span>
          </div>
          <span className="text-xs font-medium text-slate-400">
            {lvl.isMax ? "Max level reached" : `${lvl.nextXp - profile.xp} XP to Level ${lvl.level + 1}`}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${lvl.progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}