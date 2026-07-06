import { X } from "lucide-react";
import { LEARNER_GAMIFICATION } from "@/lib/gamification";
import GamificationStats from "./GamificationStats";
import AchievementBadges from "./AchievementBadges";
import CompletionMilestones from "./CompletionMilestones";

export default function LearnerProfileDrawer({ learner, onClose }) {
  if (!learner) return null;
  const g = LEARNER_GAMIFICATION[learner.id] || { xp: 0, streakDays: 0, earnedBadges: [], coursesCompleted: 0 };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${learner.color} flex items-center justify-center text-white font-bold text-lg`}>{learner.avatar}</div>
            <div>
              <p className="font-heading font-bold text-slate-900">{learner.name}</p>
              <p className="text-xs text-slate-400">{learner.role} · Learner Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <GamificationStats profile={g} />
          <AchievementBadges earnedIds={g.earnedBadges} />
          <CompletionMilestones profile={g} />
        </div>
      </div>
    </div>
  );
}