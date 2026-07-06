import { Flame } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function LearningStreak({ profile }) {
  const weekActivity = profile.weekActivity || [];
  const streakDays = profile.streakDays || 0;
  const goal = 7;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading font-bold text-slate-900">Learning Streak</h2>
          <p className="text-xs text-slate-400 mt-0.5">Stay consistent — learn a little every day</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Flame size={20} className={streakDays >= 7 ? "text-orange-500" : "text-orange-300"} />
          </div>
          <div>
            <p className="font-heading font-bold text-2xl text-slate-900 leading-none">{streakDays}</p>
            <p className="text-[10px] text-slate-400">day streak</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((d, i) => (
          <div key={d} className="text-center">
            <div className={`h-12 rounded-xl flex items-center justify-center ${weekActivity[i] ? "bg-gradient-to-br from-orange-400 to-orange-500" : "bg-slate-100"}`}>
              {weekActivity[i] && <Flame size={16} className="text-white" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{d}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        {streakDays >= goal ? "Incredible — you've exceeded your weekly goal!" : `${Math.max(goal - streakDays, 0)} days to reach your 7-day goal. Keep it up!`}
      </p>
    </div>
  );
}