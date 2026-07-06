import { Lock } from "lucide-react";
import { BADGES } from "@/lib/gamification";
import BadgeIcon from "./BadgeIcon";
import { BADGE_BG, BADGE_BG_SOFT, BADGE_RING } from "./badgeStyles";

export default function AchievementBadges({ earnedIds = [] }) {
  const earned = new Set(earnedIds);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-slate-900">Achievement Badges</h2>
        <span className="text-xs font-semibold text-slate-400">{earned.size} of {BADGES.length} earned</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {BADGES.map((b) => {
          const has = earned.has(b.id);
          return (
            <div key={b.id} className={`rounded-xl p-4 text-center border transition-all ${has ? `${BADGE_BG_SOFT[b.color]} border-slate-200` : "bg-slate-50 border-slate-200 opacity-60"}`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${has ? `${BADGE_BG[b.color]} ring-2 ring-offset-2 ${BADGE_RING[b.tier]} ring-offset-white` : "bg-slate-200"}`}>
                {has ? <BadgeIcon name={b.icon} size={20} className="text-white" /> : <Lock size={16} className="text-slate-400" />}
              </div>
              <p className="text-xs font-bold text-slate-700 leading-tight">{b.name}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{b.desc}</p>
              <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">{b.tier}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}