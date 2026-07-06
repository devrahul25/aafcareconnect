import { Send, BookOpen, CheckCircle2 } from "lucide-react";
import { MANDATORY_TRAINING } from "@/lib/complianceData";

export default function MandatoryTracker() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Mandatory Training Tracker</h3>
            <p className="text-xs text-slate-400 mt-0.5">Compliance status across all mandatory training areas</p>
          </div>
          <button className="h-8 px-3 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 flex items-center gap-1.5 transition-colors">
            <Send size={11} /> Assign Overdue
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {MANDATORY_TRAINING.map(t => {
            const completedPct = Math.round((t.completed / t.required) * 100);
            const overduePct   = Math.round((t.overdue / t.required) * 100);
            const pendingPct   = 100 - completedPct;

            return (
              <div key={t.area} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-sm font-bold text-slate-900">{t.area}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold"><CheckCircle2 size={11} /> {t.completed}/{t.required} completed</span>
                    {t.overdue > 0 && (
                      <span className="font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">{t.overdue} overdue</span>
                    )}
                  </div>
                </div>

                {/* Stacked progress */}
                <div className="flex h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${completedPct - overduePct}%` }} />
                  <div className="h-full bg-red-400 transition-all duration-700" style={{ width: `${overduePct}%` }} />
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Completed</span>
                  {t.overdue > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block" /> Overdue</span>}
                  {pendingPct > overduePct && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-slate-200 inline-block" /> Pending</span>}
                </div>

                {t.overdue > 0 && (
                  <div className="mt-2 flex gap-2">
                    <button className="h-6 px-2.5 text-[10px] font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 flex items-center gap-1 transition-colors">
                      <BookOpen size={9} /> Assign to {t.overdue} staff
                    </button>
                    <button className="h-6 px-2.5 text-[10px] font-semibold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-100 flex items-center gap-1 transition-colors">
                      <Send size={9} /> Send Reminder
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}