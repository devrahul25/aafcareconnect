import { CheckCircle2, Circle } from "lucide-react";
import { MILESTONES } from "@/lib/gamification";

function metricValue(profile, type) {
  if (type === "courses") return profile.coursesCompleted;
  if (type === "xp") return profile.xp;
  if (type === "streak") return profile.streakDays;
  if (type === "badges") return profile.earnedBadges.length;
  return 0;
}

export default function CompletionMilestones({ profile }) {
  return (
    <div className="card p-5">
      <h2 className="font-heading font-bold text-slate-900 mb-1">Completion Milestones</h2>
      <p className="text-xs text-slate-400 mb-4">Track your long-term learning goals</p>
      <div className="space-y-4">
        {MILESTONES.map((m) => {
          const val = Math.min(metricValue(profile, m.type), m.target);
          const done = val >= m.target;
          const pct = Math.round((val / m.target) * 100);
          return (
            <div key={m.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {done ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Circle size={15} className="text-slate-300" />}
                  <span className={`text-sm font-medium ${done ? "text-emerald-700" : "text-slate-700"}`}>{m.label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {val}/{m.target}{m.reward ? ` · +${m.reward} XP` : ""}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${done ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}