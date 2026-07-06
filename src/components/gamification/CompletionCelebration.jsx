import { useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Sparkles, Zap, Award } from "lucide-react";
import { BADGES } from "@/lib/gamification";
import BadgeIcon from "./BadgeIcon";
import { BADGE_BG } from "./badgeStyles";

export default function CompletionCelebration({ open, onClose, profile, courseTitle }) {
  useEffect(() => {
    if (!open) return;
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.5 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] });
    const t = setTimeout(() => confetti({ particleCount: 70, spread: 120, origin: { y: 0.35 }, colors: ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"] }), 350);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;
  const rc = profile?.recentCompletion || {};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in overflow-hidden text-center">
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
          <X size={16} />
        </button>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
          <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3">
            <Sparkles size={30} />
          </div>
          <h2 className="font-heading font-bold text-2xl">Course Complete!</h2>
          <p className="text-blue-100 text-sm mt-1">{courseTitle || rc.course}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <Zap size={16} className="text-blue-600 mx-auto mb-1" />
              <p className="font-heading font-bold text-xl text-slate-900">+{rc.xpEarned || 0}</p>
              <p className="text-xs text-slate-400">XP earned</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-3">
              <Award size={16} className="text-violet-600 mx-auto mb-1" />
              <p className="font-heading font-bold text-xl text-slate-900">{rc.newBadges?.length || 0}</p>
              <p className="text-xs text-slate-400">New badges</p>
            </div>
          </div>
          {rc.newBadges?.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              {rc.newBadges.map((id) => {
                const b = BADGES.find((x) => x.id === id);
                return b ? (
                  <span key={id} className={`w-10 h-10 rounded-full flex items-center justify-center ${BADGE_BG[b.color]}`}>
                    <BadgeIcon name={b.icon} size={18} className="text-white" />
                  </span>
                ) : null;
              })}
            </div>
          )}
          <button onClick={onClose} className="w-full h-10 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}