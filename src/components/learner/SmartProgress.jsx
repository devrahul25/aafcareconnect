import { Zap, Flame, Award, Trophy, TrendingUp, Star } from "lucide-react";
import { computeLevel, BADGES } from "@/lib/gamification";
import GamificationStats from "@/components/gamification/GamificationStats";
import AchievementBadges from "@/components/gamification/AchievementBadges";
import CompletionMilestones from "@/components/gamification/CompletionMilestones";
import LearningStreak from "@/components/gamification/LearningStreak";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeekGrid({ activity }) {
  return (
    <div className="flex items-end gap-1.5">
      {WEEK.map((day, i) => (
        <div key={day} className="flex flex-col items-center gap-1">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              activity[i]
                ? "bg-blue-600 shadow-sm shadow-blue-200"
                : "bg-slate-100"
            }`}
            title={day}
          >
            {activity[i] && <Zap size={12} className="text-white" />}
          </div>
          <span className="text-[9px] font-medium text-slate-400">{day[0]}</span>
        </div>
      ))}
    </div>
  );
}

function StreakBanner({ days }) {
  if (days === 0) return (
    <div className="card p-4 border-dashed border-2 border-slate-200 flex items-center gap-3 text-slate-400">
      <Flame size={20} />
      <div>
        <p className="text-sm font-semibold text-slate-600">Start your streak today</p>
        <p className="text-xs">Complete any lesson to begin a learning streak.</p>
      </div>
    </div>
  );
  return (
    <div className={`card p-4 border-l-4 flex items-center gap-3 ${days >= 7 ? "border-l-orange-400 bg-orange-50/50" : "border-l-blue-400 bg-blue-50/50"}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${days >= 7 ? "bg-orange-100" : "bg-blue-100"}`}>
        <Flame size={20} className={days >= 7 ? "text-orange-500" : "text-blue-500"} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{days}-day learning streak 🔥</p>
        <p className="text-xs text-slate-500">{days >= 7 ? "You're on fire! Keep the momentum going." : `${7 - days} more days to earn the Week of Dedication badge.`}</p>
      </div>
      <div className="ml-auto text-right">
        <p className="text-2xl font-heading font-black text-slate-900">{days}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-wide">days</p>
      </div>
    </div>
  );
}

function XPBar({ profile }) {
  const lvl = computeLevel(profile.xp);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Star size={14} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Level {lvl.level} — {lvl.title}</p>
            <p className="text-[11px] text-slate-400">{profile.xp.toLocaleString()} XP total</p>
          </div>
        </div>
        {!lvl.isMax && (
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {(lvl.nextXp - profile.xp).toLocaleString()} XP to Level {lvl.level + 1}
          </span>
        )}
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000 ease-out"
          style={{ width: `${lvl.progressPct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
        <span>Level {lvl.level}</span>
        {!lvl.isMax && <span>Level {lvl.level + 1}</span>}
      </div>
    </div>
  );
}

export default function SmartProgress({ profile, onCelebrate }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Level + XP bar */}
      <XPBar profile={profile} />

      {/* Stats grid */}
      <GamificationStats profile={profile} />

      {/* Streak banner + week heatmap */}
      <StreakBanner days={profile.streakDays} />
      <div className="card p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">This Week's Activity</p>
        <WeekGrid activity={profile.weekActivity} />
      </div>

      {/* Milestones */}
      <CompletionMilestones profile={profile} />

      {/* Badges */}
      <AchievementBadges earnedIds={profile.earnedBadges} />

      {/* Recent completion CTA */}
      {profile.recentCompletion && (
        <div className="card p-5 border-l-4 border-l-emerald-400 bg-emerald-50/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Trophy size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{profile.recentCompletion.course}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Completed {profile.recentCompletion.date} · +{profile.recentCompletion.xpEarned} XP
              </p>
            </div>
          </div>
          <button
            onClick={onCelebrate}
            className="h-9 px-4 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 flex items-center gap-2 flex-shrink-0 transition-colors"
          >
            <Zap size={13} /> Celebrate
          </button>
        </div>
      )}
    </div>
  );
}