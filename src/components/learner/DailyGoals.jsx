import { useState } from "react";
import { Target, CheckCircle2, Circle, Flame, Zap } from "lucide-react";

const GOAL_MINUTES = 20;

const DAILY_GOALS = [
  { id: 1, label: "Complete 1 lesson today", xp: 50, done: true, type: "lesson" },
  { id: 2, label: "Answer 3 knowledge checks", xp: 30, done: true, type: "check" },
  { id: 3, label: "Read the Disclosure Recording guide", xp: 20, done: false, type: "resource" },
  { id: 4, label: "Earn 100 XP today", xp: 0, done: false, type: "xp" },
];

const STREAK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_DONE = [true, true, true, false, true, true, false];

export default function DailyGoals() {
  const [goals, setGoals] = useState(DAILY_GOALS);
  const done = goals.filter((g) => g.done).length;
  const total = goals.length;
  const pct = Math.round((done / total) * 100);
  const xpToday = goals.filter((g) => g.done).reduce((s, g) => s + g.xp, 0);

  const toggle = (id) =>
    setGoals((gs) => gs.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));

  return (
    <div className="card p-5 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-sm">
            <Target size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Daily Study Goals</p>
            <p className="text-[11px] text-slate-400">{done} of {total} completed · {xpToday} XP earned today</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
          <Flame size={12} /> 12 day streak
        </div>
      </div>

      {/* Goal progress bar */}
      <div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-400">
          <span>{pct}% of daily goal</span>
          <span>{GOAL_MINUTES} min target</span>
        </div>
      </div>

      {/* Goal items */}
      <div className="space-y-2">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => toggle(g.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-200 group ${
              g.done
                ? "bg-emerald-50 border-emerald-200"
                : "bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            {g.done ? (
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
            ) : (
              <Circle size={16} className="text-slate-300 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
            )}
            <span className={`flex-1 text-sm font-medium ${g.done ? "line-through text-slate-400" : "text-slate-700"}`}>
              {g.label}
            </span>
            {g.xp > 0 && (
              <span className={`text-[10px] font-bold flex items-center gap-0.5 ${g.done ? "text-emerald-600" : "text-slate-400"}`}>
                <Zap size={9} className={g.done ? "text-amber-500" : ""} /> +{g.xp} XP
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Weekly streak dots */}
      <div className="border-t border-slate-100 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">This Week</p>
        <div className="flex gap-1.5">
          {STREAK_DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`h-6 rounded-md flex items-center justify-center transition-all ${
                  STREAK_DONE[i]
                    ? "bg-orange-500 shadow-sm shadow-orange-200"
                    : "bg-slate-100"
                }`}
              >
                {STREAK_DONE[i] && <Flame size={10} className="text-white" />}
              </div>
              <span className="text-[9px] font-medium text-slate-400">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}